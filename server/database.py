from flask.ext.sqlalchemy import SQLAlchemy
from server.library.model import Model as ModelBase
from server import config

db = SQLAlchemy(model_class=ModelBase)

# For nicer exports
Model = db.Model

def get_model(name):
    """Get a model by name."""
    return Model._decl_class_registry.get(name)