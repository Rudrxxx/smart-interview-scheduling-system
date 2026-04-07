from sqlalchemy import Column, Integer, ForeignKey, Float, Text, DateTime
from sqlalchemy.orm import relationship
from core.database import Base
from datetime import datetime


class Evaluation(Base):
    __tablename__ = "evaluations"

    id = Column(Integer, primary_key=True, index=True)
    interview_id = Column(Integer, ForeignKey("interviews.id"), unique=True, nullable=False)
    score = Column(Float, nullable=False)
    feedback = Column(Text)
    evaluated_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    interview = relationship("Interview", back_populates="evaluation")

    def calculate_score(self):
        return self.score

    def __repr__(self):
        return f"<Evaluation id={self.id} score={self.score}>"
