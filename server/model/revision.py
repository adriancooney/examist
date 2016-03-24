from datetime import datetime
from sqlalchemy.orm import relationship
from sqlalchemy import Column, Integer, ForeignKey, DateTime, Text
from server.database import Model
from server.library.model import Serializable

class Revision(Model, Serializable):
    __tablename__ = "revision"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("user.id"))
    question_id = Column(Integer, ForeignKey("question.id"))
    content = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

    question = relationship("Question")
    user = relationship("User")

    def __init__(self, question, user, content):
        self.question = question
        self.user = user
        self.content = content