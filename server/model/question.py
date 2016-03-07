import datetime
from sqlalchemy.orm import relationship
from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, DateTime
from server.database import db, Model
from server.library import Assistant
from server.model.revision import Revision

class Question(Model, Assistant):
    __tablename__ = "question"

    id = Column(Integer, primary_key=True)
    paper_id = Column(Integer, ForeignKey("paper.id"))
    parent_id = Column(Integer, ForeignKey("question.id")) # Nested list
    children = relationship("Question", backref=backref("parent", remote_side=[id]))
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Versioning system
    revision = relationship("Revision", secondary=Table("question_revision", db.metadata,
        Column("question_id", Integer, ForeignKey("question.id")),
        Column("revision_id", Integer, ForeignKey("revision.id"))
    ), uselist=False)
    revisions = relationship("Revision", foreign_keys=[Revision.question_id])