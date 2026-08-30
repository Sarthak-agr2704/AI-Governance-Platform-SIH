import os
import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field
from typing import List, Optional

from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.model import Model
from app.models.report import Report
from app.models.audit import AuditLog
from app.ml.trainer import load_trained_model
from app.ml.fairness_engine import compute_fairness_analysis
from app.ml.explainability_engine import get_global_explainability
from app.ml.monitoring_engine import simulate_production_monitoring
from app.governance.scoring_engine import calculate_governance_score
from app.governance.compliance_engine import evaluate_compliance_rules
from app.reports.pdf_generator import generate_governance_pdf_report
from app.services.audit_service import log_audit_event

router = APIRouter(prefix="/reports", tags=["reports"])

REPORTS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "reports"))

class ReportCreateRequest(BaseModel):
    model_id: int = Field(..., example=1)
    title: Optional[str] = Field("AegisAI Governance Audit Report", example="AegisAI Governance Audit Report")

@router.post("", response_model=dict, status_code=status.HTTP_201_CREATED)
def create_report(req: ReportCreateRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """POST /api/v1/reports - Generate a professional 15-section PDF audit report for an AI model."""
    model_obj = db.query(Model).filter(Model.id == req.model_id).first()
    if not model_obj:
        raise HTTPException(status_code=404, detail="Model not found")

    # Gather actual model evaluation data across modules
    _, perf_metrics = load_trained_model()
    fairness_data = compute_fairness_analysis(sensitive_attribute="Gender")
    explain_data = get_global_explainability()
    monitoring_data = simulate_production_monitoring(shift_severity=0.15)
    gov_data = calculate_governance_score(
        fairness_score=fairness_data["overall_fairness_score"],
        performance_score=91.0,
        explainability_score=88.0,
        data_quality_score=84.0,
        monitoring_score=70.0,
        compliance_score=80.0
    )
    compliance_data = evaluate_compliance_rules(model_obj)
    
    # Audit log excerpt
    audit_logs = db.query(AuditLog).order_by(AuditLog.timestamp.desc()).limit(10).all()
    audit_list = []
    for a in audit_logs:
        audit_list.append({
            "timestamp": a.timestamp.isoformat() if a.timestamp else "",
            "user_email": a.user_email,
            "action": a.action
        })

    model_dict = {
        "name": model_obj.name,
        "version": model_obj.version,
        "owner": model_obj.owner,
        "department": model_obj.department,
        "business_domain": model_obj.business_domain,
        "model_type": model_obj.model_type,
        "purpose": model_obj.purpose,
        "risk_category": model_obj.risk_category,
        "deployment_status": model_obj.deployment_status
    }

    timestamp_str = datetime.datetime.now(datetime.timezone.utc).strftime("%Y%m%d_%H%M%S")
    pdf_filename = f"AegisAI_Audit_Report_Model_{model_obj.id}_{timestamp_str}.pdf"
    pdf_path = os.path.join(REPORTS_DIR, pdf_filename)

    generate_governance_pdf_report(
        model_data=model_dict,
        performance_data=perf_metrics,
        fairness_data=fairness_data,
        explainability_data=explain_data,
        monitoring_data=monitoring_data,
        governance_data=gov_data,
        compliance_data=compliance_data,
        audit_data=audit_list,
        output_filename=pdf_path
    )

    file_size = os.path.getsize(pdf_path) if os.path.exists(pdf_path) else 0

    report_rec = Report(
        model_id=req.model_id,
        title=req.title or f"Governance Audit Report - {model_obj.name}",
        file_path=pdf_path,
        file_size_bytes=file_size,
        governance_score=gov_data["overall_score"],
        risk_level=gov_data["risk_level"]
    )
    db.add(report_rec)
    db.commit()
    db.refresh(report_rec)

    log_audit_event(
        db=db,
        action="Report Generated",
        model_id=req.model_id,
        user_email=current_user.email,
        entity="Report",
        new_value=f"Generated PDF Report '{report_rec.title}' ({file_size} bytes)",
        severity="INFO"
    )

    return {
        "id": report_rec.id,
        "model_id": report_rec.model_id,
        "title": report_rec.title,
        "governance_score": report_rec.governance_score,
        "risk_level": report_rec.risk_level,
        "file_size_bytes": report_rec.file_size_bytes,
        "download_url": f"/api/v1/reports/{report_rec.id}/download",
        "created_at": report_rec.created_at.isoformat()
    }

@router.get("", response_model=List[dict])
def list_reports(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """GET /api/v1/reports - List all generated governance reports."""
    reports = db.query(Report).order_by(Report.created_at.desc()).all()
    res = []
    for r in reports:
        res.append({
            "id": r.id,
            "model_id": r.model_id,
            "title": r.title,
            "governance_score": r.governance_score,
            "risk_level": r.risk_level,
            "file_size_bytes": r.file_size_bytes,
            "download_url": f"/api/v1/reports/{r.id}/download",
            "created_at": r.created_at.isoformat()
        })
    return res

@router.get("/{report_id}", response_model=dict)
def get_report_details(report_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """GET /api/v1/reports/{id} - Get metadata for a specific report."""
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return {
        "id": report.id,
        "model_id": report.model_id,
        "title": report.title,
        "governance_score": report.governance_score,
        "risk_level": report.risk_level,
        "file_size_bytes": report.file_size_bytes,
        "download_url": f"/api/v1/reports/{report.id}/download",
        "created_at": report.created_at.isoformat()
    }

@router.get("/{report_id}/download")
def download_report(report_id: int, db: Session = Depends(get_db)):
    """GET /api/v1/reports/{id}/download - Download the generated PDF report file."""
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report or not os.path.exists(report.file_path):
        raise HTTPException(status_code=404, detail="Report file not found")
    return FileResponse(
        path=report.file_path,
        filename=os.path.basename(report.file_path),
        media_type="application/pdf"
    )
