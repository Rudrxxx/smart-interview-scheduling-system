from pydantic import BaseModel
from typing import Optional


class EvaluationCreate(BaseModel):
    interview_id: int
    score: float
    feedback: Optional[str] = None


class EvaluationResponse(BaseModel):
    id: int
    interview_id: int
    score: float
    feedback: Optional[str]

    class Config:
        from_attributes = True
