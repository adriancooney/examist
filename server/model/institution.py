from sqlalchemy.orm import relationship
from sqlalchemy import Column, Integer, String
from fyp.server.model.base import Base
from fyp.server.library import assistant

class Institution(Base, Assistant):
    __tablename__ = "institution"

    id = Column(Integer, primary_key=True)
    name = Column(String)
    code = Column(String, unique=True)
    domain = Column(String, unique=True)

    @staticmethod
    def getByCode(session, code):
        try:
            return session.query(Institution).filter(Institution.code == code.upper()).one()
        except NoResultFound:
            raise NotFound("institution", "Institution %s not found." % code)

    @staticmethod
    def getByDomain(session, code):
        try:
            return session.query(Institution).filter(Institution.code == code.upper()).one()
        except NoResultFound:
            raise NotFound("institution", "Institution %s not found." % code)