import random
import datetime
from sqlalchemy.orm import relationship
from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, DateTime
from server.database import Model
from server.library import Assistant

ALPHABET = "abcdefghijklmnopqrstuvwxyz1234567890"

class Session(Model, Assistant):
    __tablename__ = "session"

    id = Column(Integer, primary_key=True)
    key = Column(String(20))
    active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    destroyed_at = Column(DateTime)

    user_id = Column(Integer, ForeignKey("user.id"))

    def __init__(self, user):
        self.key = Session.generate()
        self.user = user

    @staticmethod
    def generate(length=20):
        return ''.join(random.choice(ALPHABET) for i in range(length))