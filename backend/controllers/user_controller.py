from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from core.database import get_db
from core.dependencies import require_role, get_current_user
from core.security import hash_password, verify_password, create_access_token
from repositories.user_repository import UserRepository
from pydantic import BaseModel, EmailStr

router = APIRouter(tags=["Users and Auth"])

class RoleUpdate(BaseModel):
    role: str

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str = "student"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

@router.post("/api/auth/register")
def register(data: UserCreate, db: Session = Depends(get_db)):
    repo = UserRepository(db)
    if repo.get_by_email(data.email):
        raise HTTPException(status_code=str(status.HTTP_400_BAD_REQUEST), detail="Email already registered")
        
    user = repo.create(
        name=data.name,
        email=data.email,
        password=hash_password(data.password),
        role=data.role
    )
    
    token = create_access_token({"sub": str(user.id), "role": user.role})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {"id": user.id, "name": user.name, "email": user.email, "role": user.role}
    }

@router.post("/api/auth/login")
def login(data: UserLogin, db: Session = Depends(get_db)):
    repo = UserRepository(db)
    user = repo.get_by_email(data.email)
    if not user or not user.password:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
        
    if not verify_password(data.password, user.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
        
    token = create_access_token({"sub": str(user.id), "role": user.role})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {"id": user.id, "name": user.name, "email": user.email, "role": user.role}
    }

@router.get("/api/users/me")
def get_me(current_user=Depends(get_current_user)):
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "role": current_user.role,
    }

@router.get("/api/users/")
def list_users(db: Session = Depends(get_db), current_user=Depends(require_role("admin"))):
    repo = UserRepository(db)
    users = repo.get_all()
    return [{"id": u.id, "name": u.name, "email": u.email, "role": u.role} for u in users]

@router.patch("/api/users/{user_id}/role")
def update_role(user_id: int, data: RoleUpdate, db: Session = Depends(get_db),
                current_user=Depends(require_role("admin"))):
    valid_roles = {"admin", "student", "interviewer"}
    if data.role not in valid_roles:
        raise HTTPException(status_code=400, detail=f"Invalid role. Must be one of: {valid_roles}")

    repo = UserRepository(db)
    user = repo.get_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.role = data.role
    db.commit()
    db.refresh(user)
    return {"id": user.id, "name": user.name, "email": user.email, "role": user.role}
