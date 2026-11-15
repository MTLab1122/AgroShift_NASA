"""
Router for Multi-NASA Earth-Observation and 10-Year Historical Trend Analysis endpoints.
"""

from typing import Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.modules.farm_management.service import FarmService
from app.modules.earth_observation.schemas import FarmEarthObservation, HistoricalTrendResponse
from app.modules.earth_observation.service import EarthObservationService

router = APIRouter(prefix="/api/v1/earth-observation", tags=["Multi-NASA Earth Observation"])


@router.get("", response_model=FarmEarthObservation)
def get_earth_observation_data(
    farm_id: str = Query(..., description="Target farm UUID"),
    start_date: str = Query("2024-05-01", description="Observation start date (YYYY-MM-DD)"),
    end_date: str = Query("2024-07-31", description="Observation end date (YYYY-MM-DD)"),
    use_demo_fallback: bool = Query(True, description="Enable fallback fixtures when external API limits or errors occur"),
    db: Session = Depends(get_db)
):
    """
    Returns unified multi-NASA satellite intelligence across SMAP L4 soil moisture,
    GPM IMERG precipitation, MODIS/VIIRS NDVI canopy greenness, and NASA POWER heat-stress analytics.
    """
    farm_service = FarmService(db)
    farm = farm_service.get_farm(farm_id)

    eo_service = EarthObservationService()
    return eo_service.get_earth_observation(
        farm_id=farm.farm_id,
        latitude=farm.latitude,
        longitude=farm.longitude,
        start_date=start_date,
        end_date=end_date,
        use_demo_fallback=use_demo_fallback
    )


@router.get("/trends", response_model=HistoricalTrendResponse)
def get_historical_trends(
    farm_id: str = Query(..., description="Target farm UUID"),
    years: int = Query(10, ge=1, le=30, description="Number of historical baseline years to evaluate"),
    use_demo_fallback: bool = Query(True, description="Enable fallback fixtures when external API limits or errors occur"),
    db: Session = Depends(get_db)
):
    """
    Evaluates 10-year decadal trends vs current season.
    Enforces the >= 5 valid years rule: returns trend_status='insufficient_history' if fewer than 5 years exist.
    """
    farm_service = FarmService(db)
    farm = farm_service.get_farm(farm_id)

    eo_service = EarthObservationService()
    return eo_service.get_historical_trends(
        farm_id=farm.farm_id,
        latitude=farm.latitude,
        longitude=farm.longitude,
        years=years,
        use_demo_fallback=use_demo_fallback
    )
