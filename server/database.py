from flask_sqlalchemy import SQLAlchemy
from server import config

db = SQLAlchemy()

# For nicer exports
Model = db.Model

if __name__ == "__main__":
    # Flask migrations
    from flask_script import Manager
    from flask_migrate import Migrate, MigrateCommand
    from server import model
    from server.web import app

    db.init_app(app)
    migrate = Migrate(app, db)

    manager = Manager(app)
    manager.add_command("migrate", MigrateCommand)

    manager.run()
