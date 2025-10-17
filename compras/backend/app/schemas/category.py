from pydantic import BaseModel
from typing import Optional

class CategoryBase(BaseModel):
    name: str
    description: Optional[str] = None

class CategoryCreate(CategoryBase):
    pass

class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    # image_url se va a setear al subir el archivo, pero lo dejamos opcional si querés tocarlo a mano
    image_url: Optional[str] = None

class CategoryOut(CategoryBase):
    id: int
    image_url: Optional[str] = None

    class Config:
        from_attributes = True

