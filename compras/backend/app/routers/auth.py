from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.db import get_db
from app.schemas.user import UserCreate, UserLogin, UserOut
from app.schemas.auth import Token
from app.crud.user import create as create_user, authenticate, get_by_email
from app.core.security import create_access_token, decode_token

router = APIRouter(prefix="/auth", tags=["auth"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

@router.post("/register", response_model=UserOut, status_code=201)
def register(payload: UserCreate, db: Session = Depends(get_db)):
    if get_by_email(db, payload.email):
        raise HTTPException(status_code=400, detail="Email ya registrado")
    if not payload.password or not isinstance(payload.password, str):
        raise HTTPException(status_code=422, detail="Requiere contraseña válida")
    if len(payload.password.encode("utf-8")) > 64:
        raise HTTPException(status_code=422, detail="La contraseña es demasiado larga")
    user = create_user(db, payload)
    return UserOut(
        id=user.id,
        email=user.email,
        firstName=user.firstName,
        lastName=user.lastName,
    )


@router.post("/login", response_model=Token)
def login(payload: UserLogin, db: Session = Depends(get_db)):
    user = authenticate(db, payload.email, payload.password)
    if not user:
        raise HTTPException(status_code=401, detail="credenciales inválidas")
    return Token(access_token=create_access_token(subject=user.id))


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> UserOut:
    payload = decode_token(token)
    if not payload or "sub" not in payload:
        raise HTTPException(status_code=401, detail="token expirado o inválido")
    user_id = int(payload["sub"])
    from app.models.user import User
    user = db.get(User, user_id)
    if not user or not user.is_active:
        raise HTTPException(status_code=401, detail="Usuario inactivo o no encontrado")
    return UserOut(
        id=user.id,
        email=user.email,
        firstName=user.firstName,
        lastName=user.lastName,
    )

@router.get("/me", response_model=UserOut)
def read_me(current_user: UserOut = Depends(get_current_user)):
    return current_user
