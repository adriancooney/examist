import tempfile
from os import environ as env
from os.path import join, dirname

DB_USER = env["DB_USER"]
DB_PASS = env["DB_PASS"]
DB_HOST = env.get("DB_HOST", "localhost")
DB_PORT = int(env.get("DB_PORT", 5432))
DB_NAME = env["DB_NAME"]

APP_PORT = int(env.get("APP_PORT", 5000))
APP_HOST = env.get("APP_HOST", "127.0.0.1")
APP_DEBUG = bool(env.get("APP_DEBUG", False))
APP_LOG = env.get("APP_LOG", join(dirname(__file__), "logs/access.log"))
APP_DOWNLOAD_DIR = env.get("APP_DOWNLOAD_DIR", tempfile.gettempdir())

DATABASE_URI = "postgresql+psycopg2://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}"