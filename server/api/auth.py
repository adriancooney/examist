from flask import Blueprint, request, session
from webargs import fields, validate
from webargs.flaskparser import use_kwargs
from fyp.server.library.util import merge
from fyp.server.database import db
from fyp.server.response import respond
from fyp.server.model import User
from fyp.server.api.schemas import UserSchema
from fyp.server.exc import HttpException, NotFound

Auth = Blueprint("auth", __name__)

@Auth.route("/login", methods=["POST"])
@use_kwargs(UserSchema(only=('email', 'password')))
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
        raise HttpException(403, "Account not found." % email, { "email": email })

    session = user.login(db.session, password)

    return respond(merge({ "key": session.key}, user.dump(UserSchema(exclude=("password",)))))
