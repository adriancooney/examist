import pprint
from marshmallow import Schema
from marshmallow_sqlalchemy import fields_for_model, ModelSchemaOpts

def create_schema(model, meta={}, include_fk=True):
    """Automatically create a schema for a SQL Alchemy model. Sweet."""
    fields = fields_for_model(model, include_fk=include_fk)

    meta["strict"] = True
    meta["model"] = model
    for fieldname, field in fields.iteritems():
        field.required = True # Force all to be required

    return type(model.__name__ + "Schema", (Schema,), dict(
        OPTIONS_CLASS = ModelSchemaOpts,
        Meta = type("Meta", (object,), meta),
        **fields))

def schema(model, **kwargs):
    """Return a new schema from the model."""
    return model.__schema__(**kwargs)