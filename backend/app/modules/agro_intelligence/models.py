import datetime
from sqlalchemy import Column, String, Boolean, DateTime, Text
from app.db.base import Base

class RecommendationModel(Base):
    __tablename__ = "recommendations"

    recommendation_id = Column(String(64), primary_key=True, index=True)
    farm_id = Column(String(64), nullable=False, index=True)
    priority = Column(String(32), nullable=False, default="balanced")
    is_demo_data = Column(Boolean, nullable=False, default=False)
    payload = Column(Text, nullable=False)  # JSON serialized recommendation set
    generated_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)
