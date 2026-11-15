import datetime
from sqlalchemy import Column, String, Float, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from app.db.base import Base

class FarmerFarmLink(Base):
    __tablename__ = "farmer_farms"

    id = Column(String(64), primary_key=True, index=True)
    farmer_id = Column(String(64), ForeignKey("farmer_profiles.farmer_id", ondelete="CASCADE"), nullable=False, index=True)
    farm_id = Column(String(64), ForeignKey("farms.farm_id", ondelete="CASCADE"), nullable=False, index=True)
    linked_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)

class Farm(Base):
    __tablename__ = "farms"

    farm_id = Column(String(64), primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    area_value = Column(Float, nullable=False)
    area_unit = Column(String(32), nullable=False, default="acres")
    soil_type = Column(String(32), nullable=False, default="loamy")
    irrigation_type = Column(String(32), nullable=False, default="tube_well")
    water_availability = Column(String(32), nullable=False, default="medium")
    field_boundary = Column(JSON, nullable=True)
    field_boundary_source = Column(String(32), nullable=True, default="unknown")
    area_source = Column(String(32), nullable=True, default="unknown")
    is_demo_data = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow, nullable=False)

    crop_history = relationship(
        "CropHistoryEntryModel",
        back_populates="farm",
        cascade="all, delete-orphan",
        order_by="desc(CropHistoryEntryModel.created_at)"
    )

class CropHistoryEntryModel(Base):
    __tablename__ = "crop_history_entries"

    entry_id = Column(String(64), primary_key=True, index=True)
    farm_id = Column(String(64), ForeignKey("farms.farm_id", ondelete="CASCADE"), nullable=False, index=True)
    crop_name = Column(String(128), nullable=False)
    season = Column(String(32), nullable=False)
    start_date = Column(String(10), nullable=True)  # YYYY-MM-DD
    end_date = Column(String(10), nullable=True)    # YYYY-MM-DD
    notes = Column(Text, nullable=True)
    is_demo_data = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)

    farm = relationship("Farm", back_populates="crop_history")

class FarmerProfile(Base):
    __tablename__ = "farmer_profiles"

    farmer_id = Column(String(64), primary_key=True, index=True)
    full_name = Column(String(255), nullable=True)
    phone_number = Column(String(64), nullable=True)
    preferred_language = Column(String(16), nullable=False, default="en")  # en | ur
    literacy_support_mode = Column(String(32), nullable=False, default="text")  # text | voice | assisted
    district = Column(String(64), nullable=False, default="peshawar")  # peshawar | charsadda | mardan | other | unknown
    village_or_settlement = Column(String(255), nullable=True)
    farm_id = Column(String(64), ForeignKey("farms.farm_id", ondelete="SET NULL"), nullable=True, index=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow, nullable=False)

    farm = relationship("Farm", foreign_keys=[farm_id])
