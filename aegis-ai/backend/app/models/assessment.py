from sqlalchemy import Column, Integer, String, Text, Float, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


class FairnessAssessment(Base):
    __tablename__ = "fairness_assessments"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    model_id = Column(Integer, ForeignKey("models.id", ondelete="CASCADE"), nullable=False)
    sensitive_attribute = Column(String(50), nullable=False)  # Gender, Age Group
    overall_fairness_score = Column(Float, nullable=False)  # 0 - 100
    status = Column(String(20), nullable=False, default="PASS")  # PASS, WARNING, FAIL
    metrics_json = Column(JSON, nullable=False)  # Group metrics, selection rates, TPR, FPR, FNR, parity diff/ratio
    recommendations_json = Column(JSON, nullable=False)  # Dynamic recommendations list
    explanation = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    model = relationship("Model", back_populates="fairness_assessments")


class ExplainabilitySummary(Base):
    __tablename__ = "explainability_summaries"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    model_id = Column(Integer, ForeignKey("models.id", ondelete="CASCADE"), nullable=False)
    global_importances = Column(JSON, nullable=False)  # Feature -> importance score mapping
    sample_explanations = Column(JSON, nullable=True)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
