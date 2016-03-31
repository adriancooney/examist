from flask import Blueprint, request, g, current_app
from sqlalchemy.orm import with_polymorphic
from webargs import fields, validate
from webargs.flaskparser import use_kwargs, parser
from marshmallow import missing
from server.cache import cache_view, invalidate_view
from server.database import db
from server.response import respond, success
from server.library.util import merge
from server.library.model import query
from server.middleware import authorize
from server import model
from server.exc import InvalidRequest, Unauthorized

Comment = Blueprint("comment", __name__)

@Comment.route("/comment/<int:entity>", methods=["POST"])
@use_kwargs({ "content": fields.Str(required=True), "parent": fields.Int() })
@authorize
def create_comment(entity, content, parent):
    with query(model.Entity):
        entity = db.session.query(model.Entity).filter(model.Entity.id == entity).one()

        if parent != missing:
            parent = db.session.query(model.Comment).filter(model.Comment.id == parent).one()
        else:
            parent = None

    comment = g.user.comment(entity, content, parent)
    db.session.add(comment)
    db.session.commit()
    db.session.refresh(comment) # Conversion from Entity type to Comment

    # Now we invalidate some cache so they pick up the new comments
    if entity.type == "question":
        # Empty the course popular questions
        invalidate_view("course.get_popular")

        db.session.refresh(entity)

        question = entity
        paper = entity.paper
        course = paper.course

        # Invalidate the question's paper
        invalidate_view("paper.get_paper", course=course.code, year=paper.year_start, period=paper.period)
        invalidate_view("question.do_question", course=course.code, year=paper.year_start, period=paper.period, question=".".join(map(str, question.path)))

    # Invalidate the comment cache for specific entity
    invalidate_view("comment.get_comments", entity=entity.id)

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

    # Fix up the cache    
    if entity.type == "question":
        db.session.refresh(entity)

        question = entity
        paper = entity.paper
        course = paper.course

        invalidate_view("question.do_question", course=course.code, year=paper.year_start, period=paper.period, question=".".join(map(str, question.path)))

    # Invalidate the comment cache for specific entity
    invalidate_view("comment.get_comments", entity=entity.id)
    
    db.session.add(comment)
    db.session.commit()
    db.session.refresh(comment)
    getattr(comment, "children")

    return respond({ 
        "entity": entity,
        "comment": comment 
    })
    
@Comment.route("/comments/<int:entity>", methods=["GET"])
@authorize
@cache_view
def get_comments(entity):
    with query(model.Entity):
        entity = db.session.query(model.Entity).filter(model.Entity.id == entity).one()

        comments = db.session.query(
            with_polymorphic(model.Entity, model.Comment)
        ).filter(model.Comment.entity_id == entity.id).all()

    users = map(lambda comment: getattr(comment, "user"), comments)

    return respond({ 
        "entity": entity,
        "comments": comments,
        "users": users
    })