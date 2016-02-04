import logging
from flask import Flask
from logging.handlers import RotatingFileHandler
from fyp.server.response import fail, respond
from fyp.server.exc import HttpException
from fyp.server import config
from fyp.server.config import Session

app = Flask(__name__)
session = Session()

@app.route("/institution/<institution>")
def get_institution(institution):
    """Get an institution by id."""
    return respond({ 'institution': institution })

@app.errorhandler(HttpException)
def handle_http_exception(exception):
    return fail(exception.code, exception.message)

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

    app.run(port=config.APP_PORT, host=config.APP_HOST, debug=config.APP_DEBUG)