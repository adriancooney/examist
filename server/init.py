import logging
import sys

from server import config
from server.database import db
from server.cache import cache, get_view_func
from server.web import app

logger = logging.getLogger(__name__)

if __name__ == "__main__":
    db.init_app(app)
    cache.init_app(app)

    logger = logging.getLogger("server")
    sqla_logger = logging.getLogger("sqlalchemy")
    handler = logging.StreamHandler(stream=sys.stdout)
    logger.addHandler(handler)
    logger.setLevel(logging.INFO)
    sqla_logger.addHandler(handler)
    sqla_logger.setLevel(logging.DEBUG)

    items = [(key, value) for key, value in config.__dict__.iteritems() if key.startswith("APP_") or key.startswith("DB_")]

    for key, value in sorted(items, key=lambda t: t[0]):
        logger.info("{:>20}: {}".format(key, str(value)))

    # And off we go!
    app.run(port=config.APP_PORT, host=config.APP_HOST, debug=config.APP_DEBUG)