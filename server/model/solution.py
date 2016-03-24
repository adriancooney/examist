from sqlalchemy import Column, Integer, ForeignKey
from server.database import Model
from server.model.entity import Entity
from server.library.model import Serializable

class Solution(Entity, Serializable):
    __tablename__ = "solution"
    __mapper_args__ = {
        "polymorphic_identity": "solution"
    }

    id = Column(Integer, ForeignKey("entity.id"), primary_key=True)
    user_id = Column(Integer, ForeignKey("user.id"))