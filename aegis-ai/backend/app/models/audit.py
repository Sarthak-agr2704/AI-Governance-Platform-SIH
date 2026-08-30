from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now(), nullable=False, index=True)
    user_email = Column(String(255), nullable=False, default="admin@aegis.ai", index=True)
    action = Column(String(100), nullable=False, index=True)  # Model Registered, Fairness Assessment Completed, etc.
    model_id = Column(Integer, ForeignKey("models.id", ondelete="SET NULL"), nullable=True)
    entity = Column(String(100), nullable=False, default="Model")
    result = Column(String(50), nullable=False, default="SUCCESS")
    previous_value = Column(Text, nullable=True)
    new_value = Column(Text, nullable=True)
    severity = Column(String(20), nullable=False, default="INFO")  # INFO, WARNING, CRITICAL

    model = relationship("Model", back_populates="audit_logs")
