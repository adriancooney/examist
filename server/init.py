import logging
from logging.handlers import RotatingFileHandler
from fyp.server.database import db
from fyp.server.web import app
from fyp.server import config

if __name__ == "__main__":
    # Create logs
    if config.APP_LOG:
        handler = RotatingFileHandler(config.APP_LOG, maxBytes=10000, backupCount=1)
        handler.setLevel(logging.DEBUG)
        logging.getLogger('werkzeug').addHandler(handler)
        app.logger.addHandler(handler)

    db.init_app(app)

    # And off we go!
    app.run(port=config.APP_PORT, host=config.APP_HOST, debug=config.APP_DEBUG)