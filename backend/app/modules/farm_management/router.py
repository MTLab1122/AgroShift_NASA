from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.modules.farm_management.schemas import (
    FarmCreate,
    FarmUpdate,
    FarmProfile,
    CropHistoryCreate,
    CropHistoryUpdate,
    CropHistoryResponse,
    FarmerProfileCreate,
    FarmerProfileUpdate,
    FarmerProfileResponse,
    LinkFarmRequest,
    mask_phone_number,
)
from app.modules.farm_management.service import FarmService
from app.modules.farm_management.models import FarmerProfile as FarmerProfileModel
from app.modules.farm_management.voice_parser import parse_voice_transcript
from pydantic import BaseModel

class VoiceParseRequest(BaseModel):
    transcript: str

router = APIRouter(prefix="/api/v1/farms", tags=["Farm Management"])
farmer_router = APIRouter(prefix="/api/v1/farmers", tags=["Farmer Profile & Onboarding"])

# --- Farm Endpoints ---

@router.post("", response_model=FarmProfile, status_code=status.HTTP_201_CREATED)
def create_farm(payload: FarmCreate, db: Session = Depends(get_db)):
    service = FarmService(db)
    return service.create_farm(payload)

@router.get("", response_model=List[FarmProfile])
def list_farms(db: Session = Depends(get_db)):
    service = FarmService(db)
    return service.list_farms()

@router.get("/{farm_id}", response_model=FarmProfile)
def get_farm(farm_id: str, db: Session = Depends(get_db)):
    service = FarmService(db)
    return service.get_farm(farm_id)

@router.put("/{farm_id}", response_model=FarmProfile)
def update_farm(farm_id: str, payload: FarmUpdate, db: Session = Depends(get_db)):
    service = FarmService(db)
    return service.update_farm(farm_id, payload)

@router.delete("/{farm_id}", status_code=status.HTTP_200_OK)
def delete_farm(farm_id: str, db: Session = Depends(get_db)):
    service = FarmService(db)
    service.delete_farm(farm_id)
    return {"status": "success", "message": f"Farm {farm_id} deleted safely"}

# --- Crop History Endpoints ---

@router.post("/{farm_id}/crop-history", response_model=CropHistoryResponse, status_code=status.HTTP_201_CREATED)
def create_crop_history(farm_id: str, payload: CropHistoryCreate, db: Session = Depends(get_db)):
    service = FarmService(db)
    return service.create_crop_history(farm_id, payload)

@router.get("/{farm_id}/crop-history", response_model=List[CropHistoryResponse])
def list_crop_history(farm_id: str, db: Session = Depends(get_db)):
    service = FarmService(db)
    return service.list_crop_history(farm_id)

@router.put("/{farm_id}/crop-history/{entry_id}", response_model=CropHistoryResponse)
def update_crop_history(farm_id: str, entry_id: str, payload: CropHistoryUpdate, db: Session = Depends(get_db)):
    service = FarmService(db)
    return service.update_crop_history(farm_id, entry_id, payload)

@router.delete("/{farm_id}/crop-history/{entry_id}", status_code=status.HTTP_200_OK)
def delete_crop_history(farm_id: str, entry_id: str, db: Session = Depends(get_db)):
    service = FarmService(db)
    service.delete_crop_history(farm_id, entry_id)
    return {"status": "success", "message": f"Crop history entry {entry_id} deleted safely"}

# --- Farmer Profile Endpoints ---

def _serialize_farmer(f: FarmerProfileModel) -> FarmerProfileResponse:
    return FarmerProfileResponse(
        farmer_id=f.farmer_id,
        full_name=f.full_name,
        phone_number=mask_phone_number(f.phone_number),
        preferred_language=f.preferred_language,
        literacy_support_mode=f.literacy_support_mode,
        district=f.district,
        village_or_settlement=f.village_or_settlement,
        farm_id=f.farm_id,
        created_at=f.created_at,
        updated_at=f.updated_at,
    )

@farmer_router.post("", response_model=FarmerProfileResponse, status_code=status.HTTP_201_CREATED)
def create_farmer(payload: FarmerProfileCreate, db: Session = Depends(get_db)):
    service = FarmService(db)
    farmer = service.create_farmer(payload)
    return _serialize_farmer(farmer)

@farmer_router.get("", response_model=List[FarmerProfileResponse])
def list_farmers(db: Session = Depends(get_db)):
    service = FarmService(db)
    farmers = service.list_farmers()
    return [_serialize_farmer(f) for f in farmers]

@farmer_router.get("/{farmer_id}", response_model=FarmerProfileResponse)
def get_farmer(farmer_id: str, db: Session = Depends(get_db)):
    service = FarmService(db)
    farmer = service.get_farmer(farmer_id)
    return _serialize_farmer(farmer)

@farmer_router.put("/{farmer_id}", response_model=FarmerProfileResponse)
def update_farmer(farmer_id: str, payload: FarmerProfileUpdate, db: Session = Depends(get_db)):
    service = FarmService(db)
    farmer = service.update_farmer(farmer_id, payload)
    return _serialize_farmer(farmer)

@farmer_router.delete("/{farmer_id}", status_code=status.HTTP_200_OK)
def delete_farmer(farmer_id: str, db: Session = Depends(get_db)):
    service = FarmService(db)
    service.delete_farmer(farmer_id)
    return {"status": "success", "message": f"Farmer profile {farmer_id} deleted safely"}

@farmer_router.post("/parse-voice")
def parse_voice(payload: VoiceParseRequest):
    return parse_voice_transcript(payload.transcript)

@farmer_router.post("/{farmer_id}/farms", response_model=FarmProfile, status_code=status.HTTP_201_CREATED)
def link_farm(farmer_id: str, payload: LinkFarmRequest, db: Session = Depends(get_db)):
    service = FarmService(db)
    farm = service.link_farm_to_farmer(farmer_id, payload.farm_id)
    return farm

@farmer_router.get("/{farmer_id}/farms", response_model=List[FarmProfile])
def list_farmer_farms(farmer_id: str, db: Session = Depends(get_db)):
    service = FarmService(db)
    return service.list_farmer_farms(farmer_id)
