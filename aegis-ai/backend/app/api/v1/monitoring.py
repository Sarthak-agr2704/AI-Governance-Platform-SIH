from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field
from typing import Optional

from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.model import Model
from app.models.monitoring import MonitoringRun
from app.ml.monitoring_engine import simulate_production_monitoring
from app.services.audit_service import log_audit_event

router = APIRouter(tags=["monitoring"])

class SimulationRequest(BaseModel):
    shift_severity: float = Field(0.25, example=0.25)

@router.post("/models/{model_id}/monitoring/simulate", response_model=dict)
def simulate_monitoring_run(model_id: int, req: Optional[SimulationRequest] = None, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """POST /api/v1/models/{id}/monitoring/simulate - Simulate production dataset shift and run drift monitoring."""
    model_obj = db.query(Model).filter(Model.id == model_id).first()
    if not model_obj:
        raise HTTPException(status_code=404, detail="Model not found")

    severity = req.shift_severity if req else 0.25
    res = simulate_production_monitoring(shift_severity=severity)

    # Save monitoring run into DB
    m_run = MonitoringRun(
        model_id=model_id,
        run_type="Simulation",
        dataset_size=res["dataset_size"],
        accuracy=res["accuracy"],
        precision=res["precision"],
        recall=res["recall"],
        f1_score=res["f1"],
        data_drift_pct=res["data_drift_pct"],
        prediction_drift_pct=res["prediction_drift_pct"],
        fairness_score=res["fairness_score"],
        status=res["status"],
        alerts_json=res["alerts"]
    )
    db.add(m_run)
    db.commit()
    db.refresh(m_run)

    log_audit_event(
        db=db,
        action="Monitoring Run Completed",
        model_id=model_id,
        user_email=current_user.email,
        entity="MonitoringRun",
        new_value=f"Status: {res['status']}, Data Drift: {res['data_drift_pct']}%, Fairness: {res['fairness_score']}",
        severity="WARNING" if res["status"] in ["WARNING", "DEGRADED", "CRITICAL"] else "INFO"
    )

    return res

@router.get("/models/{model_id}/monitoring", response_model=dict)
def get_monitoring_history(model_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """GET /api/v1/models/{id}/monitoring - Retrieve monitoring health, drift metrics, and history."""
    runs = db.query(MonitoringRun).filter(MonitoringRun.model_id == model_id).order_by(MonitoringRun.created_at.desc()).limit(10).all()
    
    if not runs:
        # Run initial simulation if no runs recorded yet
        res = simulate_production_monitoring(shift_severity=0.15)
        return {
            "model_id": model_id,
            "latest_run": res,
            "history": [res]
        }

    latest = runs[0]
    history_data = []
    for r in runs:
        history_data.append({
            "id": r.id,
            "run_type": r.run_type,
            "accuracy": r.accuracy,
            "data_drift_pct": r.data_drift_pct,
            "prediction_drift_pct": r.prediction_drift_pct,
            "fairness_score": r.fairness_score,
            "status": r.status,
            "created_at": r.created_at.isoformat()
        })

    latest_data = {
        "run_type": latest.run_type,
        "dataset_size": latest.dataset_size,
        "accuracy": latest.accuracy,
        "precision": latest.precision,
        "recall": latest.recall,
        "f1": latest.f1_score,
        "data_drift_pct": latest.data_drift_pct,
        "prediction_drift_pct": latest.prediction_drift_pct,
        "fairness_score": latest.fairness_score,
        "status": latest.status,
        "alerts": latest.alerts_json or [],
        "disclaimer": "Synthetic Demo Monitoring Data"
    }

    return {
        "model_id": model_id,
        "latest_run": latest_data,
        "history": history_data
    }
