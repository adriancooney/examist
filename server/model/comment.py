from datetime import datetime
from sqlalchemy import Column, Integer, ForeignKey, Text, DateTime, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql.functions import current_timestamp
from server.library.model import Serializable
from server.database import Model
from server.model.entity import Entity

class Comment(Entity, Serializable):
    __tablename__ = "comment"

    id = Column(Integer, ForeignKey("entity.id"), primary_key=True)
    entity_id = Column(Integer, ForeignKey("entity.id"))
    user_id = Column(Integer, ForeignKey("user.id"))
    parent_id = Column(Integer, ForeignKey("comment.id"))
            
    content = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, onupdate=current_timestamp())
    deleted = Column(Boolean, default=False)

    # Relationships
    user = relationship("User", backref="comments")

    # Threads
    parent = relationship("Comment", back_populates="children", lazy="immediate", foreign_keys=[parent_id], remote_side=id, uselist=False)
    children = relationship("Comment", back_populates="parent", lazy="joined", foreign_keys=[parent_id])

    __mapper_args__ = {
        "polymorphic_identity": "comment",
        "inherit_condition": id == Entity.id
    }

    def __init__(self, user, entity, content, parent=None):
        self.user = user
        self.entity_id = entity.id
        self.content = content
        self.parent = parent
