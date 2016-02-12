from marshmallow import Schema
from marshmallow_sqlalchemy import fields_for_model

def create_schema(model, meta={}):
    """Automatically create a schema for a SQL Alchemy model. Sweet."""
    fields = fields_for_model(model)

    meta["strict"] = True
    for fieldname, field in fields.iteritems():
        field.required = True # Force all to be required

    return type(model.__name__ + "Schema", (Schema,), dict(Meta=type("Meta", (object,), meta), **fields))

def schema(model, **kwargs):
    """Return a new schema from the model."""
    return model.__schema__(**kwargs)