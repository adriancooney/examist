import logging
import pprint
from sqlalchemy.inspection import inspect
from sqlalchemy.orm.relationships import RelationshipProperty
from marshmallow import Schema, fields, validate

logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

def create_schema(cls, include_fk=False, required=True, force_strict=True):
    ins = inspect(cls)

    model_name = cls.__name__
    schema_name = model_name + "Schema"
    schema = {}

    if hasattr(cls, "Meta"):
        meta = getattr(cls, "Meta")

        if force_strict:
            setattr(meta, "strict", True)

    elif force_strict:
        meta = type("Meta", (object,), dict(strict=True))

    field_args = dict(required=required)

    logger.debug("<Schema(name=%s)>" % model_name)

    for name, attr in dict(ins.attrs).iteritems():
        # Get arguments for each field
        meta_field_args = getattr(meta, name, {})

        if isinstance(attr, RelationshipProperty):
            nested_model_name = attr.mapper.class_.__name__
            only = meta_field_args.pop("only", tuple([col.name for col in attr.mapper.primary_key]))

            if len(only) == 1:
                only = only[0]

            logger.debug("<Schema(name={})> += <Relationship(name={}, model={}, many={}, only={})>".format(
                model_name, name, nested_model_name, attr.uselist, only))

            schema[name] = fields.Nested(nested_model_name + "Schema", 
                many=attr.uselist, only=only)
        else:
            column = getattr(cls, name)

            # Skip the foreign keys
            if not include_fk and column.foreign_keys:
                continue

            type_ = column.type
            type_name = _normalize_typename(type_.__class__.__name__)

            logger.debug("<Schema(name={})> += <Field(name={}, type={}, args={})>".format(
                model_name, name, type_name, field_args))

            # Grab the marshmallow type
            schema[name] = _get_field_for_type(attr, type_, type_name, field_args)

    schema["Meta"] = meta

    return type(schema_name, (Schema,), schema)

def _normalize_typename(type_name):
    # Normalize the typenames in cascading fashion
    if type_name in ["Text"]:
        type_name = "String"

    if type_name in ["ARRAY"]:
        type_name = "List"

    return type_name

def _get_field_for_type(attr, type_, type_name, field_args):
    # Handle special types, otherwise we have a 1-1 mapping
    # of types from marshmallow to SQLAlchemy
    if type_name == "Enum":
        return fields.Str(validate=validate.OneOf(attr.expression.type.enums), **field_args)
    elif type_name == "List":
        # Sort out the nested type for a list
        list_type = type_.item_type
        list_type_name = list_type.__class__.__name__
        return fields.List(_get_field_for_type(attr, list_type, _normalize_typename(list_type_name), field_args), **field_args)
    else:
        return  getattr(fields, type_name)(**field_args)

def schema(model, **kwargs):
    """Return a new schema from the model."""
    return model.__schema__(**kwargs)