import os
import csv
from server import model
from server.migrations.data import db

courses_csv = os.path.join(os.path.dirname(__file__), "../../../data/courses.csv")

# First find NUIG
nuig = model.Institution.getBy(db.session, domain="nuigalway.ie")

# Import the courses
with open(courses_csv, "rb") as data_file:
    rows = csv.reader(data_file)
    courses = []

    for row in rows:
        courses.append(model.Course(
            code = row[0],
            name = row[1],
            institution = nuig
        ))

db.session.add_all(courses)
db.session.commit()