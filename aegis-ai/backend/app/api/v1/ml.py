from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.model import Model
from app.ml.trainer import train_loan_approval_model, load_trained_model
from app.services.audit_service import log_audit_event

router = APIRouter(prefix="/ml", tags=["ml"])

@router.post("/demo/train", response_model=dict)
def trigger_demo_training(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """POST /api/v1/ml/demo/train - Train or retrain the Loan Approval LogisticRegression model."""
    metrics, pipeline, df = train_loan_approval_model()
    
    # Update Loan Approval Model governance record in DB
    model_obj = db.query(Model).filter(Model.name.ilike("%Loan Approval%")).first()
    if model_obj:
        model_obj.governance_score = 72.0
        db.commit()

    log_audit_event(
        db=db,
        action="Demo Model Trained",
        model_id=model_obj.id if model_obj else None,
        user_email=current_user.email,
        entity="ML Model",
        new_value=f"Accuracy: {metrics['accuracy']}, F1: {metrics['f1']}, ROC-AUC: {metrics['roc_auc']}",
        severity="INFO"
    )

    return {
        "status": "SUCCESS",
        "message": "Loan Approval Model trained successfully on Synthetic Demo Dataset.",
        "metrics": metrics
    }

@router.get("/demo/status", response_model=dict)
def get_demo_status():
    """GET /api/v1/ml/demo/status - Get current ML model training status and metadata."""
    pipeline, metrics = load_trained_model()
    return {
        "status": "READY",
        "model_name": "Loan Approval Model",
        "algorithm": "LogisticRegression",
        "metrics": metrics
    }

@router.get("/models/{model_id}/performance", response_model=dict)
def get_model_performance(model_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """GET /api/v1/models/{id}/performance - Retrieve calculated performance metrics for a model."""
    pipeline, metrics = load_trained_model()
    return {
        "model_id": model_id,
        "performance": metrics
    }
