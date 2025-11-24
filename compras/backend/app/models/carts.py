from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.db import Base

class Cart(Base):
    __tablename__ = "carts"

    id = Column(Integer, primary_key=True, index=True)
    # Guarda el ID del usuario de Keycloak (claim 'sub')
    user_id = Column(String, index=True, nullable=False)

    items = relationship("CartItem", back_populates="cart", cascade="all, delete-orphan")


class CartItem(Base):
    __tablename__ = "cart_items"

    id = Column(Integer, primary_key=True, index=True)
    cart_id = Column(Integer, ForeignKey("carts.id"), nullable=False)

    #lo que debería ir en product_id lo dejo comentado para evitar conflictos con migraciones, con los datos de stock
    #product_id = Column(Integer, nullable=False)
    #product_name = Column(String(255), nullable=True)
    #unit_price = Column(Float, nullable=True)

    quantity = Column(Integer, nullable=False)

    cart = relationship("Cart", back_populates="items")
    product = relationship("Product")
