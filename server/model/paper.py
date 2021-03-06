from sqlalchemy.orm import relationship
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm.exc import NoResultFound
from server.database import Model
from server.library.model import Serializable
from server.model.course import Course
from server.model.paper_download import PaperDownload
from server.exc import NotFound

class Paper(Model, Serializable):
    __tablename__ = "paper"

    PAPER_PERIODS = [
        "spring",
        "summer",
        "autumn",
        "winter"
    ]

    id = Column(Integer, primary_key=True)
    name = Column(String)
    period = Column(String)
    sitting = Column(Integer)
    year_start = Column(Integer)
    year_stop = Column(Integer)
    link = Column(String)
    course = relationship("Course", uselist=False, lazy="immediate")

    # Foreign Keys
    course_id = Column(Integer, ForeignKey("course.id"))

    def __init__(self, name, period, sitting, year_start, year_stop, link, course=None):
        if isinstance(course, Course):
            course_id = course.id
        else:
            course_id = course

        self.name = name
        self.period = period
        self.sitting = sitting
        self.year_start = year_start
        self.year_stop = year_stop
        self.link = link
        self.course_id = course_id

    def download(self, output_dir):
        self.contents = PaperDownload(self)
        self.contents.download(output_dir)

    @staticmethod
    def find(session, course, year, period):
        try:
            return session.query(Paper).filter(
                (Course.code == course.upper()) & \
                (Paper.course_id == Course.id) & \
                (Paper.year_start == year) & \
                (Paper.period == period)
            ).one()
        except NoResultFound:
            raise NotFound("Paper")