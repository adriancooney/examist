import logging
from logging.handlers import RotatingFileHandler
from flask import Flask, Blueprint
from fyp.server import api
from fyp.server.database import db
from fyp.server.response import fail, respond
from fyp.server.exc import HttpException
from fyp.server import config

app = Flask(__name__)

# Surpress warning
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

print "Blueprints:"
for name, blueprint in api.__dict__.iteritems():
    if isinstance(blueprint, Blueprint):
        print "\t %s" % name
        app.register_blueprint(blueprint)

# Print out all the rules
print "Routes:"
for rule in sorted([rule for rule in app.url_map.iter_rules()], key = str):
    for method in rule.methods:
        if method == "OPTIONS" or method == "HEAD":
            continue
        print "\t %s \t %s" % (method, str(rule))

# App errors
@app.errorhandler(HttpException)
def handle_http_exception(exception):
    return fail(exception.code, exception.message)

# Parameter errors
@app.errorhandler(422)
def handle_validation_error(err):
    messages = ["%s, %s" % (name, msg[0]) for name, msg in err.data["messages"].iteritems()]
    return fail(422, messages[0])

if not config.APP_DEBUG:
    @app.errorhandler(Exception)
    def handle_exception(exception):
        return fail(500, str(exception))

if __name__ == '__main__':
    if config.APP_LOG:
        handler = RotatingFileHandler(config.APP_LOG, maxBytes=10000, backupCount=1)
        handler.setLevel(logging.DEBUG)
        logging.getLogger('werkzeug').addHandler(handler)
        app.logger.addHandler(handler)

    # Connect it to the datavase
    app.config["SQLALCHEMY_DATABASE_URI"] = config.DATABASE_URI.format(**config)
    db.init_app(app)

    app.run(port=config.APP_PORT, host=config.APP_HOST, debug=config.APP_DEBUG)