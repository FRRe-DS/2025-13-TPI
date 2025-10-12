from sqlalchemy import Column, Integer, ForeignKey, Numeric
from ..db import Base

class Cart(Base):
    __tablename__ = 'carts'
    id = Column(Integer, primary_key=True, index=True)
    userId = Column(Integer, ForeignKey('user.id'))
    total = Column(Integer)