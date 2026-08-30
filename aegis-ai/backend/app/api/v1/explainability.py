from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from typing import Dict, Any

from app.api.deps import get_current_user
from app.models.user import User
from app.ml.explainability_engine import get_global_explainability, predict_and_explain_sample

router = APIRouter(tags=["explainability"])

class LocalPredictionRequest(BaseModel):
    age: int = Field(35, example=35)
    gender: str = Field("Female", example="Female")
    income: float = Field(65000.0, example=65000.0)
    employment_status: str = Field("Employed", example="Employed")
    credit_score: float = Field(620.0, example=620.0)
    loan_amount: float = Field(25000.0, example=25000.0)
    previous_defaults: int = Field(1, example=1)
    education: str = Field("Bachelor", example="Bachelor")

@router.get("/models/{model_id}/explainability/global", response_model=dict)
def get_global_explanations(model_id: int, current_user: User = Depends(get_current_user)):
    """GET /api/v1/models/{id}/explainability/global - Get global ranked feature importances."""
    importances = get_global_explainability()
    return {
        "model_id": model_id,
        "global_feature_importance": importances
    }

@router.post("/models/{model_id}/explainability/predict", response_model=dict)
def predict_and_explain(model_id: int, req: LocalPredictionRequest, current_user: User = Depends(get_current_user)):
    """POST /api/v1/models/{id}/explainability/predict - Predict outcome and generate local feature contribution attribution."""
    sample_data = req.dict()
    explanation = predict_and_explain_sample(sample_data)
    return {
        "model_id": model_id,
        **explanation
    }
