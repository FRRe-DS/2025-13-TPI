from sqlalchemy import Column, Integer, String, DateTime, func
from app.db import Base


class User(Base): 
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    keycloak_sub = Column(String(64), unique=True, index=True, nullable=False)

    nombre = Column(String(150), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)

    