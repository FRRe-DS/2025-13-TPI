from sqlalchemy import Column, Integer, ForeignKey, String, DateTime, Numeric, Enum, text
from sqlalchemy.orm import relationship
import enum
from app.db import Base

class OrderStatus(enum.Enum):
    PENDING = "PENDING"
    SHIPPED = "SHIPPED"
    DELIVERED = "DELIVERED"
    CANCELED = "CANCELED"

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True, nullable=False)
    status = Column(Enum(OrderStatus), default=OrderStatus.PENDING, nullable=False)
    total_amount = Column(Numeric(10, 2), nullable=False, default=0.00)
    created_at = Column(DateTime(timezone=True), server_default=text("CURRENT_TIMESTAMP"))
    updated_at = Column(DateTime(timezone=True),
                    server_default=text("CURRENT_TIMESTAMP"),
                    onupdate=text("CURRENT_TIMESTAMP"))
    
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")


class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id", ondelete="CASCADE"), index=True, nullable=False)
    
    #product_id = Column(Integer, nullable=False)
    #product_name = Column(String(255), nullable=True)
    #unit_price = Column(Float, nullable=True)

    product_name = Column(String, nullable=False)
    quantity = Column(Integer, nullable=False, default=1)
    unit_price = Column(Numeric(10, 2), nullable=False)
    
    order = relationship("Order", back_populates="items")
    #product = relationship("Product")
 