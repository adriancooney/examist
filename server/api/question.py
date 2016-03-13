from flask import Blueprint, request, g
from sqlalchemy.orm.exc import NoResultFound
from webargs import fields
from marshmallow import validate
from webargs import fields
from webargs.flaskparser import use_kwargs, parser
from server import model, config
from server.middleware import authorize
from server.database import db
from server.response import respond, success
from server.exc import NotFound, LoginError, AlreadyExists, InvalidEntity
from server.library.model import query

Question = Blueprint("question", __name__)

@Question.route("/course/<course>/paper/<year>/<period>/q/", methods=["POST"])
def create_question(course, year, period):
    pass

PUT_PARAMS = { "content": fields.Str(), "marks": fields.Int() }

@Question.route("/course/<course>/paper/<year>/<period>/q/<question>", methods=["GET", "PUT"])
@use_kwargs({
    "course": fields.Str(required=True),
    "year": fields.Int(required=True),
    "period": fields.Str(required=True, validate=validate.OneOf(model.Paper.PAPER_PERIODS)),
    "question": fields.Str(required=True)
}, locations=("view_args",))
@authorize
def do_question(course, year, period, question):
    question = model.Question.get_by_path(db.session, course, year, period, map(int, question.split(".")))

    if request.method == "GET":
        return respond({
            "question": question,
            "children": question.flatten_tree(include_self=False)
        })
    elif request.method == "PUT":
        args = parser.parse(PUT_PARAMS, request)

        if "content" in args:
            question.set_content(g.user, args["content"])

        if "marks" in args:
            question.marks = args["marks"]

        db.session.add(question)
        db.session.commit()

        return success()