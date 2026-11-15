from datetime import datetime
from enum import Enum
from typing import List, Optional, Literal
from pydantic import BaseModel, Field, ConfigDict, model_validator

class AreaUnitEnum(str, Enum):
    acres = "acres"
    hectares = "hectares"

class SoilTypeEnum(str, Enum):
    clay = "clay"
    sandy = "sandy"
    loamy = "loamy"
    other = "other"
    unknown = "unknown"

class IrrigationTypeEnum(str, Enum):
    canal = "canal"
    tube_well = "tube_well"
    rain_fed = "rain_fed"
    other = "other"
    unknown = "unknown"

class WaterAvailabilityEnum(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"
    unknown = "unknown"

class SeasonEnum(str, Enum):
    rabi = "rabi"
    kharif = "kharif"
    zaid = "zaid"
    annual = "annual"
    unknown = "unknown"

class PreferredLanguageEnum(str, Enum):
    en = "en"
    ur = "ur"

class LiteracySupportModeEnum(str, Enum):
    text = "text"
    voice = "voice"
    assisted = "assisted"

class DistrictEnum(str, Enum):
    peshawar = "peshawar"
    charsadda = "charsadda"
    mardan = "mardan"
    other = "other"
    unknown = "unknown"

class PrimaryGoalEnum(str, Enum):
    water_efficiency = "water_efficiency"
    soil_health = "soil_health"
    cash_yield = "cash_yield"
    balanced = "balanced"
    unknown = "unknown"

# --- Crop History Schemas ---

class CropHistoryCreate(BaseModel):
    crop_name: str = Field(..., min_length=1, max_length=128)
    season: SeasonEnum
    start_date: Optional[str] = Field(None, pattern=r"^\d{4}-\d{2}-\d{2}$")
    end_date: Optional[str] = Field(None, pattern=r"^\d{4}-\d{2}-\d{2}$")
    notes: Optional[str] = Field(None, max_length=1000)

    @model_validator(mode="after")
    def validate_dates(self):
        if self.start_date and self.end_date:
            if self.end_date < self.start_date:
                raise ValueError("end_date must be on or after start_date")
        return self

class CropHistoryUpdate(BaseModel):
    crop_name: Optional[str] = Field(None, min_length=1, max_length=128)
    season: Optional[SeasonEnum] = None
    start_date: Optional[str] = Field(None, pattern=r"^\d{4}-\d{2}-\d{2}$")
    end_date: Optional[str] = Field(None, pattern=r"^\d{4}-\d{2}-\d{2}$")
    notes: Optional[str] = Field(None, max_length=1000)

    @model_validator(mode="after")
    def validate_dates(self):
        if self.start_date and self.end_date:
            if self.end_date < self.start_date:
                raise ValueError("end_date must be on or after start_date")
        return self

class CropHistoryResponse(BaseModel):
    entry_id: str
    farm_id: str
    crop_name: str
    season: str
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    notes: Optional[str] = None
    is_demo_data: bool = False
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

# --- Farm Schemas ---

class FieldBoundary(BaseModel):
    type: Literal["Polygon"]
    coordinates: List[List[List[float]]]

    @model_validator(mode="after")
    def validate_polygon_geometry(self):
        if not self.coordinates or len(self.coordinates) == 0:
            raise ValueError("Polygon must have at least one linear ring")
        outer_ring = self.coordinates[0]
        if len(outer_ring) < 4:
            raise ValueError("Polygon outer ring must contain at least 4 coordinates including closure")
        if outer_ring[0] != outer_ring[-1]:
            raise ValueError("Polygon outer ring must be closed (first and last coordinates must match)")
        for pt in outer_ring:
            if len(pt) < 2:
                raise ValueError("Coordinate pair must contain [longitude, latitude]")
            lon, lat = pt[0], pt[1]
            if not (-180.0 <= lon <= 180.0):
                raise ValueError(f"Longitude {lon} out of bounds [-180, 180]")
            if not (-90.0 <= lat <= 90.0):
                raise ValueError(f"Latitude {lat} out of bounds [-90, 90]")

        # Check self-intersection for outer ring (excluding closure point)
        def ccw(A, B, C):
            return (C[1]-A[1]) * (B[0]-A[0]) > (B[1]-A[1]) * (C[0]-A[0])
        def intersect(A, B, C, D):
            return ccw(A,C,D) != ccw(B,C,D) and ccw(A,B,C) != ccw(A,B,D)

        n = len(outer_ring) - 1
        for i in range(n):
            p1 = outer_ring[i]
            p2 = outer_ring[i+1]
            for j in range(i + 2, n):
                if i == 0 and j == n - 1:
                    continue  # Adjacent at wrap-around
                p3 = outer_ring[j]
                p4 = outer_ring[j+1]
                if intersect(p1, p2, p3, p4):
                    raise ValueError("Polygon boundary must not self-intersect")

        return self

class FarmCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    latitude: float = Field(..., ge=-90.0, le=90.0)
    longitude: float = Field(..., ge=-180.0, le=180.0)
    area_value: float = Field(..., gt=0.0)
    area_unit: AreaUnitEnum = AreaUnitEnum.acres
    soil_type: SoilTypeEnum = SoilTypeEnum.loamy
    irrigation_type: IrrigationTypeEnum = IrrigationTypeEnum.tube_well
    water_availability: WaterAvailabilityEnum = WaterAvailabilityEnum.medium
    field_boundary: Optional[FieldBoundary] = None
    field_boundary_source: Optional[Literal["map_drawn", "manual_entry", "unknown"]] = "unknown"
    area_source: Optional[Literal["map_calculated", "manual_entry", "unknown"]] = "unknown"

    @model_validator(mode="after")
    def validate_boundary_and_area_sources(self):
        if self.area_source == "map_calculated" and self.field_boundary is None:
            raise ValueError("Cannot set area_source to 'map_calculated' without a valid field_boundary")
        if self.field_boundary is None:
            if self.field_boundary_source not in ("unknown", "manual_entry", None):
                raise ValueError("field_boundary_source must be 'unknown' or 'manual_entry' when field_boundary is null")
            if self.area_source not in ("manual_entry", "unknown", None):
                raise ValueError("area_source must be 'manual_entry' or 'unknown' when field_boundary is null")
        return self

class FarmUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    latitude: Optional[float] = Field(None, ge=-90.0, le=90.0)
    longitude: Optional[float] = Field(None, ge=-180.0, le=180.0)
    area_value: Optional[float] = Field(None, gt=0.0)
    area_unit: Optional[AreaUnitEnum] = None
    soil_type: Optional[SoilTypeEnum] = None
    irrigation_type: Optional[IrrigationTypeEnum] = None
    water_availability: Optional[WaterAvailabilityEnum] = None
    field_boundary: Optional[FieldBoundary] = None
    field_boundary_source: Optional[Literal["map_drawn", "manual_entry", "unknown"]] = None
    area_source: Optional[Literal["map_calculated", "manual_entry", "unknown"]] = None

    @model_validator(mode="after")
    def validate_boundary_and_area_sources(self):
        if self.area_source == "map_calculated" and self.field_boundary is None:
            raise ValueError("Cannot set area_source to 'map_calculated' without a valid field_boundary")
        return self

class FarmProfile(BaseModel):
    farm_id: str
    name: str
    latitude: float
    longitude: float
    area_value: float
    area_unit: str
    soil_type: str
    irrigation_type: str
    water_availability: str
    field_boundary: Optional[FieldBoundary] = None
    field_boundary_source: Optional[str] = "unknown"
    area_source: Optional[str] = "unknown"
    is_demo_data: bool = False
    crop_history: List[CropHistoryResponse] = []
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

# --- Farmer Profile Schemas ---

def mask_phone_number(phone: Optional[str]) -> Optional[str]:
    """Masks phone number to protect personally identifiable information."""
    if not phone:
        return None
    cleaned = phone.strip()
    if len(cleaned) <= 4:
        return "***"
    return f"***-***-{cleaned[-4:]}"

class FarmerProfileCreate(BaseModel):
    full_name: Optional[str] = None
    phone_number: Optional[str] = None
    preferred_language: PreferredLanguageEnum = PreferredLanguageEnum.en
    literacy_support_mode: LiteracySupportModeEnum = LiteracySupportModeEnum.text
    district: DistrictEnum = DistrictEnum.peshawar
    village_or_settlement: Optional[str] = None
    farm_id: Optional[str] = None

class FarmerProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    phone_number: Optional[str] = None
    preferred_language: Optional[PreferredLanguageEnum] = None
    literacy_support_mode: Optional[LiteracySupportModeEnum] = None
    district: Optional[DistrictEnum] = None
    village_or_settlement: Optional[str] = None
    farm_id: Optional[str] = None

class FarmerProfileResponse(BaseModel):
    farmer_id: str
    full_name: Optional[str] = None
    phone_number: Optional[str] = None
    preferred_language: str = "en"
    literacy_support_mode: str = "text"
    district: str = "peshawar"
    village_or_settlement: Optional[str] = None
    farm_id: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class LinkFarmRequest(BaseModel):
    farm_id: str
