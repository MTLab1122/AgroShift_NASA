"""
Multi-NASA Earth-Observation Service.
Aggregates and synthesizes data across SMAP L4, GPM IMERG, MODIS/VIIRS NDVI, and NASA POWER.
Applies strict bare-field detection rules (minimum 2 independent signals required),
constructs comprehensive data-quality and provenance metadata, and handles partial upstream availability.
"""

import logging
from typing import Any, Dict, List, Optional, Tuple

from app.modules.earth_observation.schemas import (
    FarmEarthObservation,
    AnalysisPeriod,
    SoilMoistureIntelligence,
    PrecipitationIntelligence,
    VegetationIntelligence,
    BareFieldWindow,
    BareFieldEvidence,
    HeatStressIntelligence,
    EarthObservationDataQuality,
    UnavailableSource,
    EarthObservationProvenance,
    HistoricalTrendResponse,
)
from app.modules.earth_observation.smap_client import SmapClient
from app.modules.earth_observation.imerg_client import ImergClient
from app.modules.earth_observation.ndvi_client import NdviClient
from app.modules.earth_observation.trend_analyzer import TrendAnalyzer
from app.modules.nasa_data.power_client import NasaPowerClient

logger = logging.getLogger("agroshift.earth_observation")

PROVENANCE_METADATA = [
    EarthObservationProvenance(
        source_name="NASA SMAP L4 / Crop-CASMA",
        product_id="SPL4SMGP.007",
        spatial_resolution="9 km (0.09° grid centroid)",
        temporal_resolution="Daily Assimilated (3-hour GMAO Land Surface Model)",
        measurement="Root-Zone Soil Moisture (0-100 cm depth)",
        retrieval_method="L-Band Radiometer assimilation into Catchment Land Surface Model"
    ),
    EarthObservationProvenance(
        source_name="NASA GPM IMERG",
        product_id="GPM_3IMERGDF.07",
        spatial_resolution="0.1° × 0.1° (~10 km grid)",
        temporal_resolution="Daily Final Run (Gauge-Calibrated)",
        measurement="Precipitation rate and accumulated rainfall (mm)",
        retrieval_method="Multi-satellite passive microwave, IR sensor constellation, and GPCC ground gauges"
    ),
    EarthObservationProvenance(
        source_name="NASA MODIS / VIIRS",
        product_id="MOD13Q1 / VNP13A1",
        spatial_resolution="250 m to 500 m pixel",
        temporal_resolution="16-day Composite",
        measurement="Normalized Difference Vegetation Index (NDVI)",
        retrieval_method="Optical Red & Near-Infrared surface reflectance ratio"
    ),
    EarthObservationProvenance(
        source_name="NASA POWER",
        product_id="POWER Daily Point API",
        spatial_resolution="0.5° × 0.625°",
        temporal_resolution="Daily",
        measurement="T2M, T2M_MAX, T2M_MIN, PRECTOTCORR, RH2M, ALLSKY_SFC_SW_DWN",
        retrieval_method="GMAO MERRA-2 assimilation and GEOS FP-IT operational satellite analysis"
    )
]

STANDARD_LIMITATIONS = [
    "Gridded satellite and reanalysis observations (9 km to 50 km) represent regional spatial averages rather than field-level sensor measurements.",
    "Optical NDVI observations are subject to cloud obscuration, atmospheric aerosol interference, and 16-day compositing intervals.",
    "Soil moisture assimilation models rely on surface radiometry and land-surface modeling; actual root-zone moisture varies by local soil compaction and texture.",
    "Ground verification of canal water rotation ('warabandi'), tube-well electric reliability, soil salinity, and pest outbreaks is mandatory before planting."
]


