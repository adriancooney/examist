import hashlib
from sqlalchemy.orm import relationship
from sqlalchemy import Column, Integer, String, ForeignKey
from fyp.server.exc import LoginError
from fyp.server.model.base import Base
from fyp.server.library import assistant

class User(Base, Assistant):
    __tablename__ = "user"

    id = Column(Integer, primary_key=True)
    name = Column(String)
    username = Column(String, unique=True)
    email = Column(String, unique=True)

    password = Column(String(length=64))
    salt = Column(String(length=20))
    
    def login(self, password):
        """Log the current user instance in. This does 2 things:
            1. Compares the password.
            2. Creates new session.
        """
        hash = User.hash(password, self.salt)

        if hash != self.password:
            raise LoginError(self.username)

        # Create session token

    @staticmethod
    def hash(password, salt):
        return hashlib.sha256(password + salt).hexdigest()

    @staticmethod
    def generateSalt(length=20):
        return ''.join(random.choice(ALPHABET) for i in range(length))