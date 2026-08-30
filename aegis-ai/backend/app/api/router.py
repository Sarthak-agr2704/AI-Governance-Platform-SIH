from fastapi import APIRouter
from app.api.v1 import health, auth, models, ml, fairness, explainability, monitoring, governance, audit, reports

api_router = APIRouter()
api_router.include_router(health.router, tags=["Health"])
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(models.router)
api_router.include_router(ml.router)
api_router.include_router(fairness.router)
api_router.include_router(explainability.router)
api_router.include_router(monitoring.router)
api_router.include_router(governance.router)
api_router.include_router(audit.router)
api_router.include_router(reports.router)
