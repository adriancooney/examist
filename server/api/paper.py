from flask import Blueprint
from sqlalchemy.orm.exc import NoResultFound
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
@Paper.route("/course/<course>/paper/<year>/<period>.html", methods=["GET"])
@use_kwargs({
    "course": fields.Str(required=True),
    "year": fields.Int(required=True),
    "period": fields.Str(required=True, validate=validate.OneOf(model.Paper.PAPER_PERIODS))
}, locations=("view_args",))
def get_paper(course, year, period):
    try:
        paper = db.session.query(model.Paper).filter(
            (model.Course.code == course.upper()) & \
            (model.Paper.course_id == model.Course.id) & \
            (model.Paper.year_start == year) & \
            (model.Paper.period == period)
        ).one()
    except NoResultFound:
        raise NotFound("Paper")

    return respond({ "paper": paper.dump() })