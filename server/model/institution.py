from sqlalchemy.orm import relationship
from sqlalchemy import Column, Integer, String
from server.database import Model
from server.library import Assistant

class Institution(Model, Assistant):
    __tablename__ = "institution"

    id = Column(Integer, primary_key=True)
    name = Column(String)
    code = Column(String, unique=True)
    domain = Column(String, unique=True)
    image = Column(String)

    color_primary = Column(String(7))
    color_secondary = Column(String(7))

    users = relationship("User", backref="institution")
    modules = relationship("User", backref="institution")