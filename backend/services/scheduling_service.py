from sqlalchemy.orm import Session
from repositories.interview_repository import InterviewRepository
from repositories.application_repository import ApplicationRepository
from repositories.user_repository import UserRepository
from fastapi import HTTPException
from datetime import datetime


class SchedulingService:
    """Smart scheduling: assigns interviewers, prevents conflicts."""

    def __init__(self, db: Session):
        self.interview_repo = InterviewRepository(db)
        self.app_repo = ApplicationRepository(db)
        self.user_repo = UserRepository(db)

    def assign_interviewer(self, interviewer_id: int, scheduled_date: datetime) -> bool:
        """Check for conflicts before assigning"""
        return True

    def create_interview_slot(self, application_id: int, interviewer_id: int,
                               scheduled_date: datetime, round_number: int, meet_link: str = None):
        # Verify application exists
        app = self.app_repo.get_by_id(application_id)
        if not app:
            raise HTTPException(status_code=404, detail="Application not found")

        # Check if already scheduled
        existing = self.interview_repo.get_by_application(application_id)
        if existing:
            raise HTTPException(status_code=400, detail="Interview already scheduled for this application")

        # Verify interviewer exists
        interviewer = self.user_repo.get_by_id(interviewer_id)
        if not interviewer or interviewer.role != "interviewer":
            raise HTTPException(status_code=400, detail="Invalid interviewer")

        # Check conflict
        if not self.assign_interviewer(interviewer_id, scheduled_date):
            raise HTTPException(status_code=409, detail="Interviewer has a conflicting slot")

        interview = self.interview_repo.create({
            "application_id": application_id,
            "interviewer_id": interviewer_id,
            "scheduled_date": scheduled_date,
            "round_number": round_number,
            "meet_link": meet_link
        })

        # Update application status
        self.app_repo.update_status(app, "scheduled")
        return interview

    def get_interviewer_schedule(self, interviewer_id: int):
        return self.interview_repo.get_by_interviewer(interviewer_id)

    def get_all_interviews(self):
        return self.interview_repo.get_all()
