from sqlalchemy import Column, Integer, ForeignKey, Numeric
from sqlalchemy.orm import relationship
from ..db import Base

class Cart(Base):
    __tablename__ = 'carts'
    id = Column(Integer, primary_key=True, index=True)
    userId = Column(Integer, ForeignKey('users.id'))
    total = Column(Numeric(10, 2))

    items = relationship("Cart_Item", back_populates="cart", cascade="all, delete-orphan")
    user = relationship("User", back_populates="cart")