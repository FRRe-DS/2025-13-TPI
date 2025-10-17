from sqlalchemy import Column, Integer, String
from app.db import Base

class Category(Base):
    __tablename__ = "category"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, unique=True)
    description = Column(String(255))
    image_url = Column(String(512), nullable=True)
