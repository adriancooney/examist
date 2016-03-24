from flask import Blueprint, request, g
from webargs import fields, validate
from webargs.flaskparser import use_kwargs, parser
from server.database import db
from server.response import respond, success
from server.library.util import merge
from server.library.model import query
from server.middleware import authorize
from server import model
from server.exc import InvalidRequest, Unauthorized

Comment = Blueprint("comment", __name__)

@Comment.route("/comment/<int:entity>", methods=["POST"])
@use_kwargs({ "content": fields.Str(required=True) })
@authorize
def create_comment(entity, content):
    with query(model.Entity):
        entity = db.session.query(model.Entity).filter(model.Entity.id == entity).one()

    comment = g.user.comment(entity, content)
    db.session.add(g.user)
    db.session.commit()
    db.session.refresh(comment) # Conversion from Entity type to Comment

    return respond({ "comment": comment })

@Comment.route("/comment/<int:entity>/<int:comment>", methods=["PUT", "DELETE"])
@authorize
def edit_comment(entity, comment):
    with query(model.Entity):
        entity = db.session.query(model.Entity).filter(model.Entity.id == entity).one()
        comment = db.session.query(model.Comment).filter(model.Comment.id == comment).one()

    # Ensure the user is the author
    if not g.user.id == comment.user.id:
        raise Unauthorized()

    if request.method == "DELETE":
        comment.content = ""
        comment.deleted = True
    elif request.method == "PUT":
        args = parser.parse({ "content": fields.Str(required=True) })
        comment.content = args["content"]
    else:
        raise InvalidRequest()

    db.session.add(comment)
    db.session.commit()
    db.session.refresh(comment)

    return respond({ "comment": comment })
    
