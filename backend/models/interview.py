from sqlalchemy import Column, Integer, ForeignKey, DateTime, String
from sqlalchemy.orm import relationship
from core.database import Base


class Interview(Base):
    __tablename__ = "interviews"

    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("applications.id"), unique=True, nullable=False)
    interviewer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    scheduled_date = Column(DateTime, nullable=False)
    time_slot = Column(String, nullable=False)
    meet_link = Column(String, nullable=True)

    # Relationships
    application = relationship("Application", back_populates="interview")
    interviewer = relationship("User", foreign_keys=[interviewer_id])
    evaluation = relationship("Evaluation", back_populates="interview", uselist=False)

    def schedule_interview(self):
        pass

    def __repr__(self):
        return f"<Interview id={self.id} date={self.scheduled_date}>"
