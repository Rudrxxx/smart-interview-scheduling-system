from sqlalchemy.orm import Session
from models.base_user import User
from typing import Optional


class UserRepository:
    """Repository Pattern — abstracts all DB ops for User"""

    def __init__(self, db: Session):
        self.db = db

    def create(self, name: str, email: str, role: str, clerk_id: Optional[str] = None) -> User:
        user = User(
            name=name,
            email=email,
            password=None,
            clerk_id=clerk_id,
            role=role
        )
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user

    def get_by_clerk_id(self, clerk_id: str) -> Optional[User]:
        return self.db.query(User).filter(User.clerk_id == clerk_id).first()

    def get_by_email(self, email: str) -> Optional[User]:
        return self.db.query(User).filter(User.email == email).first()

    def get_by_id(self, user_id: int) -> Optional[User]:
        return self.db.query(User).filter(User.id == user_id).first()

    def get_all_interviewers(self):
        return self.db.query(User).filter(User.role == "interviewer").all()

    def get_all(self):
        return self.db.query(User).all()
