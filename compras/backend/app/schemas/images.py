from pydantic import BaseModel
from typing import Optional


class ProductImageOut(BaseModel):
    id: int
    url: str
    alt_text: Optional[str] = None
    sort_order: int
    is_primary: bool
    class Config:
        from_attributes = True