import datetime
from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.modules.farm_management.service import FarmService
from app.modules.nasa_data.power_client import NasaPowerClient
from app.modules.nasa_data.schemas import ClimateSummary, ClimateHistory
from app.core.errors import ValidationException

router = APIRouter(tags=["NASA Climate Engine"])

def resolve_coordinates_and_dates(
    db: Session,
    farm_id: Optional[str],
    latitude: Optional[float],
    longitude: Optional[float],
    start_date: Optional[str],
    end_date: Optional[str]
):
    # Resolve coordinates
    if farm_id:
        farm_service = FarmService(db)
        farm = farm_service.get_farm(farm_id)
        resolved_lat = farm.latitude
        resolved_lon = farm.longitude
    elif latitude is not None and longitude is not None:
        if not (-90.0 <= latitude <= 90.0):
            raise ValidationException("Latitude must be between -90 and 90 degrees.", {"latitude": latitude})
        if not (-180.0 <= longitude <= 180.0):
            raise ValidationException("Longitude must be between -180 and 180 degrees.", {"longitude": longitude})
        resolved_lat = latitude
        resolved_lon = longitude
    else:
        raise ValidationException("Either farm_id or both latitude and longitude must be provided.")

    # Resolve dates: default 90-day window ending 7 days before today
    today = datetime.date.today()
    default_end = today - datetime.timedelta(days=7)
    default_start = default_end - datetime.timedelta(days=90)

    resolved_start = start_date or default_start.isoformat()
    resolved_end = end_date or default_end.isoformat()

    try:
        s_date = datetime.date.fromisoformat(resolved_start)
        e_date = datetime.date.fromisoformat(resolved_end)
        if e_date < s_date:
            raise ValidationException("end_date must be on or after start_date.", {"start_date": resolved_start, "end_date": resolved_end})
    except ValueError as e:
        raise ValidationException(f"Invalid ISO date format: {e}")

    return resolved_lat, resolved_lon, resolved_start, resolved_end

@router.get("/api/v1/climate/summary", response_model=ClimateSummary)
def get_climate_summary(
    farm_id: Optional[str] = Query(None, description="Farm identifier"),
    latitude: Optional[float] = Query(None, ge=-90.0, le=90.0),
    longitude: Optional[float] = Query(None, ge=-180.0, le=180.0),
    start_date: Optional[str] = Query(None, pattern=r"^\d{4}-\d{2}-\d{2}$"),
    end_date: Optional[str] = Query(None, pattern=r"^\d{4}-\d{2}-\d{2}$"),
    use_demo_fallback: bool = Query(False, description="Fallback to audited demo data if upstream fails"),
    db: Session = Depends(get_db)
):
    lat, lon, s_date, e_date = resolve_coordinates_and_dates(db, farm_id, latitude, longitude, start_date, end_date)
    client = NasaPowerClient()
    return client.get_climate_summary(lat, lon, s_date, e_date, use_demo_fallback=use_demo_fallback)

@router.get("/api/v1/climate/history", response_model=ClimateHistory)
def get_climate_history(
    farm_id: Optional[str] = Query(None, description="Farm identifier"),
    latitude: Optional[float] = Query(None, ge=-90.0, le=90.0),
    longitude: Optional[float] = Query(None, ge=-180.0, le=180.0),
    start_date: Optional[str] = Query(None, pattern=r"^\d{4}-\d{2}-\d{2}$"),
    end_date: Optional[str] = Query(None, pattern=r"^\d{4}-\d{2}-\d{2}$"),
    use_demo_fallback: bool = Query(False, description="Fallback to audited demo data if upstream fails"),
    db: Session = Depends(get_db)
):
    lat, lon, s_date, e_date = resolve_coordinates_and_dates(db, farm_id, latitude, longitude, start_date, end_date)
    client = NasaPowerClient()
    return client.get_climate_history(lat, lon, s_date, e_date, use_demo_fallback=use_demo_fallback)

@router.get("/api/v1/nasa/power")
def query_nasa_power_direct(
    latitude: float = Query(..., ge=-90.0, le=90.0),
    longitude: float = Query(..., ge=-180.0, le=180.0),
    start_date: Optional[str] = Query(None, pattern=r"^\d{4}-\d{2}-\d{2}$"),
    end_date: Optional[str] = Query(None, pattern=r"^\d{4}-\d{2}-\d{2}$"),
    use_demo_fallback: bool = Query(False),
    db: Session = Depends(get_db)
):
    lat, lon, s_date, e_date = resolve_coordinates_and_dates(db, None, latitude, longitude, start_date, end_date)
    client = NasaPowerClient()
    raw_payload, is_demo = client.fetch_raw_data(lat, lon, s_date, e_date, use_demo_fallback=use_demo_fallback)
    return {
        "latitude": lat,
        "longitude": lon,
        "start_date": s_date,
        "end_date": e_date,
        "is_demo_data": is_demo,
        "data": raw_payload
    }
