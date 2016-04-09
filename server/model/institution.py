from sqlalchemy.orm import relationship
from sqlalchemy import Column, Integer, String, func
from sqlalchemy_utils import aggregated
from server.library.model import Serializable
from server.database import Model

class Institution(Model, Serializable):
    __tablename__ = "institution"

    id = Column(Integer, primary_key=True)
    name = Column(String)
    code = Column(String, unique=True)
    domain = Column(String, unique=True)
    image = Column(String)

    color_primary = Column(String(7))
    color_secondary = Column(String(7))

    users = relationship("User", backref="institution")
    courses = relationship("Course", backref="institution")
    papers = relationship("Paper", secondary="course", viewonly=True)
    user = relationship("User", primaryjoin="Course.institution_id == Institution.id", secondary="user_courses", viewonly=True)

    @aggregated("courses", Column(Integer))
    def course_count(self):
        return func.count('1')

    @aggregated("papers", Column(Integer))
    def paper_count(self):
        return func.count('1')

    @aggregated("users", Column(Integer))
    def user_count(self):
        return func.count('1')