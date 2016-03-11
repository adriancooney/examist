from flask.ext.sqlalchemy import SQLAlchemy
from server.library.model import Model as ModelBase
from server import config

db = SQLAlchemy(model_class=ModelBase)

# For nicer exports
Model = db.Model