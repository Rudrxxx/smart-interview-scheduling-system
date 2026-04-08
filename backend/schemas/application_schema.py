from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ApplicationCreate(BaseModel):
    drive_id: int


class ApplicationStatusUpdate(BaseModel):
    status: str


class ApplicationResponse(BaseModel):
    id: int
    student_id: int
    drive_id: int
    status: str
    applied_at: datetime

    class Config:
        from_attributes = True
