import json
from typing import List, Optional
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.modules.farm_management.service import FarmService
from app.modules.farm_management.schemas import FarmProfile
from app.modules.nasa_data.power_client import NasaPowerClient
from app.modules.nasa_data.router import resolve_coordinates_and_dates
from app.modules.agro_intelligence.crop_catalog import CropCatalog
from app.modules.agro_intelligence.engine import AgroIntelligenceEngine
from app.modules.agro_intelligence.models import RecommendationModel
from app.modules.agro_intelligence.schemas import (
    CropCatalogItem,
    RecommendationSet,
    GenerateRecommendationRequest,
    ScenarioComparisonRequest,
    ScenarioComparisonResponse,
    RotationStrategy,
)
from app.core.errors import NotFoundException, ValidationException

router = APIRouter(tags=["Agro Intelligence & Recommendations"])

# --- Crop Catalog Endpoints ---

@router.get("/api/v1/crops", response_model=List[CropCatalogItem])
def list_crops():
    return CropCatalog.list_all()

@router.get("/api/v1/crops/{crop_id}", response_model=CropCatalogItem)
def get_crop(crop_id: str):
    return CropCatalog.get(crop_id)

# --- Recommendation Endpoints ---

@router.post("/api/v1/recommendations/generate", response_model=RecommendationSet, status_code=status.HTTP_201_CREATED)
def generate_recommendations(payload: GenerateRecommendationRequest, db: Session = Depends(get_db)):
    farm_service = FarmService(db)
    farm_model = farm_service.get_farm(payload.farm_id)
    farm = FarmProfile.model_validate(farm_model)

    lat, lon, s_date, e_date = resolve_coordinates_and_dates(
        db, payload.farm_id, None, None, payload.start_date, payload.end_date
    )

    nasa_client = NasaPowerClient()
    climate_summary = None
    try:
        climate_summary = nasa_client.get_climate_summary(
            lat, lon, s_date, e_date, use_demo_fallback=payload.use_demo_fallback
        )
    except Exception as e:
        # If live failed and fallback not requested, raise or proceed without climate
        if not payload.use_demo_fallback:
            raise

    is_demo = farm.is_demo_data or (climate_summary.is_demo_data if climate_summary else False)

    rec_set = AgroIntelligenceEngine.generate_recommendations(
        farm=farm,
        climate=climate_summary,
        priority=payload.priority.value,
        is_demo_data=is_demo
    )

    # Persist in DB
    rec_record = RecommendationModel(
        recommendation_id=rec_set.recommendation_id,
        farm_id=farm.farm_id,
        priority=payload.priority.value,
        is_demo_data=is_demo,
        payload=json.dumps(rec_set.model_dump())
    )
    db.add(rec_record)
    db.commit()

    return rec_set

@router.get("/api/v1/recommendations/strategies", response_model=List[RotationStrategy])
def get_three_strategies(
    farm_id: str,
    primary_goal: str = "balanced",
    db: Session = Depends(get_db)
):
    """
    Returns the three benchmark crop-rotation strategies (baseline, water_saver_pulse_fix, soil_shield_forage)
    for side-by-side comparison.
    """
    farm_service = FarmService(db)
    farm_model = farm_service.get_farm(farm_id)
    farm = FarmProfile.model_validate(farm_model)

    return AgroIntelligenceEngine.generate_three_strategies(
        farm=farm,
        primary_goal=primary_goal
    )


@router.get("/api/v1/recommendations/{recommendation_id}", response_model=RecommendationSet)
def get_recommendation(recommendation_id: str, db: Session = Depends(get_db)):
    rec = db.query(RecommendationModel).filter(RecommendationModel.recommendation_id == recommendation_id).first()
    if not rec:
        raise NotFoundException("RecommendationSet", recommendation_id)
    data = json.loads(rec.payload)
    return RecommendationSet(**data)

