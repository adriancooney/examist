import os
import csv
from server import model
from server.migrations.data import db

modules_csv = os.path.join(os.path.dirname(__file__), "../../../data/modules.csv")

# First find NUIG
nuig = model.Institution.getBy(db.session, domain="nuigalway.ie")

# Import the modules
with open(modules_csv, "rb") as data_file:
    rows = csv.reader(data_file)
    modules = []

    for row in rows:
        modules.append(model.Module(
            code = row[0],
            name = row[1],
            institution = nuig
        ))

db.session.add_all(modules)
db.session.commit()