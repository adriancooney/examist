from flask import Blueprint
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
    results = model.Course.query.filter(
        model.Course.name.ilike("%{}%".format(q)) | \
        model.Course.code.ilike("%{}%".format(q)) 
    ).limit(COURSE_RESULTS_LIMIT).all()

    courseSchema = schema(model.Course)

    return respond({ 
        "courses": courseSchema.dump(results, many=True).data if len(results) > 0 else []
    })

@Course.route("/course/<course>", methods=["GET"])
@use_kwargs({ "course": fields.Str(required=True) }, locations=("view_args",))
@authorize
def get_course(course):
    course = model.Course.getBy(db.session, code=course.upper())
    dump = course.dump()

    # Add the papers to the schema
    dump["papers"] = schema(model.Paper).dump(course.papers, many=True).data

    return respond({ "course": dump })