from flask import Blueprint
from sqlalchemy.orm import joinedload
from webargs import fields
from webargs.flaskparser import parser, use_kwargs
from server import model
from server.middleware import authorize
from server.library.schema import schema
from server.database import db
from server.response import respond, success
from server.exc import NotFound, LoginError, AlreadyExists, InvalidEntity

Course = Blueprint("course", __name__)

COURSE_RESULTS_LIMIT = 10

@Course.route("/course/search", methods=["GET"])
@use_kwargs({ "q": fields.Str(required=True) }, locations=("query",))
@authorize
def search_course(q):
    # Replace any + with spaces
    q = q.replace("+", " ")

    # Execute the query
    courses = model.Course.query.filter(
        model.Course.name.ilike("%{}%".format(q)) | \
        model.Course.code.ilike("%{}%".format(q)) 
    ).limit(COURSE_RESULTS_LIMIT).all()

    return respond({ 
        "courses": courses
    })

@Course.route("/course/<course>", methods=["GET"])
@use_kwargs({ "course": fields.Str(required=True) }, locations=("view_args",))
@authorize
def get_course(course):
    course = model.Course.getBy(db.session, code=course.upper())

    return respond({ 
        "course": course,
        "papers": course.papers
    })

@Course.route("/course/<course>/index", methods=["PUT"])
@use_kwargs({ "course": fields.Str(required=True) }, locations=("view_args",))
@authorize
def index_course_questions(course):
    course = model.Course.getBy(db.session, code=course.upper())
    indexed_questions = course.index_questions()
    db.session.add_all(indexed_questions)
    db.session.commit()
    return success()
