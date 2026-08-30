from sqlalchemy.orm import Session
from app.models.audit import AuditLog
from typing import Optional

def log_audit_event(
    db: Session,
    action: str,
    model_id: Optional[int] = None,
    user_email: str = "admin@aegis.ai",
    entity: str = "Model",
    result: str = "SUCCESS",
    previous_value: Optional[str] = None,
    new_value: Optional[str] = None,
    severity: str = "INFO"
) -> AuditLog:
    """
    Centralized helper function to log audit events into the database.
    """
    audit = AuditLog(
        action=action,
        model_id=model_id,
        user_email=user_email,
        entity=entity,
        result=result,
        previous_value=previous_value,
        new_value=new_value,
        severity=severity
    )
    db.add(audit)
    db.commit()
    db.refresh(audit)
    return audit
