from typing import Dict, List, Optional
from pydantic import BaseModel, Field, ConfigDict

class MissingDataStats(BaseModel):
    missing_days_count: int = Field(..., ge=0)
    total_days_count: int = Field(..., ge=0)
    missing_percentage: float = Field(..., ge=0.0, le=100.0)
    parameters_with_gaps: List[str] = []

    model_config = ConfigDict(from_attributes=True)

class DailyClimateRecord(BaseModel):
    date: str = Field(..., pattern=r"^\d{4}-\d{2}-\d{2}$")
    t2m: Optional[float] = None
    t2m_max: Optional[float] = None
    t2m_min: Optional[float] = None
    prectotcorr: Optional[float] = None
    rh2m: Optional[float] = None
    allsky_sfc_sw_dwn: Optional[float] = None

    model_config = ConfigDict(from_attributes=True)

class MonthlyAggregate(BaseModel):
    month: str = Field(..., pattern=r"^\d{4}-\d{2}$")
    days_in_month: int
    valid_days: int
    t2m_mean: Optional[float] = None
    t2m_max_mean: Optional[float] = None
    t2m_min_mean: Optional[float] = None
    prectotcorr_sum: Optional[float] = None
    prectotcorr_daily_mean: Optional[float] = None
    rh2m_mean: Optional[float] = None
    allsky_sfc_sw_dwn_mean: Optional[float] = None

    model_config = ConfigDict(from_attributes=True)

class OverallAggregate(BaseModel):
    total_days: int
    t2m_mean: Optional[float] = None
    t2m_max_mean: Optional[float] = None
    t2m_min_mean: Optional[float] = None
    prectotcorr_sum: Optional[float] = None
    prectotcorr_daily_mean: Optional[float] = None
    rh2m_mean: Optional[float] = None
    allsky_sfc_sw_dwn_mean: Optional[float] = None

    model_config = ConfigDict(from_attributes=True)

class ClimateSummary(BaseModel):
    source: str
    dataset_or_endpoint: str
    latitude: float
    longitude: float
    start_date: str
    end_date: str
    parameters: List[str]
    parameter_units: Dict[str, str]
    retrieved_at: str
    missing_data: MissingDataStats
    coverage_note: str
    is_demo_data: bool
    overall: OverallAggregate
    monthly: List[MonthlyAggregate]

    model_config = ConfigDict(from_attributes=True)

class ClimateHistory(BaseModel):
    source: str
    dataset_or_endpoint: str
    latitude: float
    longitude: float
    start_date: str
    end_date: str
    parameters: List[str]
    parameter_units: Dict[str, str]
    retrieved_at: str
    missing_data: MissingDataStats
    coverage_note: str
    is_demo_data: bool
    records: List[DailyClimateRecord]

    model_config = ConfigDict(from_attributes=True)
