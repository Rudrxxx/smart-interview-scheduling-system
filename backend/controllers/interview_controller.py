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
        data.scheduled_date, data.round_number, data.meet_link
    )


@router.get("/my")
def my_interviews(db: Session = Depends(get_db),
                  current_user=Depends(require_role("interviewer"))):
    service = SchedulingService(db)
    interviews = service.get_interviewer_schedule(current_user.id)
    return [_enrich_interview(i) for i in interviews]


@router.get("/")
def all_interviews(db: Session = Depends(get_db),
                   current_user=Depends(require_role("admin"))):
    service = SchedulingService(db)
    interviews = service.get_all_interviews()
    return [_enrich_interview(i) for i in interviews]


@router.get("/interviewers")
def list_interviewers(db: Session = Depends(get_db),
                      current_user=Depends(require_role("admin"))):
    repo = UserRepository(db)
    interviewers = repo.get_all_interviewers()
    return [{"id": i.id, "name": i.name, "email": i.email} for i in interviewers]


def _enrich_interview(i):
    app = i.application
    student = app.student if app else None
    drive = app.drive if app else None
    interviewer = i.interviewer
    return {
        "id": i.id,
        "application_id": i.application_id,
        "interviewer_id": i.interviewer_id,
        "scheduled_date": i.scheduled_date,
        "round_number": i.round_number,
        "meet_link": i.meet_link,
        "status": "scheduled",
        "candidate_name": student.name if student else None,
        "drive_title": drive.title if drive else None,
        "interviewer_name": interviewer.name if interviewer else None,
    }
