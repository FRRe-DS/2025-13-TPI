from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from ..db import Base

class User_Profile(Base):
    __tablename__ = 'userProfiles'
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    email = Column(String, unique=True, index=True)
    phone = Column(Integer, unique=True)
    dni = Column(Integer, unique=True)
    birthdate = Column(DateTime)
    address = Column(String)
    created_at = Column(DateTime)
    updated_at = Column(DateTime)

    # relación desde el lado "hijo"
    user = relationship("User", back_populates="userProfile")

    