from flask.ext.sqlalchemy import SQLAlchemy, Model
from flask.ext.jsontools import JsonSerializableBase
from server import config

class ModelBase(Model, JsonSerializableBase):
    pass

db = SQLAlchemy(model_class=ModelBase)

# For nicer exports
Model = db.Model