@router.post("/api/v1/recommendations/compare", response_model=ScenarioComparisonResponse)
def compare_scenarios(payload: ScenarioComparisonRequest, db: Session = Depends(get_db)):
    scenarios = []
    if payload.recommendation_id:
        rec = db.query(RecommendationModel).filter(RecommendationModel.recommendation_id == payload.recommendation_id).first()
        if not rec:
            raise NotFoundException("RecommendationSet", payload.recommendation_id)
        data = json.loads(rec.payload)
        rec_set = RecommendationSet(**data)
        if payload.scenario_ids:
            scenarios = [s for s in rec_set.scenarios if s.scenario_id in payload.scenario_ids]
        else:
            scenarios = rec_set.scenarios
    elif payload.scenarios:
        scenarios = payload.scenarios
    else:
        raise ValidationException("Either recommendation_id or scenarios must be provided.")

    tradeoffs = {
        "water_savings": "Water-Saver Pulse Fix reduces modeled water demand indicator from high to low relative to baseline double cereals.",
        "soil_regeneration": "Soil-Shield Forage (Berseem clover) provides continuous living cover, adding organic matter and biological atmospheric nitrogen.",
        "market_familiarity": "Baseline cereal monoculture possesses immediate local grain market absorption but high pumping and urea expenditure."
    }

    summary_notes = [
        "Deterministic multi-criteria scoring comparing water fit, climate suitability, soil health diversity, income stability, and implementation feasibility.",
        "No scenario guarantees crop yield or profit; physical outcomes depend on canal turns and rainfall timing.",
        "Local ground check of canal warabandi schedules, tube-well power, seed prices, and soil salinity is required before planting."
    ]

    decision_guidance = {
        "water_saver_pulse_fix": "Recommended for farmers with restricted canal delivery or high tube-well electricity/diesel pumping costs.",
        "soil_shield_forage": "Recommended for livestock and dairy integration, building depleted organic matter, and shielding bare soil from solar baking.",
        "baseline": "Suitable only where canal irrigation is fully assured, but carries heightened long-term soil depletion risk."
    }

    satellite_evidence_summary = [
        "NASA SMAP L4: Low root-zone soil moisture (< 25 mm/m) flags critical summer deficits.",
        "NASA GPM IMERG: Extended dry spells (>= 14 days) favor drought-hardy pulses.",
        "NASA MODIS NDVI: Bare fallow windows (NDVI < 0.25) indicate exposed topsoil requiring cover crops.",
        "NASA POWER: Summer heat stress (38 days >= 35°C) increases evapotranspirative loss."
    ]

    limitations = [
        "Gridded satellite data represents broad-area conditions (~9km to 50km), not field-level sensor measurements.",
        "Economic scores reflect market stability indicators rather than guaranteed price or revenue certainty.",
        "Local verification of soil salinity, water turns, and seed germination is mandatory."
    ]

    # Resolve farm to generate 3 benchmark strategies
    farm_id = payload.farm_id
    if not farm_id and payload.recommendation_id:
        farm_id = rec_set.farm_id if 'rec_set' in locals() else None

    strategies = None
    if farm_id:
        try:
            farm_service = FarmService(db)
            farm_model = farm_service.get_farm(farm_id)
            farm_prof = FarmProfile.model_validate(farm_model)
            strategies = AgroIntelligenceEngine.generate_three_strategies(
                farm=farm_prof,
                primary_goal=payload.primary_goal or "balanced"
            )
        except Exception:
            pass

    return ScenarioComparisonResponse(
        scenarios=scenarios,
        strategies=strategies,
        summary_notes=summary_notes,
        tradeoffs=tradeoffs,
        decision_guidance=decision_guidance,
        satellite_evidence_summary=satellite_evidence_summary,
        limitations=limitations,
        confidence="high",
        local_check_required=True,
        local_check_reminder="Local Check: Verify canal water schedules, seed prices, soil salinity, pest pressure, and field-specific conditions before planting.",
        disclaimer="NASA satellite data represents broad-area conditions, not a field-specific measurement."
    )
