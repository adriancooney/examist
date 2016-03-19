import logging
import sys

# Setup the logging
root = logging.getLogger()
stdout = logging.StreamHandler(stream=sys.stdout)
root.addHandler(stdout)

from server import config
from server.database import db
from server.web import app

if __name__ == "__main__":
    db.init_app(app)

    # And off we go!
    app.run(port=config.APP_PORT, host=config.APP_HOST, debug=config.APP_DEBUG)