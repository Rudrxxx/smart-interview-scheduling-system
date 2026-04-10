from sqlalchemy.orm import Session
from repositories.user_repository import UserRepository
from core.security import verify_password, create_access_token
from fastapi import HTTPException, status


class AuthService:
    """Factory Pattern: creates the right user type. Handles auth logic."""

    def __init__(self, db: Session):
        self.repo = UserRepository(db)

    def register(self, name: str, email: str, password: str, role: str):
        existing = self.repo.get_by_email(email)
        if existing:
            raise HTTPException(status_code=400, detail="Email already registered")
        if len(password) < 6:
            raise HTTPException(status_code=400, detail="Password must be at least 6 characters")
        user = self.repo.create(name=name, email=email, password=password, role=role)
        return user

    def login(self, email: str, password: str):
        user = self.repo.get_by_email(email)
        if not user or not verify_password(password, user.password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        token = create_access_token({"sub": str(user.id), "role": user.role})
        return token, user
