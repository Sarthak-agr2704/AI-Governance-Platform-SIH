from sqlalchemy import Column, Integer, String, Text, Float, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


class MonitoringRun(Base):
    __tablename__ = "monitoring_runs"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    model_id = Column(Integer, ForeignKey("models.id", ondelete="CASCADE"), nullable=False)
    run_type = Column(String(50), nullable=False, default="Simulation")
    dataset_size = Column(Integer, nullable=False, default=1000)
    accuracy = Column(Float, nullable=True)
    precision = Column(Float, nullable=True)
    recall = Column(Float, nullable=True)
    f1_score = Column(Float, nullable=True)
    data_drift_pct = Column(Float, nullable=False, default=0.0)
    prediction_drift_pct = Column(Float, nullable=False, default=0.0)
    fairness_score = Column(Float, nullable=False, default=80.0)
    status = Column(String(20), nullable=False, default="HEALTHY")  # HEALTHY, WARNING, DEGRADED, CRITICAL
    alerts_json = Column(JSON, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    model = relationship("Model", back_populates="monitoring_runs")
