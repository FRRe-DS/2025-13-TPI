from sqlalchemy import Column, Integer, String, DateTime
from ..db import Base

class User_Profile(Base):
    __tablename__ = 'user_profiles'
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    phone = Column(Integer, unique=True)
    dni = Column(Integer, unique=True)
    birthdate = Column(DateTime)
    address = Column(String)
    created_at = Column(DateTime)
    updated_at = Column(DateTime)

    