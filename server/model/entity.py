from server.database import Model
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

class Entity(Model):
    __tablename__ = "entity"

    id = Column(Integer, primary_key=True)
    type = Column(String(15))

    __mapper_args__ = {
        "polymorphic_identity": "entity",
        "polymorphic_on": type
    }

    class Meta:
        additional=("id",)
        exclude=("type",)