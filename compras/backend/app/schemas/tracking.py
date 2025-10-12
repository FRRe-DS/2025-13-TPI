from typing import Optional
from pydantic import BaseModel
from datetime import datetime


class TrackingBase(BaseModel):
    status: Optional[str] = None
    location: Optional[str] = None
    creationDate: Optional[datetime] = None


class TrackingCreate(TrackingBase):
    order_id: int


class TrackingUpdate(BaseModel):
    status: Optional[str] = None
    location: Optional[str] = None
    creationDate: Optional[datetime] = None


class Tracking(TrackingBase):
    id: int
    order_id: int

    class Config:
        orm_mode = True

