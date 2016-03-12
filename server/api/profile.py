from flask import Blueprint, g, request
from webargs import fields
from webargs.flaskparser import parser
from server import model
from server.library.util import find
from server.database import db
from server.response import respond, fail, success
from server.middleware import authorize
from server.library.schema import schema
from server.exc import NotFound, UnacceptableParameter

Profile = Blueprint("Profile", __name__)

# Add via ID
patchParams = { "course": fields.Int(required=True) }

@Profile.route("/profile/courses/", methods=["GET", "PATCH", "DELETE"], strict_slashes=False)
@authorize
def get_and_update_courses():
    if request.method == "GET":
        # Return the user's courses
        return respond({ 
            "courses": g.user.courses
        })
    else:
        args = parser.parse(patchParams, request)
        id = args["course"]

        try:
            course = model.Course.getBy(db.session, id=id)
        except NotFound:
            return UnacceptableParameter("Course with id '%d' does not exist." % id)

        # Find the course
        userCourse = find(g.user.courses, lambda c: c.id == course.id)

        if request.method == "PATCH":
            # Patch request i.e. append to the collection
            # Ensure it's not already in the users courses
            if userCourse:
                return success() # Ignorance is bliss

            # Add the course
            g.user.courses.append(course)
        else:
            # Delete the course from the collection
            # Ensure we have the course
            if not userCourse:
                return success()
            
            # Remove the course
            g.user.courses.remove(userCourse)

        db.session.add(g.user)
        db.session.commit()
        return success()