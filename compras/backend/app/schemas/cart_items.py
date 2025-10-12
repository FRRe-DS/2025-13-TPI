from typing import Optional
from pydantic import BaseModel
from decimal import Decimal


class CartItemBase(BaseModel):
    product_id: Optional[int] = None
    quantity: Optional[int] = None
    price: Optional[Decimal] = None


class CartItemCreate(CartItemBase):
    cart_id: int
    product_id: int
    quantity: int
    price: Decimal


class CartItemUpdate(BaseModel):
    quantity: Optional[int] = None
    price: Optional[Decimal] = None


class CartItem(CartItemBase):
    id: int
    cart_id: int

    class Config:
        orm_mode = True

