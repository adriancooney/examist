import logging
import pprint
from sqlalchemy.inspection import inspect
from sqlalchemy.orm.relationships import RelationshipProperty
from marshmallow import Schema, fields, validate

logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

def create_schema(cls, include_fk=False, required=True, force_strict=True):
    ins = inspect(cls)

    modelName = cls.__name__
    schemaName = modelName + "Schema"
    schema = {}

    field_kwargs = dict(required=required)

    if hasattr(cls, "Meta"):
        meta = getattr(cls, "Meta")

        if force_strict:
            setattr(meta, "strict", True)

    elif force_strict:
        meta = type("Meta", (object,), dict(strict=True))

    logger.debug("<Schema(name=%s)>" % modelName)

    for name, attr in dict(ins.attrs).iteritems():
        if isinstance(attr, RelationshipProperty):
            nestedModelName = attr.mapper.class_.__name__
            only = tuple([col.name for col in attr.mapper.primary_key])

            if len(only) == 1:
                only = only[0]

            logger.debug("<Schema(name=%s)> += <Relationship(name=%s, model=%s, many=%r, only=%r)>" % (modelName, name, nestedModelName, attr.uselist, only))
            schema[name] = fields.Nested(nestedModelName + "Schema", 
                many=attr.uselist, only=only)
        else:
            column = getattr(cls, name)

            # Skip the foreign keys
            if not include_fk and column.foreign_keys:
                continue

            type_ = column.type
            typeName = type_.__class__.__name__

            logger.debug("<Schema(name=%s)> += <Field(name=%s, type=%s, args=%r)>" % (modelName, name, typeName, field_kwargs))

            # Handle special types, otherwise we have a 1-1 mapping
            # of types from marshmallow to SQLAlchemy
            if typeName == "Enum":
                field = fields.Str(validate=validate.OneOf(attr.expression.type.enums), **field_kwargs)
            else:
                field = getattr(fields, typeName)(**field_kwargs)

            # Grab the marshmallow type
            schema[name] = field

    schema["Meta"] = meta

    return type(schemaName, (Schema,), schema)

def schema(model, **kwargs):
    """Return a new schema from the model."""
    return model.__schema__(**kwargs)