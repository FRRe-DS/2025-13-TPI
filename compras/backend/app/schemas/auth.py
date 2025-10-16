from pydantic import BaseModel, EmailStr
from app.schemas.user import UserOut
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class LoginIn(BaseModel):
    email: EmailStr
    password: str

class RegisterResponse(BaseModel):
    user: UserOut
    access_token: str
    token_type: str = "bearer"