from sqlalchemy.orm import relationship
from sqlalchemy import Column, Integer, String, ForeignKey
from server.database import Model
from server.library import Assistant
from server.model.module import Module

class Paper(Model, Assistant):
    __tablename__ = "paper"

    id = Column(Integer, primary_key=True)
    name = Column(String)
    period = Column(String)
    sitting = Column(Integer)
    year_start = Column(Integer)
    year_stop = Column(Integer)
    link = Column(String)

    # Foreign Keys
    module_id = Column(Integer, ForeignKey("module.id"))

    def __init__(self, name, period, sitting, year_start, year_stop, link, module=None):
        if isinstance(module, Module):
            module_id = module.id
        else:
            module_id = module

        self.name = name
        self.period = period
        self.sitting = sitting
        self.year_start = year_start
        self.year_stop = year_stop
        self.link = link
        self.module_id = module_id