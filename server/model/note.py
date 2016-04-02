from datetime import datetime
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql.functions import current_timestamp
from server.library.model import Serializable
from server.model.entity import Entity

class Note(Entity, Serializable):
    __tablename__ = "note"
    id = Column(Integer, ForeignKey("entity.id"), primary_key=True)
    user_id = Column(Integer, ForeignKey("user.id"))
    question_id = Column(Integer, ForeignKey("question.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, onupdate=current_timestamp())
    description = Column(Text)

    question = relationship("Question", foreign_keys=question_id)
    user = relationship("User", backref="notes")

    class Meta:
        additional=("type",)

    @classmethod
    def __declare_last__(cls):
        NoteLink.__schema__
        NoteUpload.__schema__

class NoteLink(Note, Serializable):
    __mapper_args__ = {
        "polymorphic_identity": "note_link"
    }

    link = Column(String)

class NoteUpload(Note, Serializable):
    __mapper_args__ = {
        "polymorphic_identity": "note_upload"
    }

    file_path = Column(String)