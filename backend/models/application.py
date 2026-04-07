from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from core.database import Base
from datetime import datetime
import enum


class ApplicationStatus(str, enum.Enum):
    applied = "applied"
    scheduled = "scheduled"
    interviewed = "interviewed"
    selected = "selected"
    rejected = "rejected"


class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    drive_id = Column(Integer, ForeignKey("recruitment_drives.id"), nullable=False)
    status = Column(String, default=ApplicationStatus.applied)
    applied_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    student = relationship("User", foreign_keys=[student_id])
    drive = relationship("RecruitmentDrive", back_populates="applications")
    interview = relationship("Interview", back_populates="application", uselist=False)

    def update_status(self, new_status: str):
        self.status = new_status

    def __repr__(self):
        return f"<Application id={self.id} status={self.status}>"
