import uuid
from typing import List, Optional
from sqlalchemy.orm import Session
from app.modules.farm_management.models import Farm, CropHistoryEntryModel, FarmerProfile, FarmerFarmLink
from app.modules.farm_management.schemas import (
    FarmCreate,
    FarmUpdate,
    CropHistoryCreate,
    CropHistoryUpdate,
    FarmerProfileCreate,
    FarmerProfileUpdate,
)
from app.core.errors import NotFoundException

class FarmService:
    def __init__(self, db: Session):
        self.db = db

    def list_farms(self) -> List[Farm]:
        return self.db.query(Farm).order_by(Farm.created_at.desc()).all()

    def get_farm(self, farm_id: str) -> Farm:
        farm = self.db.query(Farm).filter(Farm.farm_id == farm_id).first()
        if not farm:
            raise NotFoundException("Farm", farm_id)
        return farm

    def create_farm(self, data: FarmCreate, farm_id: Optional[str] = None, is_demo_data: bool = False) -> Farm:
        new_id = farm_id or f"farm-{uuid.uuid4().hex[:12]}"
        boundary_dict = data.field_boundary.model_dump() if data.field_boundary else None
        farm = Farm(
            farm_id=new_id,
            name=data.name,
            latitude=data.latitude,
            longitude=data.longitude,
            area_value=data.area_value,
            area_unit=data.area_unit.value,
            soil_type=data.soil_type.value,
            irrigation_type=data.irrigation_type.value,
            water_availability=data.water_availability.value,
            field_boundary=boundary_dict,
            field_boundary_source=data.field_boundary_source or "unknown",
            area_source=data.area_source or "unknown",
            is_demo_data=is_demo_data,
        )
        self.db.add(farm)
        self.db.commit()
        self.db.refresh(farm)
        return farm

    def update_farm(self, farm_id: str, data: FarmUpdate) -> Farm:
        farm = self.get_farm(farm_id)
        update_data = data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            if hasattr(value, "value"):
                setattr(farm, key, value.value)
            elif key == "field_boundary":
                boundary_dict = value if isinstance(value, dict) else (value.model_dump() if hasattr(value, "model_dump") else value)
                setattr(farm, key, boundary_dict)
            else:
                setattr(farm, key, value)
        self.db.commit()
        self.db.refresh(farm)
        return farm

    def delete_farm(self, farm_id: str) -> bool:
        farm = self.get_farm(farm_id)
        self.db.delete(farm)
        self.db.commit()
        return True

    # --- Crop History ---

    def list_crop_history(self, farm_id: str) -> List[CropHistoryEntryModel]:
        self.get_farm(farm_id)  # verify existence
        return (
            self.db.query(CropHistoryEntryModel)
            .filter(CropHistoryEntryModel.farm_id == farm_id)
            .order_by(CropHistoryEntryModel.created_at.desc())
            .all()
        )

    def create_crop_history(self, farm_id: str, data: CropHistoryCreate) -> CropHistoryEntryModel:
        self.get_farm(farm_id)  # verify existence
        entry = CropHistoryEntryModel(
            entry_id=f"hist-{uuid.uuid4().hex[:12]}",
            farm_id=farm_id,
            crop_name=data.crop_name,
            season=data.season.value,
            start_date=data.start_date,
            end_date=data.end_date,
            notes=data.notes,
            is_demo_data=False,
        )
        self.db.add(entry)
        self.db.commit()
        self.db.refresh(entry)
        return entry

    def update_crop_history(self, farm_id: str, entry_id: str, data: CropHistoryUpdate) -> CropHistoryEntryModel:
        self.get_farm(farm_id)  # verify existence
        entry = (
            self.db.query(CropHistoryEntryModel)
            .filter(CropHistoryEntryModel.farm_id == farm_id, CropHistoryEntryModel.entry_id == entry_id)
            .first()
        )
        if not entry:
            raise NotFoundException("CropHistoryEntry", entry_id)

        update_data = data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            if value is not None:
                if hasattr(value, "value"):
                    setattr(entry, key, value.value)
                else:
                    setattr(entry, key, value)

        self.db.commit()
        self.db.refresh(entry)
        return entry

    def delete_crop_history(self, farm_id: str, entry_id: str) -> bool:
        self.get_farm(farm_id)  # verify existence
        entry = (
            self.db.query(CropHistoryEntryModel)
            .filter(CropHistoryEntryModel.farm_id == farm_id, CropHistoryEntryModel.entry_id == entry_id)
            .first()
        )
        if not entry:
            raise NotFoundException("CropHistoryEntry", entry_id)

        self.db.delete(entry)
        self.db.commit()
        return True

    # --- Farmer Profiles ---

    def list_farmers(self) -> List[FarmerProfile]:
        return self.db.query(FarmerProfile).order_by(FarmerProfile.created_at.desc()).all()

    def get_farmer(self, farmer_id: str) -> FarmerProfile:
        farmer = self.db.query(FarmerProfile).filter(FarmerProfile.farmer_id == farmer_id).first()
        if not farmer:
            raise NotFoundException("FarmerProfile", farmer_id)
        return farmer

    def create_farmer(self, data: FarmerProfileCreate) -> FarmerProfile:
        new_id = f"farmer-{uuid.uuid4().hex[:12]}"
        
        # Verify farm exists if provided
        if data.farm_id:
            self.get_farm(data.farm_id)

        farmer = FarmerProfile(
            farmer_id=new_id,
            full_name=data.full_name,
            phone_number=data.phone_number,
            preferred_language=data.preferred_language.value,
            literacy_support_mode=data.literacy_support_mode.value,
            district=data.district.value,
            village_or_settlement=data.village_or_settlement,
            farm_id=data.farm_id,
        )
        self.db.add(farmer)
        self.db.commit()
        self.db.refresh(farmer)

        # Link farm in farmer_farms table if provided
        if data.farm_id:
            link = FarmerFarmLink(
                id=f"ff-{uuid.uuid4().hex[:12]}",
                farmer_id=farmer.farmer_id,
                farm_id=data.farm_id,
            )
            self.db.add(link)
            self.db.commit()

        return farmer

    def update_farmer(self, farmer_id: str, data: FarmerProfileUpdate) -> FarmerProfile:
        farmer = self.get_farmer(farmer_id)
        update_data = data.model_dump(exclude_unset=True)
        if "farm_id" in update_data and update_data["farm_id"]:
            self.get_farm(update_data["farm_id"])

        for key, value in update_data.items():
            if value is not None:
                if hasattr(value, "value"):
                    setattr(farmer, key, value.value)
                else:
                    setattr(farmer, key, value)
        self.db.commit()
        self.db.refresh(farmer)
        return farmer

    def delete_farmer(self, farmer_id: str) -> bool:
        farmer = self.get_farmer(farmer_id)
        self.db.delete(farmer)
        self.db.commit()
        return True

    def link_farm_to_farmer(self, farmer_id: str, farm_id: str) -> Farm:
        farmer = self.get_farmer(farmer_id)
        farm = self.get_farm(farm_id)

        # Update primary farm_id if not set
        if not farmer.farm_id:
            farmer.farm_id = farm_id
            self.db.commit()

        # Check existing link
        existing = (
            self.db.query(FarmerFarmLink)
            .filter(FarmerFarmLink.farmer_id == farmer_id, FarmerFarmLink.farm_id == farm_id)
            .first()
        )
        if not existing:
            link = FarmerFarmLink(
                id=f"ff-{uuid.uuid4().hex[:12]}",
                farmer_id=farmer_id,
                farm_id=farm_id,
            )
            self.db.add(link)
            self.db.commit()

        return farm

    def list_farmer_farms(self, farmer_id: str) -> List[Farm]:
        self.get_farmer(farmer_id)
        links = self.db.query(FarmerFarmLink).filter(FarmerFarmLink.farmer_id == farmer_id).all()
        farm_ids = [l.farm_id for l in links]
        if not farm_ids:
            return []
        return self.db.query(Farm).filter(Farm.farm_id.in_(farm_ids)).all()
