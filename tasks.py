from invoke import run, task
from sqlalchemy.sql import text
from fyp.server.model import *
from fyp.server.config import engine

@task
def database():
    # Create the database
    Base.metadata.create_all(engine)
