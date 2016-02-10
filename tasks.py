import os
from invoke import run, task
from jinja2 import Template
from sqlalchemy.sql import text
from server.web import app
from server.database import db

@task(name="db")
def database(force=False):
    with app.app_context():
        # Create the database
        if force:
            db.drop_all()
            
        db.create_all()

@task
def config():
    """Generate a config based on the environment variables."""

    config_template = os.path.join(os.path.dirname(__file__), "server/config.py.tpl")
    with open(config_template) as config:
        # Render the config. See the config template for variables
        # that need to be set.
        tpl = Template(config.read())

        print tpl.render(**os.environ)
