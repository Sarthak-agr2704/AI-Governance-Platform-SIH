from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.logging import logger
from app.core.database import Base, engine
from app.api.router import api_router

# Initialize database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url="/api/v1/openapi.json"
)

# Configure CORS Middleware for all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root level health checks
@app.get("/health")
@app.get("/api/health")
@app.get("/api/v1/health")
def root_health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "database": "connected"
    }

# Mount API router under both /api/v1 and /api for backwards & forwards compatibility
app.include_router(api_router, prefix="/api/v1")
app.include_router(api_router, prefix="/api")


def seed_demo_users():
    from app.core.database import SessionLocal
    from app.models.user import User
    from app.core.security import hash_password

    db = SessionLocal()
    try:
        demos = [
            ("Admin Officer", "admin@aegis.ai", "DemoPass123!", "Admin"),
            ("AI Lead Engineer", "engineer@aegis.ai", "DemoPass123!", "AI/ML Engineer"),
        ]
        for name, email, password, role in demos:
            existing = db.query(User).filter(User.email == email).first()
            if not existing:
                user = User(
                    name=name,
                    email=email,
                    password_hash=hash_password(password),
                    role=role
                )
                db.add(user)
        db.commit()
    except Exception as e:
        logger.error(f"Error seeding demo users: {e}")
        db.rollback()
    finally:
        db.close()


@app.on_event("startup")
async def startup_event():
    logger.info(f"Starting {settings.PROJECT_NAME} backend in {settings.ENV} mode.")
    seed_demo_users()


@app.on_event("shutdown")
async def shutdown_event():
    logger.info(f"Shutting down {settings.PROJECT_NAME} backend.")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=False)
