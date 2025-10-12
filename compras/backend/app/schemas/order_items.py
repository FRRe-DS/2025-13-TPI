from typing import Optional
from pydantic import BaseModel
from decimal import Decimal


class OrderItemBase(BaseModel):
    product_id: Optional[int] = None
    quantity: Optional[int] = None
    price: Optional[Decimal] = None


class OrderItemCreate(OrderItemBase):
    order_id: int
    product_id: int
    quantity: int
    price: Decimal


class OrderItemUpdate(BaseModel):
    quantity: Optional[int] = None
    price: Optional[Decimal] = None


class OrderItem(OrderItemBase):
    id: int
    order_id: int

    class Config:
        orm_mode = True

