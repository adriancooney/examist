import logging
from flask import Flask, Blueprint, request
from server.middleware import AUTH_HEADER_NAME
from server.response import fail, respond, abort, DynamicJSONEncoder
from server.exc import HttpException, NotFound
from server import config

app = Flask(__name__)

# Connect it to the database
app.config["SQLALCHEMY_DATABASE_URI"] = config.DATABASE_URI.format(**config.__dict__)
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Set our JSON encoder to call the dynamic __json__ on objects passed.
app.json_encoder = DynamicJSONEncoder

# Setup our logging
if config.APP_DEBUG:
    logging.basicConfig(format="%(message)s")

# Import and setup out API
from server import api

# Register all the blueprints
for name, blueprint in api.__dict__.iteritems():
    if isinstance(blueprint, Blueprint):
        app.register_blueprint(blueprint)

# Parameter errors
@app.errorhandler(422)
def handle_validation_error(err):
    messages = [(name, msg[0]) for name, msg in err.data["messages"].iteritems()]
    name, message = messages[0]
    return fail(422, message, { "field": name })

@app.errorhandler(404)
def handle_error(err):
    return fail(404, "Page not found.")

# App errors
@app.errorhandler(HttpException)
def handle_http_exception(exception):
    return fail(exception.code, exception.message, exception.meta)

if config.APP_DEBUG:
    # Print SQLAlchemy queries
    app.config["SQLALCHEMY_ECHO"] = True

    @app.before_request
    def handle_before_request():
        print ">> %s %s %r" % (request.method, request.path, request.data)

    # Allow for CORS in development
    @app.after_request
    def handle_after_request(resp):
        if request.method == "OPTIONS":
            resp.status_code = 200

        resp.headers["Access-Control-Allow-Methods"] = "GET, POST, HEAD, OPTIONS, PATCH, DELETE, PUT"
        resp.headers["Access-Control-Allow-Origin"] = "*"
        resp.headers["Access-Control-Allow-Headers"] = "origin, content-type, accept, " + AUTH_HEADER_NAME.lower()
        return resp

if not config.APP_DEBUG:
    # Handle app exceptions and don't let the app die
    @app.errorhandler(Exception)
    def handle_exception(exception):
        return fail(500, str(exception))