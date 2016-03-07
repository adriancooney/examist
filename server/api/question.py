from flask import Blueprint, request
from sqlalchemy.orm.exc import NoResultFound
from webargs import fields
from marshmallow import validate
from webargs import fields
from webargs.flaskparser import use_kwargs
from server import model
from server.database import db
from server.response import respond, success
from server.exc import NotFound, LoginError, AlreadyExists, InvalidEntity
from server import config

Question = Blueprint("question", __name__)

@Question.route("/course/<course>/paper/<year>/<period>/q/", methods=["POST"])
def create_question(course, year, period):
    pass

@Question.route("/course/<course>/paper/<year>/<period>/q/<question>", methods=["GET", "PUT"])
@use_kwargs({
    "course": fields.Str(required=True),
    "year": fields.Int(required=True),
    "period": fields.Str(required=True, validate=validate.OneOf(model.Paper.PAPER_PERIODS)),
    "question": fields.Str(required=True)
}, locations=("view_args",))
def do_question(course, year, period, question):
    paper = model.Paper.find(db.session, course, year, period)