from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr


class UserProfileBase(BaseModel):
    email: Optional[EmailStr] = None
    phone: Optional[int] = None
    dni: Optional[int] = None
    birthdate: Optional[datetime] = None
    address: Optional[str] = None


class UserProfileCreate(UserProfileBase):
    user_id: int


class UserProfileUpdate(BaseModel):
    email: Optional[EmailStr] = None
    phone: Optional[int] = None
    dni: Optional[int] = None
    birthdate: Optional[datetime] = None
    address: Optional[str] = None


class UserProfile(UserProfileBase):
    id: int
    user_id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

