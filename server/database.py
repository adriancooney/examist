from flask_sqlalchemy import SQLAlchemy
from server import config

db = SQLAlchemy()

# For nicer exports
Model = db.Model