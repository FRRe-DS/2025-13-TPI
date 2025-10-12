from sqlalchemy import Column, Integer, ForeignKey, Numeric
from sqlalchemy.orm import relationship
from ..db import Base

class Cart_Item(Base):
    __tablename__ = 'cart_items'
    id = Column(Integer, primary_key=True, index=True)
    cart_id = Column(Integer, ForeignKey('carts.id'), nullable=False)
    product_id = Column(Integer, ForeignKey('products.id'), nullable=False)
    quantity = Column(Integer, nullable=False)
    price = Column(Numeric(10, 2), nullable=False)

    cart = relationship("Cart", back_populates="items")
    product = relationship("Product")