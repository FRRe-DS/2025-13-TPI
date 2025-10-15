from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from ..db import Base

class tracking(Base):
    __tablename__ = 'tracking'
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id", ondelete="CASCADE"), nullable=False)
    status = Column(String)
    location = Column(String)
    creationDate = Column(DateTime)

    # relación desde el lado "hijo"
    order = relationship("Order", back_populates="tracking")