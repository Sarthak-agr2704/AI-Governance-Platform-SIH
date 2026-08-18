from fastapi import APIRouter
from app.schemas.health import HealthResponse

router = APIRouter()


@router.get("/health", response_model=HealthResponse)
def health_check():
    """Returns application health status."""
    return HealthResponse(
        status="healthy",
        service="AegisAI Backend"
    )