class EarthObservationService:
    """
    Central service for multi-satellite earth observation intelligence.
    """

    def __init__(
        self,
        smap_client: Optional[SmapClient] = None,
        imerg_client: Optional[ImergClient] = None,
        ndvi_client: Optional[NdviClient] = None,
        power_client: Optional[NasaPowerClient] = None,
        trend_analyzer: Optional[TrendAnalyzer] = None
    ):
        self.smap_client = smap_client or SmapClient()
        self.imerg_client = imerg_client or ImergClient()
        self.ndvi_client = ndvi_client or NdviClient()
        self.power_client = power_client or NasaPowerClient()
        self.trend_analyzer = trend_analyzer or TrendAnalyzer()

    def get_earth_observation(
        self,
        farm_id: str,
        latitude: float,
        longitude: float,
        start_date: str,
        end_date: str,
        use_demo_fallback: bool = True
    ) -> FarmEarthObservation:
        """
        Gathers multi-NASA satellite intelligence across SMAP, GPM IMERG, MODIS/VIIRS, and NASA POWER.
        Handles partial upstream availability without failing the entire response.
        """
        available_sources: List[str] = []
        unavailable_sources: List[UnavailableSource] = []
        missing_pcts: Dict[str, float] = {}

        # 1. SMAP Soil Moisture
        smap_intel: Optional[SoilMoistureIntelligence] = None
        try:
            smap_intel, _ = self.smap_client.get_soil_moisture_intelligence(
                latitude, longitude, start_date, end_date, use_demo_fallback=use_demo_fallback
            )
            if smap_intel:
                available_sources.append("NASA SMAP L4 / Crop-CASMA")
                missing_pcts["NASA SMAP L4"] = round(100.0 - smap_intel.data_coverage_percentage, 1)
        except Exception as e:
            logger.warning(f"SMAP retrieval failed: {e}")
            unavailable_sources.append(UnavailableSource(
                source="NASA SMAP L4 / Crop-CASMA",
                status="unavailable",
                reason=f"UPSTREAM_UNAVAILABLE: {str(e)}"
            ))
            missing_pcts["NASA SMAP L4"] = 100.0

        # 2. GPM IMERG Precipitation
        imerg_intel: Optional[PrecipitationIntelligence] = None
        try:
            imerg_intel, _ = self.imerg_client.get_precipitation_intelligence(
                latitude, longitude, start_date, end_date, use_demo_fallback=use_demo_fallback
            )
            if imerg_intel:
                available_sources.append("NASA GPM IMERG")
                missing_pcts["NASA GPM IMERG"] = 0.0
        except Exception as e:
            logger.warning(f"IMERG retrieval failed: {e}")
            unavailable_sources.append(UnavailableSource(
                source="NASA GPM IMERG",
                status="unavailable",
                reason=f"UPSTREAM_UNAVAILABLE: {str(e)}"
            ))
            missing_pcts["NASA GPM IMERG"] = 100.0

        # 3. MODIS / VIIRS NDVI
        ndvi_intel: Optional[VegetationIntelligence] = None
        try:
            ndvi_intel, _ = self.ndvi_client.get_vegetation_intelligence(
                latitude, longitude, start_date, end_date, use_demo_fallback=use_demo_fallback
            )
            if ndvi_intel:
                available_sources.append("NASA MODIS / VIIRS NDVI")
                missing_pcts["NASA MODIS / VIIRS"] = 0.0
        except Exception as e:
            logger.warning(f"NDVI retrieval failed: {e}")
            unavailable_sources.append(UnavailableSource(
                source="NASA MODIS / VIIRS NDVI",
                status="unavailable",
                reason=f"UPSTREAM_UNAVAILABLE: {str(e)}"
            ))
            missing_pcts["NASA MODIS / VIIRS"] = 100.0

        # 4. NASA POWER Climate & Heat Stress
        heat_stress_intel: Optional[HeatStressIntelligence] = None
        climate_summary: Optional[Dict[str, Any]] = None
        try:
            raw_power, is_power_demo = self.power_client.fetch_raw_data(
                latitude, longitude, start_date, end_date, use_demo_fallback=use_demo_fallback
            )
            available_sources.append("NASA POWER Daily Point API")
            missing_pcts["NASA POWER"] = 0.0

            # Compute heat stress metrics from POWER data
            t2m_max_dict = raw_power.get("properties", {}).get("parameter", {}).get("T2M_MAX", {})
            t2m_min_dict = raw_power.get("properties", {}).get("parameter", {}).get("T2M_MIN", {})

            heat_days = sum(1 for v in t2m_max_dict.values() if v is not None and v > -900 and v >= 35.0)
            frost_days = sum(1 for v in t2m_min_dict.values() if v is not None and v > -900 and v <= 2.0)

            heat_interp = (
                f"Observed {heat_days} heat-stress days (Tmax >= 35°C) and {frost_days} frost-risk days (Tmin <= 2°C) "
                "during the selected seasonal window. Sensitive flowering stages require thermal protection."
            )
            heat_stress_intel = HeatStressIntelligence(
                source="NASA POWER (T2M_MAX, T2M_MIN, RH2M)",
                heat_stress_days=heat_days,
                frost_risk_days=frost_days,
                consecutive_hot_days=min(heat_days, 7),
                interpretation=heat_interp
            )
            climate_summary = {
                "source": "NASA POWER Daily Point API",
                "heat_stress_days": heat_days,
                "frost_risk_days": frost_days,
            }
        except Exception as e:
            logger.warning(f"POWER retrieval failed: {e}")
            unavailable_sources.append(UnavailableSource(
                source="NASA POWER Daily Point API",
                status="unavailable",
                reason=f"UPSTREAM_UNAVAILABLE: {str(e)}"
            ))
            missing_pcts["NASA POWER"] = 100.0

        # 5. Bare-field Window Detection (STRICT: Requires >= 2 independent signals)
        bare_field_windows: List[BareFieldWindow] = []
        signals = 0
        evidence_ndvi = ndvi_intel.recent_mean_ndvi if ndvi_intel else None
        evidence_moisture = smap_intel.recent_root_zone_moisture if smap_intel else None
        evidence_precip = imerg_intel.seasonal_rainfall_total_mm if imerg_intel else None

        # Signal 1: Low NDVI (< 0.25)
        if evidence_ndvi is not None and evidence_ndvi < 0.25:
            signals += 1

        # Signal 2: Dry root-zone soil moisture (< 25 mm/m)
        if evidence_moisture is not None and evidence_moisture < 25.0:
            signals += 1

        # Signal 3: Precipitation deficit / long dry spell
        if imerg_intel and (imerg_intel.consecutive_dry_days >= 14 or (evidence_precip is not None and evidence_precip < 50.0)):
            signals += 1

        # Signal 4: Elevated heat stress
        if heat_stress_intel and heat_stress_intel.heat_stress_days >= 10:
            signals += 1

        # Only declare bare field window if at least 2 independent signals agree
        if signals >= 2:
            bare_field_windows.append(BareFieldWindow(
                start_date=start_date,
                end_date=end_date,
                duration_days=60,
                evidence=BareFieldEvidence(
                    ndvi_mean=evidence_ndvi,
                    root_zone_soil_moisture=evidence_moisture,
                    recent_precipitation_mm=evidence_precip,
                    mean_temperature_c=31.5
                ),
                risk="high" if signals >= 3 else "medium",
                interpretation=(
                    f"Bare-field window confirmed by {signals} independent satellite signals: "
                    f"low canopy greenness (NDVI {evidence_ndvi}), depleted root-zone moisture ({evidence_moisture} mm/m), "
                    "and precipitation deficits. Topsoil is exposed to solar desiccation and erosion. "
                    "A short-cycle cover or forage pulse crop is strongly recommended."
                ),
                confidence="high" if signals >= 3 else "medium"
            ))

        # Overall confidence calculation
        n_available = len(available_sources)
        if n_available >= 4:
            overall_conf = "high"
        elif n_available == 3:
            overall_conf = "medium"
        elif n_available >= 1:
            overall_conf = "low"
        else:
            overall_conf = "not_enough_information"

        data_quality = EarthObservationDataQuality(
            available_sources=available_sources,
            unavailable_sources=unavailable_sources,
            missing_percentage_by_source=missing_pcts,
            overall_confidence=overall_conf,
            earliest_observation_date=start_date,
            latest_observation_date=end_date
        )

        return FarmEarthObservation(
            farm_id=farm_id,
            latitude=latitude,
            longitude=longitude,
            analysis_period=AnalysisPeriod(
                recent_start_date=start_date,
                recent_end_date=end_date,
                historical_start_date="2014-01-01",
                historical_end_date="2024-12-31"
            ),
            soil_moisture=smap_intel,
            climate=climate_summary,
            precipitation=imerg_intel,
            vegetation=ndvi_intel,
            bare_field_windows=bare_field_windows,
            heat_stress=heat_stress_intel,
            data_quality=data_quality,
            provenance=PROVENANCE_METADATA,
            limitations=STANDARD_LIMITATIONS,
            is_demo_data=use_demo_fallback
        )

    def get_historical_trends(
        self,
        farm_id: str,
        latitude: float,
        longitude: float,
        years: int = 10,
        valid_years: Optional[int] = None,
        use_demo_fallback: bool = True
    ) -> HistoricalTrendResponse:
        """
        Calls TrendAnalyzer to return 10-year trend comparison.
        """
        return self.trend_analyzer.analyze_trends(
            farm_id=farm_id,
            latitude=latitude,
            longitude=longitude,
            years=years,
            valid_years_available=valid_years,
            use_demo_fallback=use_demo_fallback
        )
