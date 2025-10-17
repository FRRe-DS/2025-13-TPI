from pydantic import BaseModel
from typing import Optional

class CategoryBase(BaseModel):
    name: str
    description: str | None = None


class CategoryCreate(CategoryBase):
    pass


class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None

class CategoryOut(CategoryBase):
    id: int
    image_url: Optional[str] = None

    class Config:
        from_attributes = True  # reemplaza orm_mode=True en Pydantic v2
