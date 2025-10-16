from pydantic import BaseModel, EmailStr
from typing import Optional


class UserBase(BaseModel):
    email: EmailStr
    firstName: Optional[str] = None
    lastName: Optional[str] = None


class UserCreate(UserBase):
    email: EmailStr
    password: str
    firstName: Optional[str] = None
    lastName: Optional[str] = None


class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    firstName: Optional[str] = None
    lastName: Optional[str] = None
    password: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(UserBase):
    id: int

    class Config:
        orm_mode = True

class UserOut(UserBase):
    id: int
    is_active: bool
    is_admin: bool