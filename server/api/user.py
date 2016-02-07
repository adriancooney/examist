from flask import Blueprint, request, session
from sqlalchemy.exc import IntegrityError
from webargs import fields, validate
from webargs.flaskparser import parser, use_args
from fyp.server.database import db
from fyp.server.response import respond, success
from fyp.server import model
from fyp.server.api.schemas import UserSchema
from fyp.server.exc import NotFound, LoginError, AlreadyExists

User = Blueprint("user", __name__)

@User.route("/user", methods=["POST"])
@use_args(UserSchema())
def create(details):
    user = model.User(**details)

    try:
        db.session.add(user)
        db.session.commit()
    except IntegrityError as ie:
        raise AlreadyExists("User", "email", details["email"])

    return success()

@User.route("/user/<user>", methods=["GET", "PUT"])
def get_or_update_user(user): 
    if request.method == "GET":
        try:
            user_id = int(user)
        except ValueError:
            raise NotFound()

        user = model.User.get(user_id)
        schema = UserSchema(exclude=("password",))
        data, _ = schema.dump(user)

        return respond(data)
    elif request.method == "PUT":
        pass