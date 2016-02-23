from sqlalchemy.orm import relationship
from sqlalchemy import Column, Integer, String, ForeignKey
from server.database import Model
from server.library import Assistant

class Paper(Model, Assistant):
    __tablename__ = "paper"

    id = Column(Integer, primary_key=True)
    name = Column(String)
    period = Column(String)
    sitting = Column(Integer)
    year_start = Column(Integer)
    year_stop = Column(Integer)

    # Foreign Keys
    module_id = Column(Integer, ForeignKey("module.id"))