from flask_sqlalchemy import SQLAlchemy
from fyp.server import config

db = SQLAlchemy()

# For nicer exports
Model = db.Model 