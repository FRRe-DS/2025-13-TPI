from typing import Optional
from pydantic import BaseModel
from decimal import Decimal


class ProductBase(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[Decimal] = None
    stock: Optional[int] = None
    category: Optional[str] = None


class ProductCreate(ProductBase):
    name: str
    price: Decimal
    stock: int


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[Decimal] = None
    stock: Optional[int] = None
    category: Optional[str] = None


class Product(ProductBase):
    id: int

    class Config:
        orm_mode = True

