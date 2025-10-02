from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class Login(BaseModel):
    email: str
    contraseña: str

class Register(BaseModel):
    email: str
    contraseña: str
    repetirContraseña: str
    nombre: str
    apellido: str

@router.post("/login")
def login(data: Login):
    if data.email == "test@mail.com" and data.contraseña == "1234":
        return {"token": "jwt.token.simulado"}
    return {"error": "Credenciales inválidas"}

@router.post("/register")
def register(data: Register):
    return {"message": f"Usuario {data.nombre} registrado con éxito"}

@router.get("/refresh")
def refresh():
    return {"token": "jwt.token.refrescado"}
