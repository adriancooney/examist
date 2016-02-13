from webargs import fields
from webargs.flaskparser import use_args
from flask import request, g
from server.library.util import middleware
from server.database import db
from server.model import Session
from server.exc import NotFound, Unauthorized

@middleware
@use_args({ "Auth-Key": fields.Str(required=True) }, locations=("headers",))
def authorize(args):
    key = args["Auth-Key"]

    try:
        session = Session.getBy(db.session, key=key)
    except NotFound:
        raise Unauthorized()

    # Ensure the session is active
    if not session.active:
        raise Unauthorized()

    g.user = session.user