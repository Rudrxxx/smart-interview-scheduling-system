from sqlalchemy.orm import Session
from models.evaluation import Evaluation
from typing import Optional, List


class EvaluationRepository:
    """Repository Pattern — abstracts all DB ops for Evaluation"""

    def __init__(self, db: Session):
        self.db = db

    def save(self, data: dict) -> Evaluation:
        evaluation = Evaluation(**data)
        self.db.add(evaluation)
        self.db.commit()
        self.db.refresh(evaluation)
        return evaluation

    def get_by_interview(self, interview_id: int) -> Optional[Evaluation]:
        return self.db.query(Evaluation).filter(Evaluation.interview_id == interview_id).first()

    def get_all(self) -> List[Evaluation]:
        return self.db.query(Evaluation).all()
