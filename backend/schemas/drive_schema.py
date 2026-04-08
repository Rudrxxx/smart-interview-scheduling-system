from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class DriveCreate(BaseModel):
    title: str
    description: Optional[str] = None
    eligibility_criteria: Optional[str] = None
    deadline: Optional[datetime] = None


class DriveUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    eligibility_criteria: Optional[str] = None
    deadline: Optional[datetime] = None
    is_active: Optional[int] = None


class DriveResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    eligibility_criteria: Optional[str]
    created_by: int
    created_at: datetime
    deadline: Optional[datetime]
    is_active: int

    class Config:
        from_attributes = True
