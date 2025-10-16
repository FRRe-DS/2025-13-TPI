from pydantic import BaseModel, conint, condecimal
from typing import List
from datetime import datetime
from enum import Enum


class OrderStatus(str, Enum):
    PENDING = "PENDING"
    SHIPPED = "SHIPPED"
    DELIVERED = "DELIVERED"
    CANCELED = "CANCELED"

class OrderItemBase(BaseModel):
    id: int
    product_id: int
    product_name: str
    unit_price: condecimal(max_digits=10, decimal_places=2)
    quantity: conint(ge=1)

    class Config:
        from_attributes = True


class OrderItemOut(BaseModel):
    id: int
    product_id: int
    product_name: str
    unit_price: condecimal(max_digits=10, decimal_places=2)
    quantity: conint(ge=1)

    class Config:
        from_attributes = True


class OrderOut(BaseModel):
    id: int
    status: OrderStatus
    total_amount: condecimal(max_digits=10, decimal_places=2)
    created_at: datetime
    updated_at: datetime
    items: List[OrderItemOut]

    class Config:
        from_attributes = True


class OrderListItem(BaseModel):
    id: int
    status: OrderStatus
    total_amount: condecimal(max_digits=10, decimal_places=2)
    created_at: datetime
    class Config:
        from_attributes = True