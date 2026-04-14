from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from core.database import get_db
from core.dependencies import require_role, get_current_user
from repositories.user_repository import UserRepository
from pydantic import BaseModel

router = APIRouter(prefix="/api/users", tags=["Users"])


class RoleUpdate(BaseModel):
    role: str  # "admin" | "student" | "interviewer"


@router.get("/me")
def get_me(current_user=Depends(get_current_user)):
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "role": current_user.role,
    }


@router.get("/")
def list_users(db: Session = Depends(get_db), current_user=Depends(require_role("admin"))):
    repo = UserRepository(db)
    users = repo.get_all()
    return [{"id": u.id, "name": u.name, "email": u.email, "role": u.role} for u in users]


@router.patch("/{user_id}/role")
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
