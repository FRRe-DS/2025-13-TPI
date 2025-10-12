from typing import Optional
from pydantic import BaseModel


class CartBase(BaseModel):
    total: Optional[int] = None


class CartCreate(CartBase):
    userId: int


class CartUpdate(BaseModel):
    total: Optional[int] = None


class Cart(CartBase):
    id: int
    userId: Optional[int] = None

    class Config:
        orm_mode = True

