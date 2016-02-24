from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.schema import UniqueConstraint
from server.database import Model
from server.library import Assistant
from server.model.institution import Institution

class Module(Model, Assistant):
    __tablename__ = "module"
    __table_args__ = (
        UniqueConstraint("code", "institution_id"),
    )

    id = Column(Integer, primary_key=True)
    code = Column(String)
    name = Column(String)
    
    # Foreign keys
    institution_id = Column(Integer, ForeignKey("institution.id"))

    # Relationships
    papers = relationship("Paper", backref="module")

    def __init__(self, name, code, institution):
        self.name = name
        self.code = code

        if isinstance(institution, Institution):
            self.institution = institution
        else:
            self.institution_id = institution