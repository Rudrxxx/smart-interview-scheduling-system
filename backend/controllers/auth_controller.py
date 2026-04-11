from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from core.database import get_db
from schemas.user_schema import UserCreate, UserLogin, Token, UserResponse
from services.auth_service import AuthService

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post("/register", response_model=UserResponse)
def register(data: UserCreate, db: Session = Depends(get_db)):
    service = AuthService(db)
    user = service.register(data.name, data.email, data.password, data.role)
    return user


@router.post("/login", response_model=Token)
def login(data: UserLogin, db: Session = Depends(get_db)):
    service = AuthService(db)
    token, user = service.login(data.email, data.password)
    return {"access_token": token, "token_type": "bearer", "user": user}
