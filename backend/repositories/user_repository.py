from sqlalchemy.orm import Session
from models.base_user import User
from core.security import hash_password
from typing import Optional


class UserRepository:
    """Repository Pattern — abstracts all DB ops for User"""

    def __init__(self, db: Session):
        self.db = db

    def create(self, name: str, email: str, password: str, role: str) -> User:
        user = User(
            name=name,
            email=email,
            password=hash_password(password),
            role=role
        )
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user

    def get_by_email(self, email: str) -> Optional[User]:
        return self.db.query(User).filter(User.email == email).first()

    def get_by_id(self, user_id: int) -> Optional[User]:
        return self.db.query(User).filter(User.id == user_id).first()

    def get_all_interviewers(self):
        return self.db.query(User).filter(User.role == "interviewer").all()

    def get_all(self):
        return self.db.query(User).all()
