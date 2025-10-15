from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import session
from ..schemas.auth import Token, LoginIn
from ..schemas.user import UserCreate, UserOut
from ..crud.crud_user import create_user, authenticate_user, get_user

from .. import crud, schemas
from ..app.db import session 

router = APIRouter(
    prefix="/auth",
    tags=["Frontend - Auth"] # La etiqueta de tu documentación
)

get_db = session()

@router.post(
    "/login",
    response_model=schemas.Token, # Define la respuesta para el código 200
    summary="Iniciar sesión"      # El resumen de tu documentación
)

def login(data: schemas.Login, db: Session = Depends(get_db)):
    user = crud.get_user(db, data.email)
    if not user or not user.check_password(data.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Credenciales inválidas")
    token = create_access_token(subject=user.email)
    return {"access_token": token, "token_type": "bearer"}