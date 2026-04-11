from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from core.database import get_db
from core.dependencies import require_role, get_current_user
from schemas.drive_schema import DriveCreate, DriveUpdate, DriveResponse
from repositories.drive_repository import DriveRepository
from typing import List

router = APIRouter(prefix="/api/drives", tags=["Recruitment Drives"])


@router.post("/", response_model=DriveResponse)
def create_drive(data: DriveCreate, db: Session = Depends(get_db),
                 current_user=Depends(require_role("admin"))):
    repo = DriveRepository(db)
    drive_data = {**data.model_dump(), "created_by": current_user.id}
    return repo.create(drive_data)


@router.get("/", response_model=List[DriveResponse])
def list_drives(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    repo = DriveRepository(db)
    if current_user.role == "admin":
        return repo.get_all()
    return repo.get_all_active()


@router.get("/{drive_id}", response_model=DriveResponse)
def get_drive(drive_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    repo = DriveRepository(db)
    drive = repo.get_by_id(drive_id)
    if not drive:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Drive not found")
    return drive


@router.put("/{drive_id}", response_model=DriveResponse)
def update_drive(drive_id: int, data: DriveUpdate, db: Session = Depends(get_db),
                 current_user=Depends(require_role("admin"))):
    repo = DriveRepository(db)
    drive = repo.get_by_id(drive_id)
    if not drive:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Drive not found")
    return repo.update(drive, data.model_dump(exclude_none=True))


@router.delete("/{drive_id}")
def delete_drive(drive_id: int, db: Session = Depends(get_db),
                 current_user=Depends(require_role("admin"))):
    repo = DriveRepository(db)
    drive = repo.get_by_id(drive_id)
    if not drive:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Drive not found")
    repo.delete(drive)
    return {"message": "Drive deleted successfully"}
