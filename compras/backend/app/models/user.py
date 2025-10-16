from sqlalchemy import Column, Integer, String
from ..db import Base
from sqlalchemy.orm import relationship

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String, nullable=False)
    firstName = Column(String)
    lastName = Column(String)
    

    # relación uno-a-uno / uno-a-muchos desde el lado "padre"
    #userProfile = relationship("userProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    #orders = relationship("Order", back_populates="user", cascade="all, delete-orphan")
    #cart = relationship("Cart", back_populates="user", uselist=False, cascade="all, delete-orphan")