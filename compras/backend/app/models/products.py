from sqlalchemy import Column, Integer, String, Numeric
from ..db import Base

class Product(Base):
    __tablename__ = 'products'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    description = Column(String)
    price = Column(Numeric(10, 2))
    stock = Column(Integer)
    category = Column(String)