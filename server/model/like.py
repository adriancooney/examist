from datetime import datetime
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from server.library.model import Serializable
from server.database import Model

class Like(Model, Serializable):
    id = Column(Integer, primary_key=True)
    entity_id = Column(Integer, ForeignKey("entity.id"))
    user_id = Column(Integer, ForeignKey("user.id"))
    created_at = Column(DateTime, default=datetime.utcnow)

    entity = relationship("Entity")
    user = relationship("User", backref="likes")

    def __init__(self, user, entity):
        self.user = user
        self.entity = entity

