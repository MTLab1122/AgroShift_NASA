from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field, ConfigDict

class GridCentroid(BaseModel):
    latitude: float
    longitude: float

class SoilMoistureIntelligence(BaseModel):
    source: str = "NASA SMAP L4 / Crop-CASMA"
    spatial_resolution: str = "9 km (0.09° grid)"
    grid_centroid: Optional[GridCentroid] = None
    recent_root_zone_moisture: Optional[float] = None  # mm/m
    historical_mean: Optional[float] = None
    moisture_anomaly: Optional[float] = None
    unit: str = "mm/m"
    dry_root_zone_flag: bool = False
    interpretation: str
    data_coverage_percentage: float = 100.0

    model_config = ConfigDict(from_attributes=True)

class PrecipitationIntelligence(BaseModel):
    source: str = "NASA GPM IMERG"
    product_run: str = "Final Run (Calibrated)"
    spatial_resolution: str = "0.1° × 0.1° (~10 km grid)"
    seasonal_rainfall_total_mm: Optional[float] = None
    daily_mean_mm: Optional[float] = None
    rainfall_deficit_mm: Optional[float] = None
    consecutive_dry_days: int = 0
    heavy_rain_days: int = 0
    dry_spell_risk: bool = False
    interpretation: str

    model_config = ConfigDict(from_attributes=True)

class VegetationIntelligence(BaseModel):
    source: str = "NASA MODIS / VIIRS NDVI"
    spatial_resolution: str = "250 m to 500 m pixel"
    recent_mean_ndvi: Optional[float] = None
    historical_mean_ndvi: Optional[float] = None
    ndvi_anomaly: Optional[float] = None
    low_greenness_flag: bool = False
    bare_field_likelihood: str = "low"  # low | medium | high
    interpretation: str

    model_config = ConfigDict(from_attributes=True)

class BareFieldEvidence(BaseModel):
    ndvi_mean: Optional[float] = None
    root_zone_soil_moisture: Optional[float] = None
    recent_precipitation_mm: Optional[float] = None
    mean_temperature_c: Optional[float] = None

class BareFieldWindow(BaseModel):
    start_date: str
    end_date: str
    duration_days: int
    evidence: BareFieldEvidence
    risk: str = "low"  # low | medium | high | unknown
    interpretation: str
    confidence: str = "medium"  # low | medium | high

    model_config = ConfigDict(from_attributes=True)

class HeatStressIntelligence(BaseModel):
    source: str = "NASA POWER (T2M_MAX, T2M_MIN, RH2M)"
    heat_stress_days: int = 0  # T2M_MAX >= 35 C
    frost_risk_days: int = 0   # T2M_MIN <= 2 C
    consecutive_hot_days: int = 0
    interpretation: str

    model_config = ConfigDict(from_attributes=True)

class UnavailableSource(BaseModel):
    source: str
    status: str = "unavailable"
    reason: str = "UPSTREAM_UNAVAILABLE"
    data: Optional[Any] = None

class EarthObservationDataQuality(BaseModel):
    available_sources: List[str] = []
    unavailable_sources: List[UnavailableSource] = []
    missing_percentage_by_source: Dict[str, float] = {}
    overall_confidence: str = "medium"  # high | medium | low | not_enough_information
    earliest_observation_date: Optional[str] = None
    latest_observation_date: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class EarthObservationProvenance(BaseModel):
    source_name: str
    product_id: str
    spatial_resolution: str
    temporal_resolution: str
    measurement: str
    retrieval_method: str

class AnalysisPeriod(BaseModel):
    recent_start_date: str
    recent_end_date: str
    historical_start_date: str
    historical_end_date: str

class FarmEarthObservation(BaseModel):
    farm_id: str
    latitude: float
    longitude: float
    analysis_period: AnalysisPeriod
    soil_moisture: Optional[SoilMoistureIntelligence] = None
    climate: Optional[Dict[str, Any]] = None
    precipitation: Optional[PrecipitationIntelligence] = None
    vegetation: Optional[VegetationIntelligence] = None
    bare_field_windows: List[BareFieldWindow] = []
    heat_stress: Optional[HeatStressIntelligence] = None
    data_quality: EarthObservationDataQuality
    provenance: List[EarthObservationProvenance] = []
    limitations: List[str] = []
    is_demo_data: bool = False

    model_config = ConfigDict(from_attributes=True)

class TrendIndicator(BaseModel):
    indicator: str
    recent_value: Optional[float] = None
    historical_mean: Optional[float] = None
    anomaly: Optional[float] = None
    trend_direction: str = "stable"  # improving | declining | stable | unclear
    confidence: str = "medium"  # low | medium | high
    missing_percentage: float = 0.0

class HistoricalTrendResponse(BaseModel):
    farm_id: str
    trend_status: str  # sufficient_history | insufficient_history
    years_evaluated: int = 10
    explanation: str
    indicators: List[TrendIndicator] = []
    is_demo_data: bool = False

    model_config = ConfigDict(from_attributes=True)
