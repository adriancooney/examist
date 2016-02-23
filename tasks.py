import os
import csv
import re
from invoke import run, task
from jinja2 import Template
from sqlalchemy.sql import text
from server.web import app
from server.database import db
from server import model

def setup_db():
    ctx = app.app_context()
    ctx.push()
    db.init_app(app)

@task
def config():
    """Generate a config based on the environment variables."""

    config_template = os.path.join(os.path.dirname(__file__), "server/config.py.tpl")
    with open(config_template) as config:
        # Render the config. See the config template for variables
        # that need to be set.
        tpl = Template(config.read())

        # Print the template to stdout
        print tpl.render(**os.environ)

@task
def db_insert_modules():
    """Insert the modules into the database."""
    setup_db()

    modules_csv = os.path.join(os.path.dirname(__file__), "data/modules.csv")

    # First find NUIG
    nuig = model.Institution.getBy(db.session, domain="nuigalway.ie")

    # Import the modules
    with open(modules_csv, "rb") as data_file:
        rows = csv.reader(data_file)
        code_extractor = re.compile(r"([^\-]+)-(?:[A-Z]+)?(\d+)?")
        modules = []

        for row in rows:
            # Fix the NUIG codes
            match = code_extractor.match(row[0])
            code = match.group(1)
            idx = match.group(2)

            if idx:
                idx = int(idx)
                code = code + "-" + str(idx - 1) if idx > 1 else code

            print code

            modules.append(model.Module(
                code = code,
                name = row[1],
                institution = nuig
            ))

    db.session.add_all(modules)
    db.session.commit()