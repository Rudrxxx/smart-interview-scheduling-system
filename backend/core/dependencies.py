from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from core.database import get_db
from core.security import decode_clerk_token
from repositories.user_repository import UserRepository

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    payload = decode_clerk_token(token)
    clerk_id = payload.get("sub")
    
    if not clerk_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token payload identifier")
        
    repo = UserRepository(db)
    user = repo.get_by_clerk_id(clerk_id)
    
    # Just-In-Time User Provisioning perfectly synced with Clerk 
    if not user:
        email = payload.get("email") or f"{clerk_id}@placeholder.com"
        name = payload.get("name") or "New Clerk User"
        
        user = repo.create(
            name=name,
            email=email,
            role="student",
            clerk_id=clerk_id
        )
        
    return user

def require_role(*roles):
    def checker(current_user=Depends(get_current_user)):
        if current_user.role not in roles:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient permissions")
        return current_user
    return checker
