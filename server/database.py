from flask_sqlalchemy import SQLAlchemy
from server import config

db = SQLAlchemy()

# For nicer exports
Model = db.Model

if __name__ == "__main__":
    # Flask migrations
    from flask_script import Manager
    from flask_migrate import Migrate, MigrateCommand
    from server.model import *
    from server.web import app

    # Configure the database with the app
    db.init_app(app)
    migrate = Migrate(app, db)
    manager = Manager(app)

    # Add the migrations command
    manager.add_command("db", MigrateCommand)

    @manager.command
    def create():
        db.create_all()

    manager.run()
