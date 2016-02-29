from flask import Blueprint
from webargs import fields
from marshmallow import validate
from webargs import fields
from webargs.flaskparser import use_kwargs
from server import model
from server.database import db
from server.response import respond, success
from server.exc import NotFound, LoginError, AlreadyExists, InvalidEntity

Paper = Blueprint("paper", __name__)

@Paper.route("/course/<course>/paper/<year>/<period>", methods=["GET"])
@use_kwargs({
    "course": fields.Str(required=True),
    "year": fields.Int(required=True),
    "period": fields.Str(required=True, validate=validate.OneOf(model.Paper.PAPER_PERIODS))
}, locations=("view_args",))
def get_paper(course, year, period):
    course = model.Course.getBy(db.session, code=course.upper())
    paper = model.Paper.getBy(db.session, course_id=course.id, year_start=year, period=period).dump()
    paper["course"] = course.dump()
    return respond({ "paper": paper })