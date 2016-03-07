import datetime
from sqlalchemy.orm import relationship
from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, DateTime
from server.database import Model
from server.library import Assistant

class Revision(Model, Assistant):
    __tablename__ = "revision"

    id = Column(Integer, primary_key=True)
    question_id = Column(Integer, ForeignKey("question.id"))
    user_id = Column(Integer, ForeignKey("user.id"))
    user = relationship("User", foreign_keys=[user_id])
    content = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

    def __init__(self, user, content):
        self.user = user
        self.content = content