from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.model import Model
from app.governance.scoring_engine import calculate_governance_score
from app.governance.compliance_engine import evaluate_compliance_rules
from app.ml.fairness_engine import compute_fairness_analysis

router = APIRouter(tags=["governance"])

@router.get("/models/{model_id}/governance", response_model=dict)
def get_model_governance_score(model_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """GET /api/v1/models/{id}/governance - Compute integrated Governance Score and risk level."""
    model_obj = db.query(Model).filter(Model.id == model_id).first()
    if not model_obj:
        raise HTTPException(status_code=404, detail="Model not found")

    # Fetch live fairness score
    fairness_res = compute_fairness_analysis(sensitive_attribute="Gender")
    fairness_score = fairness_res["overall_fairness_score"]

    gov_res = calculate_governance_score(
        fairness_score=fairness_score,
        performance_score=91.0,
        explainability_score=88.0,
        data_quality_score=84.0,
        monitoring_score=70.0,
        compliance_score=80.0
    )

    # Persist latest score in model object
    model_obj.governance_score = gov_res["overall_score"]
    model_obj.risk_category = gov_res["risk_level"].capitalize()
    db.commit()

    return {
        "model_id": model_id,
        "model_name": model_obj.name,
        **gov_res
    }

@router.get("/models/{model_id}/compliance", response_model=dict)
def get_model_compliance(model_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """GET /api/v1/models/{id}/compliance - Retrieve governance policy compliance checks."""
    model_obj = db.query(Model).filter(Model.id == model_id).first()
    if not model_obj:
        raise HTTPException(status_code=404, detail="Model not found")

    compliance_res = evaluate_compliance_rules(model_obj)
    return {
        "model_id": model_id,
        **compliance_res
    }
