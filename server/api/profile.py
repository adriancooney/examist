from flask import Blueprint, g
from webargs.flaskparser import parser, use_kwargs
from server import model
from server.database import db
from server.response import respond, success
from server.middleware import authorize
from server.library.schema import schema
from server.exc import NotFound, LoginError, AlreadyExists, InvalidEntity

Profile = Blueprint("Profile", __name__)

moduleSchema = schema(model.Module)

@Profile.route("/profile/modules/", methods=["GET"], strict_slashes=False)
@authorize
def get_modules():
    return respond({ 
        "modules": moduleSchema.dump(g.user.modules, many=True).data
    })