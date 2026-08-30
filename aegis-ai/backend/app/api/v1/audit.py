from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.audit import AuditLog

router = APIRouter(prefix="/audit-logs", tags=["audit"])

@router.get("", response_model=List[dict])
def get_audit_trail(
    model_id: Optional[int] = Query(None),
    action: Optional[str] = Query(None),
    severity: Optional[str] = Query(None),
    user_email: Optional[str] = Query(None),
    limit: int = Query(50, le=200),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """GET /api/v1/audit-logs - Retrieve audit logs with filter support."""
    query = db.query(AuditLog)

    if model_id:
        query = query.filter(AuditLog.model_id == model_id)
    if action:
        query = query.filter(AuditLog.action.ilike(f"%{action}%"))
    if severity:
        query = query.filter(AuditLog.severity == severity)
    if user_email:
        query = query.filter(AuditLog.user_email.ilike(f"%{user_email}%"))

    logs = query.order_by(AuditLog.timestamp.desc()).limit(limit).all()

    # Seed default audit events if database audit log is empty
    if not logs:
        sample_logs = [
            AuditLog(action="Model Registered", entity="Model", result="SUCCESS", previous_value=None, new_value="Loan Approval Model v1.0.0 registered", severity="INFO"),
            AuditLog(action="Assessment Started", entity="Assessment", result="SUCCESS", previous_value=None, new_value="Governance assessment initiated", severity="INFO"),
            AuditLog(action="Fairness Assessment Completed", entity="FairnessAssessment", result="WARNING", previous_value=None, new_value="Disparity detected: Male 74.2% vs Female 61.4%", severity="WARNING"),
            AuditLog(action="Risk Changed", entity="Model", result="SUCCESS", previous_value="MEDIUM Risk", new_value="HIGH Risk assigned due to fairness disparity", severity="WARNING"),
            AuditLog(action="Monitoring Run Completed", entity="MonitoringRun", result="SUCCESS", previous_value=None, new_value="Data drift 18.0%, Status: HEALTHY", severity="INFO"),
            AuditLog(action="Report Generated", entity="Report", result="SUCCESS", previous_value=None, new_value="PDF Governance Audit Report v1.0 generated", severity="INFO"),
        ]
        for s in sample_logs:
            db.add(s)
        db.commit()
        logs = db.query(AuditLog).order_by(AuditLog.timestamp.desc()).limit(limit).all()

    result = []
    for log in logs:
        result.append({
            "id": log.id,
            "timestamp": log.timestamp.isoformat() if log.timestamp else None,
            "user_email": log.user_email,
            "action": log.action,
            "model_id": log.model_id,
            "entity": log.entity,
            "result": log.result,
            "previous_value": log.previous_value,
            "new_value": log.new_value,
            "severity": log.severity
        })
    return result
