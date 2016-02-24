from server.web import app
from server.database import db

# Setup the database
ctx = app.app_context()
ctx.push()
db.init_app(app)