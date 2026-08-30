from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel, Field
import datetime

from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.model import Model, ModelVersion, Dataset
from app.services.audit_service import log_audit_event
from app.governance.scoring_engine import calculate_governance_score

router = APIRouter(prefix="/models", tags=["models"])

class ModelCreate(BaseModel):
    name: str = Field(..., example="Loan Approval Model")
    version: str = Field("1.0.0", example="1.0.0")
    description: Optional[str] = Field("Automated credit decisioning model for loan evaluation.", example="Description")
    purpose: Optional[str] = Field("Loan approval determination based on risk factors", example="Purpose")
    business_domain: str = Field("Finance", example="Finance")
    model_type: str = Field("Classification", example="Classification")  # Classification, Regression
    owner: str = Field("Risk & Compliance Team", example="Risk & Compliance Team")
    department: str = Field("Credit Operations", example="Credit Operations")
    risk_category: str = Field("High", example="High")  # Low, Medium, High, Critical
    deployment_status: str = Field("Production", example="Production")  # Development, Testing, Production, Retired

class ModelUpdate(BaseModel):
    name: Optional[str] = None
    version: Optional[str] = None
    description: Optional[str] = None
    purpose: Optional[str] = None
    business_domain: Optional[str] = None
    model_type: Optional[str] = None
    owner: Optional[str] = None
    department: Optional[str] = None
    risk_category: Optional[str] = None
    deployment_status: Optional[str] = None

@router.get("", response_model=List[dict])
def list_models(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """GET /api/v1/models - List all registered AI models."""
    models = db.query(Model).order_by(Model.updated_at.desc()).all()
    
    # Ensure standard Loan Approval Model exists if empty database
    if not models:
        default_model = Model(
            name="Loan Approval Model",
            version="1.0.0",
            description="Built-in demonstration AI model for credit decisioning.",
            purpose="Automated credit underwriting and loan approval decisioning.",
            business_domain="Finance",
            model_type="Classification",
            owner="Risk & Compliance Team",
            department="Credit Operations",
            risk_category="High",
            deployment_status="Production",
            governance_score=72.0,
            last_assessment=datetime.datetime.now(datetime.timezone.utc)
        )
        db.add(default_model)
        db.commit()
        db.refresh(default_model)
        models = [default_model]

    res = []
    for m in models:
        res.append({
            "id": m.id,
            "name": m.name,
            "version": m.version,
            "description": m.description,
            "purpose": m.purpose,
            "business_domain": m.business_domain,
            "model_type": m.model_type,
            "owner": m.owner,
            "department": m.department,
            "risk_category": m.risk_category,
            "deployment_status": m.deployment_status,
            "governance_score": m.governance_score,
            "last_assessment": m.last_assessment.isoformat() if m.last_assessment else None,
            "created_at": m.created_at.isoformat() if m.created_at else None,
            "updated_at": m.updated_at.isoformat() if m.updated_at else None,
        })
    return res

@router.post("", response_model=dict, status_code=status.HTTP_201_CREATED)
def create_model(data: ModelCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """POST /api/v1/models - Register a new AI model."""
    new_model = Model(
        name=data.name,
        version=data.version,
        description=data.description,
        purpose=data.purpose,
        business_domain=data.business_domain,
        model_type=data.model_type,
        owner=data.owner,
        department=data.department,
        risk_category=data.risk_category,
        deployment_status=data.deployment_status,
        governance_score=85.0,
        last_assessment=datetime.datetime.now(datetime.timezone.utc)
    )
    db.add(new_model)
    db.commit()
    db.refresh(new_model)

    log_audit_event(
        db=db,
        action="Model Registered",
        model_id=new_model.id,
        user_email=current_user.email,
        entity="Model",
        new_value=f"Registered model {new_model.name} (v{new_model.version})",
        severity="INFO"
    )

    return {
        "id": new_model.id,
        "name": new_model.name,
        "version": new_model.version,
        "description": new_model.description,
        "purpose": new_model.purpose,
        "business_domain": new_model.business_domain,
        "model_type": new_model.model_type,
        "owner": new_model.owner,
        "department": new_model.department,
        "risk_category": new_model.risk_category,
        "deployment_status": new_model.deployment_status,
        "governance_score": new_model.governance_score,
        "last_assessment": new_model.last_assessment.isoformat() if new_model.last_assessment else None,
        "created_at": new_model.created_at.isoformat(),
        "updated_at": new_model.updated_at.isoformat()
    }

@router.get("/{model_id}", response_model=dict)
def get_model(model_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """GET /api/v1/models/{id} - Retrieve details for a specific AI model."""
    model = db.query(Model).filter(Model.id == model_id).first()
    if not model:
        raise HTTPException(status_code=404, detail="Model not found")

    return {
        "id": model.id,
        "name": model.name,
        "version": model.version,
        "description": model.description,
        "purpose": model.purpose,
        "business_domain": model.business_domain,
        "model_type": model.model_type,
        "owner": model.owner,
        "department": model.department,
        "risk_category": model.risk_category,
        "deployment_status": model.deployment_status,
        "governance_score": model.governance_score,
        "last_assessment": model.last_assessment.isoformat() if model.last_assessment else None,
        "created_at": model.created_at.isoformat(),
        "updated_at": model.updated_at.isoformat()
    }

@router.put("/{model_id}", response_model=dict)
def update_model(model_id: int, data: ModelUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """PUT /api/v1/models/{id} - Update model details."""
    model = db.query(Model).filter(Model.id == model_id).first()
    if not model:
        raise HTTPException(status_code=404, detail="Model not found")

    old_vals = f"Name: {model.name}, Status: {model.deployment_status}, Risk: {model.risk_category}"
    update_data = data.dict(exclude_unset=True)
    for field, val in update_data.items():
        setattr(model, field, val)

    model.updated_at = datetime.datetime.now(datetime.timezone.utc)
    db.commit()
    db.refresh(model)

    log_audit_event(
        db=db,
        action="Model Details Updated",
        model_id=model.id,
        user_email=current_user.email,
        entity="Model",
        previous_value=old_vals,
        new_value=f"Name: {model.name}, Status: {model.deployment_status}, Risk: {model.risk_category}",
        severity="INFO"
    )

    return {
        "id": model.id,
        "name": model.name,
        "version": model.version,
        "description": model.description,
        "purpose": model.purpose,
        "business_domain": model.business_domain,
        "model_type": model.model_type,
        "owner": model.owner,
        "department": model.department,
        "risk_category": model.risk_category,
        "deployment_status": model.deployment_status,
        "governance_score": model.governance_score,
        "last_assessment": model.last_assessment.isoformat() if model.last_assessment else None,
        "created_at": model.created_at.isoformat(),
        "updated_at": model.updated_at.isoformat()
    }

@router.delete("/{model_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_model(model_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """DELETE /api/v1/models/{id} - Delete an AI model."""
    model = db.query(Model).filter(Model.id == model_id).first()
    if not model:
        raise HTTPException(status_code=404, detail="Model not found")

    model_name = model.name
    db.delete(model)
    db.commit()

    log_audit_event(
        db=db,
        action="Model Deleted",
        model_id=None,
        user_email=current_user.email,
        entity="Model",
        previous_value=f"Deleted model ID {model_id} ({model_name})",
        severity="WARNING"
    )
    return None
