import pytest
import traceback
import random
import os
import json
from faker import Faker
from sqlalchemy_utils import database_exists, create_database, drop_database
from server.test import APIClient
from server.web import app as _app
from server import config
from server.database import db as _db
from server import model

DB_NAME = config.DB_NAME + "_test"

# Data generation
fake = Faker()
with open(os.path.join(os.path.dirname(__file__), "../data/example.json")) as data_file:
    data = json.load(data_file)

@pytest.fixture(scope="session")
def app(request):
    """Session-wide test `Flask` application."""
    config.DB_NAME = DB_NAME
    DATABASE_URI = config.DATABASE_URI.format(**config.__dict__)

    if not database_exists(DATABASE_URI):
        create_database(DATABASE_URI)

    print "Test Database: %s" % DATABASE_URI

    # Config the app
    _app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE_URI
    _app.config["TESTING"] = True

    # Establish an application context before running the tests.
    ctx = _app.app_context()
    ctx.push()

    def teardown():
        ctx.pop()

    request.addfinalizer(teardown)
    return _app

@pytest.fixture(scope="session")
def db(app, request):
    """Session-wide test database."""

    _db.init_app(app)
    _db.drop_all()
    _db.create_all()

    return _db
    
@pytest.fixture(scope="session")
def client(db, app):
    """Creates a new test client."""
    app.test_client_class = APIClient
    return app.test_client()

@pytest.fixture
def session(db, monkeypatch, request):
    """Creates a new database session for a test."""
    print marker("SESSION START (%s/%s)" % (request.module.__name__, request.function.__name__))
    connection = db.engine.connect()
    transaction = connection.begin()

    # Fix from https://github.com/mitsuhiko/flask-sqlalchemy/pull/249
    monkeypatch.setattr(db, "get_engine", lambda *args: connection)

    def teardown():
        transaction.rollback()
        connection.close()
        db.session.remove()
        print marker("SESSION ROLLBACK (%s/%s)" % (request.module.__name__, request.function.__name__))

    request.addfinalizer(teardown)
    return db.session

@pytest.fixture
def institution(session):
    instit = model.Institution(
        name="National University of Ireland",
        code="NUIG",
        domain="nuigalway.ie",
    )

    session.begin(subtransactions=True)
    session.add(instit)
    session.flush()
    return instit

@pytest.fixture
def user(institution, session):
    """Creates a default, not logged in user."""
    user = model.User(name="Adrian", email="a.cooney10@nuigalway.ie", password="root", institution=institution)
    session.begin(subtransactions=True)
    session.add(user)
    session.flush()
    return user

@pytest.fixture
def modules(session, institution):
    modules = []

    # Add five modules
    for module in data["modules"]:
        modules.append(model.Module(
            name=module["name"], 
            code=module["code"],
            institution=institution
        ))

    session.add_all(modules)
    session.flush()

    return modules

@pytest.fixture
def user_with_modules(user, modules, session):
    user.modules = modules
    session.add(user)
    session.flush()
    return user

@pytest.fixture
def auth_client(user, session, client):
    userSession = user.login("root")
    session.add(user)
    session.flush()

    setattr(client, "key", userSession.key)
    client.default_environ["headers"] = [("Auth-Key", "%s" % userSession.key)]
    
    return client

def marker(text, spacer="-", size=40):
    return "\n\n{} {} {}\n".format(spacer*size, text, spacer*size)