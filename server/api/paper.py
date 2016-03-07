from os import path
from flask import Blueprint, request, send_file
from webargs import fields
from marshmallow import validate
from webargs import fields
from webargs.flaskparser import use_kwargs
from server import model
from server.database import db
from server.response import respond, success
from server.exc import NotFound, LoginError, AlreadyExists, InvalidEntity
from server import config

Paper = Blueprint("paper", __name__)

@Paper.route("/course/<course>/paper/<year>/<period>", methods=["GET"])
@Paper.route("/course/<course>/paper/<year>/<period>.html", methods=["GET"])
@use_kwargs({
    "course": fields.Str(required=True),
    "year": fields.Int(required=True),
    "period": fields.Str(required=True, validate=validate.OneOf(model.Paper.PAPER_PERIODS))
}, locations=("view_args",))
def get_paper(course, year, period):
    paper = model.Paper.find(db.session, course, year, period)

    if request.url.endswith("html"):
        # Request paper contents
        if not paper.contents:
            # If it doesn't exist, start the download
            paper.download(config.APP_DOWNLOAD_DIR)
            db.session.add(paper)
            db.session.commit()

        # Respond with the file
        return send_file(path.join(paper.contents.path, "index.html"), mimetype="text/html")

    else:
        course = paper.course.dump()
        paper = paper.dump()
        paper["course"] = course

        # Request paper data
        return respond({ "paper": paper })