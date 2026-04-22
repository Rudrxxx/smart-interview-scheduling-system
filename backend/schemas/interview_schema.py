from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class InterviewCreate(BaseModel):
    application_id: int
    interviewer_id: int
    scheduled_date: datetime
    round_number: int
    meet_link: Optional[str] = None


class InterviewResponse(BaseModel):
    id: int
    application_id: int
    interviewer_id: int
    scheduled_date: datetime
    round_number: int
    meet_link: Optional[str]

    class Config:
        from_attributes = True
