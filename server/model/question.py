import datetime
from marshmallow import fields
from sqlalchemy.schema import Table
from sqlalchemy.orm import relationship, backref
from sqlalchemy import Column, Integer, String, ForeignKey, UniqueConstraint, DateTime, Enum
from sqlalchemy.dialects import postgresql
from server.database import db, Model
from server.library.model import querymethod
from server.model.revision import Revision
from server.model.course import Course
from server.model.paper import Paper
from server.exc import InvalidEntityField

class Question(Model):
    __tablename__ = "question"
    __table_args__ = (UniqueConstraint("paper_id", "path"),)

    id = Column(Integer, primary_key=True)
    paper_id = Column(Integer, ForeignKey("paper.id"))
    parent_id = Column(Integer, ForeignKey("question.id"))
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    marks = Column(Integer)

    # IMPORTANT: Question indexes start from ONE.
    index = Column(Integer) # The questions position in the list
    index_type = Column(Enum("decimal", "alpha", "roman", name="index_type"), default="decimal")

    # We retain path information to the question for the following reasons:
    # 1. Traversing the tree is expensive.
    # 2. For selection.
    # 3. Direct linking to a question.
    path = Column(postgresql.ARRAY(Integer)) 
    formatted_path = Column(postgresql.ARRAY(String))

    # Relationships
    paper = relationship("Paper", backref="questions", lazy="joined")
    parent = relationship("Question", back_populates="children", lazy="immediate", remote_side=id, uselist=False)
    children = relationship("Question", back_populates="parent", lazy="joined", join_depth=3)
    revision = relationship("Revision", secondary=Table("question_revision", db.metadata,
        Column("question_id", Integer, ForeignKey("question.id")),
        Column("revision_id", Integer, ForeignKey("revision.id"))
    ), uselist=False, lazy="joined")
    revisions = relationship("Revision")

    class Meta:
        created_at = dict(load_only=True)
        revision = dict(only=("user", "content", "created_at"))
        include = dict(content=fields.Str())

    def __init__(self, paper, index, index_type=None, parent=None):
        self.paper = paper
        self.index = index
        self.index_type = index_type or "decimal"
        
        if parent:
            # Ensure this index type is the same as it's siblings
            if len(parent.children) > 0:
                # Custom index types are ignored.
                self.index_type = parent.children[0].index_type

            self.path = parent.path + [index]
            self.formatted_path = parent.formatted_path + [Question.format_index(self.index_type, self.index)]
        else:
            self.path = [index]
            self.formatted_path = [Question.format_index(self.index_type, self.index)]

        self.parent = parent
        self.revision = None

    def set_content(self, user, content):
        self.revision = Revision(self, user, content)

    @staticmethod
    def format_index(index_type, index):
        if index_type == "alpha": 
            return chr(ord("a") + index - 1)
        elif index_type == "roman":
            return Question.int_to_roman(index)
        else:
            return str(index)

    @staticmethod
    def int_to_roman(num):
        """http://code.activestate.com/recipes/81611-roman-numerals/"""
        ints = (1000, 900,  500, 400, 100,  90, 50,  40, 10,  9,   5,  4,   1)
        nums = ("M", "CM", "D", "CD","C", "XC","L","XL","X","IX","V","IV","I")
        result = ""
        for i in range(len(ints)):
            count = int(num / ints[i])
            result += nums[i] * count
            num -= ints[i] * count
        return result

    @staticmethod
    @querymethod("Question")
    def get_by_path(session, course, year, period, path):
        return db.session.query(Question).filter(
            (Course.code == course.upper()) & \
            (Paper.course_id == Course.id) & \
            (Paper.year_start == year) & \
            (Paper.period == period) & \
            (Question.paper_id == Paper.id) & \
            (Question.path == path)
        ).one()

    def flatten_tree(self, include_self=True):
        questions = []
        children = self.children

        if include_self:
            questions.append(self)

        if children and len(children):
            for child in children:
                questions += child.flatten_tree(include_self=True)

        return questions

    def update_index_type(self, index_type):
        self.index_type = index_type
        self.update_index(self.index)

    def update_index(self, index):
        self.index = index

        if not self.path:
            new_path = [index]
            new_formatted_path = [index]
        else:
            new_path = self.path[:]
            new_formatted_path = self.formatted_path[:]

        new_path[-1] = index
        new_formatted_path[-1] = Question.format_index(self.index_type, index)

        self.path = new_path
        self.formatted_path = new_formatted_path