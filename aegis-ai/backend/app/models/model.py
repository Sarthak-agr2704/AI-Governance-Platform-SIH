from sqlalchemy import Column, Integer, String, Text, Float, DateTime, ForeignKey, Boolean, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


class Model(Base):
    __tablename__ = "models"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(255), nullable=False, index=True)
    version = Column(String(50), nullable=False, default="1.0.0")
    description = Column(Text, nullable=True)
    purpose = Column(Text, nullable=True)
    business_domain = Column(String(100), nullable=False, default="Finance")
    model_type = Column(String(50), nullable=False, default="Classification")  # Classification, Regression
    owner = Column(String(255), nullable=False, default="Risk & Compliance Team")
    department = Column(String(100), nullable=False, default="Credit Operations")
    risk_category = Column(String(50), nullable=False, default="High")  # Low, Medium, High, Critical
    deployment_status = Column(String(50), nullable=False, default="Production")  # Development, Testing, Production, Retired
    governance_score = Column(Float, nullable=False, default=72.0)
    last_assessment = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    versions = relationship("ModelVersion", back_populates="model", cascade="all, delete-orphan")
    datasets = relationship("Dataset", back_populates="model", cascade="all, delete-orphan")
    fairness_assessments = relationship("FairnessAssessment", back_populates="model", cascade="all, delete-orphan")
    monitoring_runs = relationship("MonitoringRun", back_populates="model", cascade="all, delete-orphan")
    audit_logs = relationship("AuditLog", back_populates="model", cascade="all, delete-orphan")
    reports = relationship("Report", back_populates="model", cascade="all, delete-orphan")


class ModelVersion(Base):
    __tablename__ = "model_versions"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    model_id = Column(Integer, ForeignKey("models.id", ondelete="CASCADE"), nullable=False)
    version = Column(String(50), nullable=False)
    description = Column(Text, nullable=True)
    file_path = Column(String(500), nullable=True)
    accuracy = Column(Float, nullable=True)
    precision = Column(Float, nullable=True)
    recall = Column(Float, nullable=True)
    f1_score = Column(Float, nullable=True)
    roc_auc = Column(Float, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    model = relationship("Model", back_populates="versions")


class Dataset(Base):
    __tablename__ = "datasets"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    model_id = Column(Integer, ForeignKey("models.id", ondelete="CASCADE"), nullable=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    dataset_type = Column(String(50), nullable=False, default="Synthetic Demo Dataset")
    record_count = Column(Integer, nullable=False, default=5000)
    features = Column(JSON, nullable=False)
    target = Column(String(100), nullable=False, default="loan_approved")
    is_synthetic = Column(Boolean, nullable=False, default=True)
    file_path = Column(String(500), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    model = relationship("Model", back_populates="datasets")
