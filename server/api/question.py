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
from server.exc import NotFound, LoginError, AlreadyExists, InvalidEntity, Forbidden
from server.library.model import query
from server.api.paper import URL_PARAMS as PAPER_URL_PARAMS

Question = Blueprint("question", __name__)

URL_PARAMS = dict(
    question = fields.Str(required=True),
    **(PAPER_URL_PARAMS.copy())
)

POST_PARAMS = model.Question.__schema__(
    only=("index", "content", "marks"),
    partial=("content", "marks")
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
    question = model.Question(paper, index=args["index"])

    if "content" in args:
        question.set_content(g.user, args["content"])

    db.session.add(question)
    db.session.commit()
    db.session.refresh(question)

    # Load the paper
    getattr(question, "paper")

    return respond({ "question": question })

@Question.route("/course/<course>/paper/<year>/<period>/q/<question>", methods=["GET", "PUT", "POST", "DELETE"])
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
            updated = []

            # Update a question
            if "content" in args:
                question.set_content(g.user, args["content"])

            if "marks" in args:
                question.marks = args["marks"]

            if "index_type" in args:
                question.update_index_type(args["index_type"])

                # Update the indexes of all siblings
                for sibling in question.parent.children:
                    sibling.update_index_type(args["index_type"])
                    updated.append(sibling)

            updated.append(question)
            db.session.add_all(updated)
            db.session.commit()
            map(db.session.refresh, updated)

            return respond({ "questions": updated })
        elif request.method == "POST":
            # Create a child question    
            paper = model.Paper.find(db.session, course, year, period)
            new_question = model.Question(paper, index=args["index"], parent=question)

            if "content" in args:
                new_question.set_content(g.user, args["content"])

            db.session.add(new_question)

            with query(model.Question):
                db.session.commit()

            db.session.refresh(new_question)
            getattr(new_question, "paper")
            getattr(new_question, "parent")

            return respond({ "question": new_question })
        elif request.method == "DELETE":
            if len(question.children):
                raise Forbidden("Question still has children. Please remove children before removing.")

            modified = []
            db.session.delete(question)

            # Decrement any indexes further up the list
            if question.parent:
                db.session.flush()
                for sibling in question.parent.children:
                    if sibling.index > question.index:
                        sibling.update_index(sibling.index - 1)
                        modified.append(sibling)

                db.session.add_all(modified)
            
            db.session.commit()
            map(db.session.refresh, modified)

            return respond({ "questions": modified })