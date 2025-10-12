from typing import Optional
from pydantic import BaseModel


class OrderBase(BaseModel):
    date: Optional[str] = None
    total: Optional[int] = None
    status: Optional[str] = None


class OrderCreate(OrderBase):
    userId: int


class OrderUpdate(BaseModel):
    date: Optional[str] = None
    total: Optional[int] = None
    status: Optional[str] = None


class Order(OrderBase):
    id: int
    userId: Optional[int] = None

    class Config:
        orm_mode = True

