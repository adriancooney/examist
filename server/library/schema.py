import pprint
from sqlalchemy.inspection import inspect
from sqlalchemy.orm.relationships import RelationshipProperty
from marshmallow import Schema, fields, validate

def create_schema(cls, include_fk=False, required=True, force_strict=True):
    ins = inspect(cls)

    schemaName = cls.__name__ + "Schema"
    schema = {}

    field_kwargs = dict(required=required)

    for name, attr in dict(ins.attrs).iteritems():
        if isinstance(attr, RelationshipProperty):
            only = tuple([col.name for col in attr.mapper.primary_key])

            if len(only) == 1:
                only = only[0]

            # To prevent circular references, we have to 

            schema[name] = fields.Nested(attr.mapper.class_.__name__ + "Schema", 
                many=attr.uselist, only=only)
        else:
            column = getattr(cls, name)

            # Skip the foreign keys
            if not include_fk and column.foreign_keys:
                continue

            type_ = column.type
            typeName = type_.__class__.__name__

            # Handle special types, otherwise we have a 1-1 mapping
            # of types from marshmallow to SQLAlchemy
            if typeName == "Enum":
                field = fields.Str(validate=validate.OneOf(attr.expression.type.enums), **field_kwargs)
            else:
                field = getattr(fields, typeName)(**field_kwargs)

            # Grab the marshmallow type
            schema[name] = field

    if hasattr(cls, "Meta"):
        meta = getattr(cls, "Meta")

        if force_strict:
            setattr(meta, "strict", True)

    elif force_strict:
        meta = type("Meta", (object,), dict(strict=True))

    schema["Meta"] = meta

    return type(schemaName, (Schema,), schema)

def schema(model, **kwargs):
    """Return a new schema from the model."""
    return model.__schema__(**kwargs)