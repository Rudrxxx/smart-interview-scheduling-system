from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from core.database import get_db
from core.dependencies import require_role
from schemas.evaluation_schema import EvaluationCreate, EvaluationResponse
from services.evaluation_service import EvaluationService

router = APIRouter(prefix="/api/evaluations", tags=["Evaluations"])


@router.post("/", response_model=EvaluationResponse)
def submit_evaluation(data: EvaluationCreate, db: Session = Depends(get_db),
                      current_user=Depends(require_role("interviewer"))):
    service = EvaluationService(db)
    return service.save_evaluation(data.interview_id, data.score, data.feedback, current_user.id)


@router.get("/{interview_id}", response_model=EvaluationResponse)
def get_evaluation(interview_id: int, db: Session = Depends(get_db),
                   current_user=Depends(require_role("admin", "interviewer"))):
    service = EvaluationService(db)
    return service.get_evaluation_by_interview(interview_id)
