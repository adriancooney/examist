import datetime
from sqlalchemy.orm import relationship, backref
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Enum
from server.database import Model
from server.library import Assistant
from server.exc import NotFound

class PaperDownload(Model, Assistant):
    __tablename__ = "paper_download"

    id = Column(Integer, primary_key=True)
    path = Column(String) # The path on the filesystem the paper is downloaded to
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    status = Column(Enum("unavailable", "pending", "available", name="paper_download_status"), default="pending")
    paper_id = Column(Integer, ForeignKey("paper.id"))
    paper = relationship("Paper", backref=backref("contents", uselist=False))

    def __init__(self, paper):
        self.paper = paper

    def download(self):
        print "Downloading paper.."
        print self.paper.link

        raise NotFound("Paper file")