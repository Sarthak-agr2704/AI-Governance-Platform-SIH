import os
from typing import List, Union
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "AegisAI — Responsible AI Governance Platform"
    VERSION: str = "0.1.0"
    API_V1_STR: str = "/api"

    # Environment
    ENV: str = Field(default="development")
    DEBUG: bool = Field(default=True)

    # Server Configuration
    HOST: str = Field(default="0.0.0.0")
    PORT: int = Field(default=8000)

    # Database Configuration (Defaults to SQLite for local dev)
    DATABASE_URL: str = Field(default="sqlite:///./aegis.db")

    # JWT Authentication Settings
    SECRET_KEY: str = Field(default="aegis_ai_secure_governance_jwt_secret_key_2026_sih")
    ALGORITHM: str = Field(default="HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(default=60 * 24)  # 24 hours

    # CORS Settings
    CORS_ORIGINS: List[str] = Field(
        default=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"]
    )

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )


settings = Settings()
