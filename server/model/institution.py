from sqlalchemy.orm import relationship
from sqlalchemy import Column, Integer, String
from fyp.server.model.base import Base
from fyp.server.library import Assistant

class Institution(Base, Assistant):
    __tablename__ = "institution"

    id = Column(Integer, primary_key=True)
    name = Column(String)
    code = Column(String, unique=True)
    domain = Column(String, unique=True)