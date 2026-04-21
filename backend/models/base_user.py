from sqlalchemy import Column, Integer, String, Enum
from core.database import Base
import enum

class UserRole(str, enum.Enum):
    admin = "admin"
    student = "student"
    interviewer = "interviewer"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    role = Column(Enum(UserRole), nullable=False)

    def login(self):
        pass

    def logout(self):
        pass

    def __repr__(self):
        return f"<User id={self.id} email={self.email} role={self.role}>"
