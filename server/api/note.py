from flask import Blueprint, request, g
from sqlalchemy.orm import with_polymorphic
from webargs import fields, validate
from webargs.flaskparser import use_kwargs, parser
from server.cache import cache_view, invalidate_view
from server import model
from server.database import db
from server.response import respond, success
from server.library.model import query
from server.middleware import authorize
from server.api.question import URL_PARAMS
from server.exc import InvalidRequest, Unauthorized

Note = Blueprint("note", __name__)

@Note.route("/course/<course>/paper/<year>/<period>/q/<question>/note", methods=["POST"])
@use_kwargs(URL_PARAMS, locations=("view_args",))
@use_kwargs({
    "link": fields.Str(required=True),
    "description": fields.Str(required=True),
})
@authorize
def create_link_note(course, year, period, question, link, description):
    question = model.Question.get_by_path(db.session, course, year, period, map(int, question.split(".")))
    note = model.NoteLink(link=link, description=description, user=g.user, question=question)
    db.session.add(note)
    db.session.commit()
    db.session.refresh(note)

    return respond({
        "question": question,
        "note": note
    })

@Note.route("/course/<course>/paper/<year>/<period>/q/<question>/notes", methods=["GET"])
@use_kwargs(URL_PARAMS, locations=("view_args",))
@authorize
def get_notes(course, year, period, question):
    question = model.Question.get_by_path(db.session, course, year, period, map(int, question.split(".")))

    notes = db.session.query(with_polymorphic(model.Note, [model.NoteLink, model.NoteUpload]))\
        .filter(model.Note.question_id == question.id).all()

    return respond({
        "question": question,
        "notes": notes    
    })