from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from core.database import Base
from datetime import datetime


class RecruitmentDrive(Base):
    __tablename__ = "recruitment_drives"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text)
    eligibility_criteria = Column(Text)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    deadline = Column(DateTime, nullable=True)
    is_active = Column(Integer, default=1)

    # Relationships
    creator = relationship("User", foreign_keys=[created_by])
    applications = relationship("Application", back_populates="drive")

    def create_drive(self):
        pass

    def __repr__(self):
        return f"<RecruitmentDrive id={self.id} title={self.title}>"
