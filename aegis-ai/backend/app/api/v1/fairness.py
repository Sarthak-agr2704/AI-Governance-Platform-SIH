from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field
from typing import Optional
import datetime

from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.model import Model
from app.models.assessment import FairnessAssessment
from app.ml.fairness_engine import compute_fairness_analysis
from app.services.audit_service import log_audit_event

router = APIRouter(tags=["fairness"])

class FairnessAnalysisRequest(BaseModel):
    sensitive_attribute: str = Field("Gender", example="Gender")  # Gender, Age Group
    warning_threshold: float = Field(0.10, example=0.10)
    critical_threshold: float = Field(0.20, example=0.20)

@router.post("/models/{model_id}/fairness/analyze", response_model=dict)
def analyze_fairness(model_id: int, req: FairnessAnalysisRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """POST /api/v1/models/{id}/fairness/analyze - Execute fairness evaluation on sensitive attribute."""
    model_obj = db.query(Model).filter(Model.id == model_id).first()
    if not model_obj:
        raise HTTPException(status_code=404, detail="Model not found")

    analysis = compute_fairness_analysis(
        sensitive_attribute=req.sensitive_attribute,
        warning_threshold=req.warning_threshold,
        critical_threshold=req.critical_threshold
    )

    # Save assessment in DB
    assessment = FairnessAssessment(
        model_id=model_id,
        sensitive_attribute=req.sensitive_attribute,
        overall_fairness_score=analysis["overall_fairness_score"],
        status=analysis["status"],
        metrics_json=analysis,
        recommendations_json=analysis["recommendations"],
        explanation=analysis["explanation"]
    )
    db.add(assessment)

    # Update model's last assessment date
    model_obj.last_assessment = datetime.datetime.now(datetime.timezone.utc)
    db.commit()
    db.refresh(assessment)

    log_audit_event(
        db=db,
        action="Fairness Assessment Completed",
        model_id=model_id,
        user_email=current_user.email,
        entity="FairnessAssessment",
        new_value=f"Attribute: {req.sensitive_attribute}, Score: {analysis['overall_fairness_score']}/100, Status: {analysis['status']}",
        severity="WARNING" if analysis["status"] != "PASS" else "INFO"
    )

    return analysis

@router.get("/models/{model_id}/fairness", response_model=dict)
def get_fairness(model_id: int, sensitive_attribute: Optional[str] = "Gender", db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """GET /api/v1/models/{id}/fairness - Retrieve latest fairness evaluation metrics."""
    return compute_fairness_analysis(sensitive_attribute=sensitive_attribute or "Gender")
