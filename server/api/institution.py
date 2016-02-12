from flask import Blueprint, request, session
from sqlalchemy.exc import IntegrityError
from webargs import fields, validate
from webargs.flaskparser import parser, use_kwargs
from server import model
from server.database import db
from server.response import respond, success
from server.exc import NotFound, LoginError, AlreadyExists, InvalidEntity

Institution = Blueprint("institution", __name__)

@Institution.route("/institution/search", methods=["GET"])
@use_kwargs({ "domain": fields.Str(required=True) }, locations=("query",))
def search_institution(domain):
    print "GETTING BY DOMAIN", domain
    return respond(model.Institution.getBy(db.session, domain=domain).dump())