from typing import Optional, Annotated
from decimal import Decimal
from pydantic import BaseModel, Field, field_validator
from app.schemas.images import ProductImageOut


# Definimos un alias de tipo para reusar:
Price = Annotated[Decimal, Field(max_digits=10, decimal_places=2)]
class ProductBase(BaseModel):
    name: str
    description: str | None = None
    price: Price
    sku: str | None = None
    stock: Optional[int] = None
    category: Optional[str] = None

    @field_validator("name")
    @classmethod
    def name_not_empty(cls, v):
        if not v or not v.strip():
            raise ValueError("Name no puede estar vacío")
        return v.strip()

class ProductCreate(ProductBase):
    pass
    

class ProductUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    price: Price | None = None
    sku: str | None = None
    stock: Optional[int] = None
    category: Optional[str] = None


class ProductOut(ProductBase):
    id: int
    name: str
    description: Optional[str] = None
    price: Price
    sku: Optional[str] = None
    stock: Optional[int] = None
    category: Optional[str] = None
    main_image_url: Optional[str] = None
    images: list[ProductImageOut] = []
    class Config:
        from_attributes = True

