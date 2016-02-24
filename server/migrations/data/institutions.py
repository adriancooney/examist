from server import model
from server.migrations.data import db

nuig = model.Institution(
    name="National University of Ireland",
    code="NUIG",
    domain="nuigalway.ie"
)

db.session.add(nuig)
db.session.commit()