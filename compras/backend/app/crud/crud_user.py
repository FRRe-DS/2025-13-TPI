from sqlalchemy.orm import Session

from compras.backend.app.schemas.user import User
from .. import models, schemas

def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    from werkzeug.security import check_password_hash
    return check_password_hash(hashed_password, plain_password)


def create_user(db: Session, user: schemas.UserCreate):
    db_user = models.User(name=user.name, email=user.email)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def authenticate_user(db: Session, email: str, password: str) -> User | None:
    user = get_user(db, email=email)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user