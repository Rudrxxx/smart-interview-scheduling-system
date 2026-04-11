from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from core.database import get_db
from core.dependencies import require_role, get_current_user
from schemas.application_schema import ApplicationCreate, ApplicationStatusUpdate, ApplicationResponse
from services.application_service import ApplicationService
from typing import List

router = APIRouter(prefix="/api/applications", tags=["Applications"])


@router.post("/", response_model=ApplicationResponse)
def apply(data: ApplicationCreate, db: Session = Depends(get_db),
          current_user=Depends(require_role("student"))):
    service = ApplicationService(db)
    return service.save_application(current_user.id, data.drive_id)


@router.get("/my", response_model=List[ApplicationResponse])
def my_applications(db: Session = Depends(get_db),
                    current_user=Depends(require_role("student"))):
    service = ApplicationService(db)
    return service.get_student_applications(current_user.id)


@router.get("/drive/{drive_id}", response_model=List[ApplicationResponse])
def drive_applications(drive_id: int, db: Session = Depends(get_db),
                       current_user=Depends(require_role("admin"))):
    service = ApplicationService(db)
    return service.get_drive_applications(drive_id)


@router.get("/", response_model=List[ApplicationResponse])
def all_applications(db: Session = Depends(get_db),
                     current_user=Depends(require_role("admin"))):
    service = ApplicationService(db)
    return service.get_all()


@router.patch("/{app_id}/status")
def update_status(app_id: int, data: ApplicationStatusUpdate, db: Session = Depends(get_db),
                  current_user=Depends(require_role("admin"))):
    service = ApplicationService(db)
    app = service.update_status(app_id, data.status)
    return app
