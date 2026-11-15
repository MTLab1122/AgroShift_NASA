from datetime import datetime
from enum import Enum
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field, ConfigDict

class PriorityEnum(str, Enum):
    balanced = "balanced"
    water_efficiency = "water_efficiency"
    crop_diversity = "crop_diversity"
    soil_cover = "soil_cover"

class CropCatalogItem(BaseModel):
    crop_id: str
    name: str
    category: str
    is_legume: bool
    seasons: List[str]
    duration_days: int
    water_demand: str
    suitable_soils: List[str]
    incompatible_predecessors: List[str]
    evidence_note: str
    evidence_status: str

    model_config = ConfigDict(from_attributes=True)

class ScoreWeights(BaseModel):
    water_fit: float
    climate_suitability: float
    soil_health_diversity: float

    model_config = ConfigDict(from_attributes=True)

class ScoreBreakdown(BaseModel):
    water_fit: Optional[float] = None
    climate_suitability: Optional[float] = None
    soil_health_diversity: Optional[float] = None
    weights: ScoreWeights

    model_config = ConfigDict(from_attributes=True)

class CalendarEntry(BaseModel):
    season: str
    crop: str
    window: str
    water_notes: str

    model_config = ConfigDict(from_attributes=True)

class SoilHealthBreakdown(BaseModel):
    legume_included: bool = False
    cover_forage_included: bool = False
    crop_family_diversity: int = 2
    bare_field_reduction_days: int = 0

    model_config = ConfigDict(from_attributes=True)

class StrategyScoring(BaseModel):
    water_fit: float
    climate_suitability: float
    soil_health_diversity: float
    income_stability: float
    implementation_feasibility: float
    overall_score: float
    soil_health_breakdown: Optional[SoilHealthBreakdown] = None

    model_config = ConfigDict(from_attributes=True)

class RotationSeason(BaseModel):
    season_name: str
    season_code: str  # rabi | kharif | zaid
    crop_id: str
    crop_name: str
    duration_days: int
    water_demand: str  # low | medium | high
    soil_benefit: str

    model_config = ConfigDict(from_attributes=True)

class RotationStrategy(BaseModel):
    strategy_id: str  # baseline | water_saver_pulse_fix | soil_shield_forage
    name: str
    summary: str
    rotation_sequence: List[RotationSeason]
    scoring: StrategyScoring
    relative_water_demand_indicator: str  # low | medium | high
    relative_water_saving_note: str = "Potential reduction in modeled water-demand indicator relative to baseline"
    satellite_evidence: List[str] = Field(..., min_length=2)
    risks: List[str] = Field(..., min_length=1)
    benefits: List[str] = Field(..., min_length=1)
    confidence: str = "high"  # high | medium | low | not_enough_information
    local_check_required: bool = True
    local_check_reminder: str = "Local Check: Verify canal water schedules, seed prices, soil salinity, pest pressure, and field-specific conditions before planting."
    disclaimer: str = "NASA satellite data represents broad-area conditions, not a field-specific measurement."

    model_config = ConfigDict(from_attributes=True)

class Scenario(BaseModel):
    scenario_id: str  # baseline | pulse_inclusive | soil_cover
    title: str
    description: str
    score: Optional[float] = None
    score_breakdown: ScoreBreakdown
    crop_sequence: List[str] = Field(..., min_length=1)
    seasonal_calendar: List[CalendarEntry] = Field(..., min_length=1)
    rationale: List[str] = Field(..., min_length=1)
    benefits: List[str] = Field(..., min_length=1)
    risks: List[str] = Field(..., min_length=1)
    assumptions: List[str] = Field(..., min_length=1)
    evidence_status: str = "documented"

    model_config = ConfigDict(from_attributes=True)

class RecommendationSet(BaseModel):
    recommendation_id: str
    farm_id: str
    generated_at: str
    priority: str
    is_demo_data: bool
    scenarios: List[Scenario] = Field(..., min_length=3, max_length=3)
    climate_context: Optional[Dict[str, Any]] = None
    limitations: List[str] = []
    general_assumptions: List[str] = []

    model_config = ConfigDict(from_attributes=True)

class GenerateRecommendationRequest(BaseModel):
    farm_id: str
    start_date: Optional[str] = Field(None, pattern=r"^\d{4}-\d{2}-\d{2}$")
    end_date: Optional[str] = Field(None, pattern=r"^\d{4}-\d{2}-\d{2}$")
    priority: PriorityEnum = PriorityEnum.balanced
    use_demo_fallback: bool = False

class ScenarioComparisonRequest(BaseModel):
    recommendation_id: Optional[str] = None
    farm_id: Optional[str] = None
    primary_goal: Optional[str] = "balanced"
    scenarios: Optional[List[Scenario]] = None
    scenario_ids: Optional[List[str]] = None

class ScenarioComparisonResponse(BaseModel):
    scenarios: List[Scenario]
    strategies: Optional[List[RotationStrategy]] = None
    summary_notes: List[str]
    tradeoffs: Dict[str, str]
    decision_guidance: Optional[Dict[str, str]] = None
    satellite_evidence_summary: Optional[List[str]] = None
    limitations: Optional[List[str]] = None
    confidence: str = "high"
    local_check_required: bool = True
    local_check_reminder: str = "Local Check: Verify canal water schedules, seed prices, soil salinity, pest pressure, and field-specific conditions before planting."
    disclaimer: str = "NASA satellite data represents broad-area conditions, not a field-specific measurement."

    model_config = ConfigDict(from_attributes=True)
