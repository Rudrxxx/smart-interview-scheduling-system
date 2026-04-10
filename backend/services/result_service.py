from sqlalchemy.orm import Session
from repositories.evaluation_repository import EvaluationRepository
from repositories.application_repository import ApplicationRepository
from repositories.interview_repository import InterviewRepository
from fastapi import HTTPException


# Strategy Pattern for scoring
class ScoringStrategy:
    def calculate(self, score: float) -> str:
        raise NotImplementedError


class ThresholdScoringStrategy(ScoringStrategy):
    def __init__(self, threshold: float = 60.0):
        self.threshold = threshold

    def calculate(self, score: float) -> str:
        return "selected" if score >= self.threshold else "rejected"


class TopNScoringStrategy(ScoringStrategy):
    def __init__(self, scores: list, top_n: int):
        self.scores = sorted(scores, reverse=True)
        self.top_n = top_n

    def calculate(self, score: float) -> str:
        cutoff = self.scores[self.top_n - 1] if len(self.scores) >= self.top_n else 0
        return "selected" if score >= cutoff else "rejected"


class ResultService:
    """Calculates final results and publishes them using configurable Strategy."""

    def __init__(self, db: Session):
        self.eval_repo = EvaluationRepository(db)
        self.app_repo = ApplicationRepository(db)
        self.interview_repo = InterviewRepository(db)
        self.strategy = ThresholdScoringStrategy()  # Default strategy

    def calculate_final_score(self, application_id: int):
        app = self.app_repo.get_by_id(application_id)
        if not app:
            raise HTTPException(status_code=404, detail="Application not found")
        interview = self.interview_repo.get_by_application(application_id)
        if not interview:
            raise HTTPException(status_code=404, detail="No interview found")
        evaluation = self.eval_repo.get_by_interview(interview.id)
        if not evaluation:
            raise HTTPException(status_code=404, detail="No evaluation found")
        return evaluation.score

    def publish_result(self, application_id: int, strategy: str = "threshold"):
        score = self.calculate_final_score(application_id)
        if strategy == "threshold":
            self.strategy = ThresholdScoringStrategy(threshold=60.0)
        status = self.strategy.calculate(score)
        app = self.app_repo.get_by_id(application_id)
        self.app_repo.update_status(app, status)
        return {"application_id": application_id, "score": score, "result": status}

    def publish_drive_results(self, drive_id: int):
        apps = self.app_repo.get_by_drive(drive_id)
        results = []
        for app in apps:
            if app.status == "interviewed":
                try:
                    result = self.publish_result(app.id)
                    results.append(result)
                except:
                    pass
        return results

    def get_drive_results(self, drive_id: int):
        apps = self.app_repo.get_by_drive(drive_id)
        results = []
        for app in apps:
            interview = self.interview_repo.get_by_application(app.id)
            evaluation = None
            if interview:
                evaluation = self.eval_repo.get_by_interview(interview.id)
            results.append({
                "application_id": app.id,
                "student_id": app.student_id,
                "status": app.status,
                "score": evaluation.score if evaluation else None,
                "feedback": evaluation.feedback if evaluation else None
            })
        return results
