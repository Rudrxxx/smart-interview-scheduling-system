from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from core.database import get_db
from core.dependencies import require_role

router = APIRouter(prefix="/api/results", tags=["Results"])


@router.post("/publish/{application_id}")
def publish_result(application_id: int, db: Session = Depends(get_db),
                   current_user=Depends(require_role("admin"))):
    from services.result_service import ResultService
    service = ResultService(db)
    return service.publish_result(application_id)


@router.post("/publish-drive/{drive_id}")
def publish_drive_results(drive_id: int, db: Session = Depends(get_db),
                          current_user=Depends(require_role("admin"))):
    from services.result_service import ResultService
    service = ResultService(db)
    results = service.publish_drive_results(drive_id)
    return {"published": len(results), "results": results}


@router.get("/drive/{drive_id}")
def get_drive_results(drive_id: int, db: Session = Depends(get_db),
                      current_user=Depends(require_role("admin"))):
    from services.result_service import ResultService
    service = ResultService(db)
    return service.get_drive_results(drive_id)
