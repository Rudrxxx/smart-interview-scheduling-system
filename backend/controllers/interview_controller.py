from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from core.database import get_db
from core.dependencies import require_role, get_current_user
from schemas.interview_schema import InterviewCreate, InterviewResponse
from services.scheduling_service import SchedulingService
from repositories.user_repository import UserRepository
from typing import List

router = APIRouter(prefix="/api/interviews", tags=["Interviews"])


@router.post("/", response_model=InterviewResponse)
def schedule_interview(data: InterviewCreate, db: Session = Depends(get_db),
                       current_user=Depends(require_role("admin"))):
    service = SchedulingService(db)
    return service.create_interview_slot(
        data.application_id, data.interviewer_id,
        data.scheduled_date, data.time_slot, data.meet_link
    )


@router.get("/my", response_model=List[InterviewResponse])
def my_interviews(db: Session = Depends(get_db),
                  current_user=Depends(require_role("interviewer"))):
    service = SchedulingService(db)
    return service.get_interviewer_schedule(current_user.id)


@router.get("/", response_model=List[InterviewResponse])
def all_interviews(db: Session = Depends(get_db),
                   current_user=Depends(require_role("admin"))):
    service = SchedulingService(db)
    return service.get_all_interviews()


@router.get("/interviewers")
def list_interviewers(db: Session = Depends(get_db),
                      current_user=Depends(require_role("admin"))):
    repo = UserRepository(db)
    interviewers = repo.get_all_interviewers()
    return [{"id": i.id, "name": i.name, "email": i.email} for i in interviewers]
