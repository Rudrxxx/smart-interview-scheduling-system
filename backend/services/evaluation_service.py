from sqlalchemy.orm import Session
from repositories.evaluation_repository import EvaluationRepository
from repositories.interview_repository import InterviewRepository
from repositories.application_repository import ApplicationRepository
from fastapi import HTTPException


class EvaluationService:
    """Handles evaluation submission and score aggregation."""

    def __init__(self, db: Session):
        self.eval_repo = EvaluationRepository(db)
        self.interview_repo = InterviewRepository(db)
        self.app_repo = ApplicationRepository(db)

    def save_evaluation(self, interview_id: int, score: float, feedback: str, interviewer_id: int):
        interview = self.interview_repo.get_by_id(interview_id)
        if not interview:
            raise HTTPException(status_code=404, detail="Interview not found")
        if interview.interviewer_id != interviewer_id:
            raise HTTPException(status_code=403, detail="Not your interview to evaluate")

        existing = self.eval_repo.get_by_interview(interview_id)
        if existing:
            raise HTTPException(status_code=400, detail="Evaluation already submitted")

        if not (0 <= score <= 100):
            raise HTTPException(status_code=400, detail="Score must be between 0 and 100")

        evaluation = self.eval_repo.save({
            "interview_id": interview_id,
            "score": score,
            "feedback": feedback
        })

        # Update application status to interviewed
        app = self.app_repo.get_by_id(interview.application_id)
        self.app_repo.update_status(app, "interviewed")

        return evaluation

    def get_evaluation_by_interview(self, interview_id: int):
        return self.eval_repo.get_by_interview(interview_id)
