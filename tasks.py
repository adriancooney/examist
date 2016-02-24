import os
from invoke import run, task
from jinja2 import Template
from sqlalchemy.sql import text
from server import model

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