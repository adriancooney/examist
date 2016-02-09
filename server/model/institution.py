from sqlalchemy.orm import relationship
from sqlalchemy import Column, Integer, String
from fyp.server.database import Model
from fyp.server.library import Assistant

class Institution(Model, Assistant):
    __tablename__ = "institution"

    id = Column(Integer, primary_key=True)
    name = Column(String)
    code = Column(String, unique=True)
    domain = Column(String, unique=True)
    shorthand = Column(String)
    image = Column(String)

    color_primary = Column(String(7))
    color_secondary = Column(String(7))

    users = relationship("User", backref="institution")