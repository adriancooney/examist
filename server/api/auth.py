from flask import Blueprint, request, session, g
from webargs import fields, validate
from webargs.flaskparser import use_kwargs
from server.model import User
from server.database import db
from server.response import respond, success
from server.exc import HttpException, NotFound
from server.library.util import merge
from server.library.schema import schema
from server.middleware import authorize

Auth = Blueprint("auth", __name__)

@Auth.route("/login", methods=["POST"])
@use_kwargs(schema(User, only=('email', 'password')))
def auth(email, password):
    """Log a user in.
        POST { username: String, password: String }
            -> 200 { success: Boolean, session: String }
            -> 400 
        PUT { session }
            -> 200 # Session key valid
            -> 400 # Session key invalid
    """

    try:
        # Get the user
        user = User.getBy(db.session, email=email)
    except NotFound:
        raise HttpException(403, "Account not found.", { "email": email })

    session = user.login(password)
    db.session.add(user)
    db.session.commit()

    return respond(merge({ "key": session.key}, user.dump(exclude=("password",))))

@Auth.route("/auth", methods=["GET"])
@authorize
def check_auth():
    return success()