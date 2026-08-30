from datetime import datetime
from enum import Enum
from typing import Optional
from pydantic import BaseModel, EmailStr, Field


class UserRole(str, Enum):
    ADMIN = "Admin"
    AI_ML_ENGINEER = "AI/ML Engineer"
    GOVERNANCE_OFFICER = "Governance Officer"
    AUDITOR = "Auditor"


class UserRegister(BaseModel):
    name: str = Field(..., min_length=2, max_length=100, example="Jane Doe")
    email: EmailStr = Field(..., example="jane.doe@aegis.ai")
    password: str = Field(..., min_length=6, max_length=100, example="SecurePass123!")
    role: UserRole = Field(..., example=UserRole.AI_ML_ENGINEER)


class UserLogin(BaseModel):
    email: EmailStr = Field(..., example="jane.doe@aegis.ai")
    password: str = Field(..., example="SecurePass123!")


class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str
    created_at: datetime

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
