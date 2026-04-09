from sqlalchemy.orm import Session
from models.interview import Interview
from typing import Optional, List


class InterviewRepository:
    """Repository Pattern — abstracts all DB ops for Interview"""

    def __init__(self, db: Session):
        self.db = db

    def create(self, data: dict) -> Interview:
        interview = Interview(**data)
        self.db.add(interview)
        self.db.commit()
        self.db.refresh(interview)
        return interview

    def get_by_id(self, interview_id: int) -> Optional[Interview]:
        return self.db.query(Interview).filter(Interview.id == interview_id).first()

    def get_by_application(self, application_id: int) -> Optional[Interview]:
        return self.db.query(Interview).filter(Interview.application_id == application_id).first()

    def get_by_interviewer(self, interviewer_id: int) -> List[Interview]:
        return self.db.query(Interview).filter(Interview.interviewer_id == interviewer_id).all()

    def fetch_slots(self, interviewer_id: int, date) -> List[Interview]:
        return self.db.query(Interview).filter(
            Interview.interviewer_id == interviewer_id,
            Interview.scheduled_date == date
        ).all()

    def get_all(self) -> List[Interview]:
        return self.db.query(Interview).all()

    def save(self, interview: Interview) -> Interview:
        self.db.add(interview)
        self.db.commit()
        self.db.refresh(interview)
        return interview
