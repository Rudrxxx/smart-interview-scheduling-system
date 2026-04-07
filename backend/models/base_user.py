from sqlalchemy import Column, Integer, String, Enum
from core.database import Base
import enum


class UserRole(str, enum.Enum):
    admin = "admin"
    student = "student"
    interviewer = "interviewer"


class User(Base):
    """
    BaseUser — Abstract concept implemented as a single-table inheritance model.
    Demonstrates OOP: encapsulation of auth data, polymorphism via role.
    """
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    role = Column(Enum(UserRole), nullable=False)

    def login(self):
        """Abstract behavior — implemented via JWT in auth service"""
        pass

    def logout(self):
        """Token invalidation handled client-side"""
        pass

    def __repr__(self):
        return f"<User id={self.id} email={self.email} role={self.role}>"
