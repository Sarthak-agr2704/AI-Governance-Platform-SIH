from sqlalchemy import Column, Integer, String, Text, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    model_id = Column(Integer, ForeignKey("models.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    file_size_bytes = Column(Integer, nullable=False, default=0)
    governance_score = Column(Float, nullable=False, default=72.0)
    risk_level = Column(String(20), nullable=False, default="HIGH")
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    model = relationship("Model", back_populates="reports")
