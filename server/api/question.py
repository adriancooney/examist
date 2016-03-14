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
from server.api.paper import URL_PARAMS as PAPER_URL_PARAMS

Question = Blueprint("question", __name__)

URL_PARAMS = dict(
    question = fields.Str(required=True),
    **(PAPER_URL_PARAMS.copy())
)

POST_PARAMS = model.Question.__schema__(
    only=("index", "index_type", "content", "marks"),
    partial=("index_type", "content", "marks")
)

PUT_PARAMS = model.Question.__schema__(
    only=("index_type", "content", "marks"),
    partial=True
)

@Question.route("/course/<course>/paper/<year>/<period>/q/", methods=["POST"])
@use_kwargs(PAPER_URL_PARAMS, locations=("view_args",))
@authorize
def create_question(course, year, period):
    args = parser.parse(POST_PARAMS, request)
    paper = model.Paper.find(db.session, course, year, period)
    question = model.Question(paper, index=args["index"], index_type=args["index_type"])

    if "content" in args:
        question.set_content(g.user, args["content"])

    db.session.add(question)
    db.session.commit()
    return respond({ "question": question })

@Question.route("/course/<course>/paper/<year>/<period>/q/<question>", methods=["GET", "PUT", "POST"])
@use_kwargs(URL_PARAMS, locations=("view_args",))
@authorize
def do_question(course, year, period, question):
    # Ensure we parse the args before we do any database access
    if request.method == "PUT":
        args = parser.parse(PUT_PARAMS, request)
    elif request.method == "POST":
        args = parser.parse(POST_PARAMS, request)
    else:
        args = None

    question = model.Question.get_by_path(db.session, course, year, period, map(int, question.split(".")))

    if request.method == "GET":
        return respond({
            "question": question,
            "children": question.flatten_tree(include_self=False)
        })
    else: 
        if request.method == "PUT":
            # Update a question
            if "content" in args:
                question.set_content(g.user, args["content"])

            if "marks" in args:
                question.marks = args["marks"]

            db.session.add(question)
            db.session.commit()

            return success()
        elif request.method == "POST":
            # Create a child question    
            paper = model.Paper.find(db.session, course, year, period)
            new_question = model.Question(paper, index=args["index"], index_type=args["index_type"], parent=question)

            if "content" in args:
                new_question.set_content(g.user, args["content"])

            db.session.add(new_question)

            with query(model.Question):
                db.session.commit()

            return respond({ "question": new_question })