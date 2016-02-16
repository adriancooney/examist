from flask import Blueprint
from webargs import fields
from webargs.flaskparser import parser, use_kwargs
from server import model
from server.database import db
from server.response import respond, success
from server.exc import NotFound, LoginError, AlreadyExists, InvalidEntity

Institution = Blueprint("institution", __name__)

@Institution.route("/institution/search", methods=["GET"])
@use_kwargs({ "domain": fields.Str(required=True) }, locations=("query",))
def search_institution(domain):
    return respond(model.Institution.getBy(db.session, domain=domain).dump())

@Institution.route("/institution/<int:instit>", methods=["GET"])
def get_institution(instit):
    return respond(model.Institution.query.get(instit).dump())