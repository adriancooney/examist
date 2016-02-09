import hashlib
import random
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.ext.hybrid import hybrid_property
from fyp.server.model.session import Session
from fyp.server.exc import LoginError
from fyp.server.database import Model
from fyp.server.library import Assistant
from fyp.server.library.util import find

ALPHABET = "abcdefghijklmnopqrstuvwxyz1234567890"

class User(Model, Assistant):
    __tablename__ = "user"

    # Attributes
    id = Column(Integer, primary_key=True)
    name = Column(String)
    email = Column(String, unique=True)
    password = Column(String(length=64))
    salt = Column(String(length=20))

    # Foreign keys
    institution_id = Column(Integer, ForeignKey("institution.id"))

    # Relationships
    sessions = relationship("Session", backref="user")

    @hybrid_property
    def active_session(self):
        return find(self.sessions, lambda session: session.active)

    def __init__(self, name, email, password):
        self.name = name
        self.email = email
        self.salt = User.generateSalt()
        self.password = User.hash(password, self.salt)
    
    def login(self, session, password):
        """Log the current user instance in. This does 2 things:
            1. Compares the password.
            2. Creates new session.
        """
        hash = User.hash(password, self.salt)

        if hash != self.password:
            raise LoginError(self.email)

        # Create session token
        userSession = Session(self)
        session.add(userSession)
        session.commit()

        return userSession

    @staticmethod
    def extract_institution(email):
        """Extract the insititution (domain) from an email."""
        pass

    @staticmethod
    def hash(password, salt):
        return hashlib.sha256(password + salt).hexdigest()

    @staticmethod
    def generateSalt(length=20):
        return ''.join(random.choice(ALPHABET) for i in range(length))