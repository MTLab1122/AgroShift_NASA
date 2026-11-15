"""
Tests for Multi-NASA Earth Observation service and endpoints.
"""

from unittest.mock import MagicMock
from fastapi.testclient import TestClient
from app.main import app
from app.modules.earth_observation.service import EarthObservationService
from app.modules.earth_observation.schemas import (
    VegetationIntelligence,
    SoilMoistureIntelligence,
    PrecipitationIntelligence,
    GridCentroid,
)

client = TestClient(app)


def test_earth_observation_endpoint_success():
    res_farm = client.get("/api/v1/farms")
    assert res_farm.status_code == 200
    farm_id = res_farm.json()[0]["farm_id"]

    res = client.get(
        f"/api/v1/earth-observation?farm_id={farm_id}&start_date=2024-05-01&end_date=2024-07-31&use_demo_fallback=true"
    )
    assert res.status_code == 200
    data = res.json()

    assert data["farm_id"] == farm_id
    assert data["soil_moisture"] is not None
    assert data["soil_moisture"]["source"] == "NASA SMAP L4 / Crop-CASMA"
    assert data["soil_moisture"]["dry_root_zone_flag"] is True

    assert data["precipitation"] is not None
    assert data["precipitation"]["source"] == "NASA GPM IMERG"
    assert data["precipitation"]["consecutive_dry_days"] >= 14

    assert data["vegetation"] is not None
    assert data["vegetation"]["low_greenness_flag"] is True

    # Bare field window should be detected because >= 2 signals are active
    assert len(data["bare_field_windows"]) >= 1
    assert data["bare_field_windows"][0]["risk"] in ["medium", "high"]

    # Provenance and limitations must be present
    assert len(data["provenance"]) >= 4
    assert len(data["limitations"]) >= 4
    assert data["data_quality"]["overall_confidence"] in ["high", "medium"]


def test_bare_field_detection_requires_at_least_two_signals():
    service = EarthObservationService()

    # Low greenness NDVI (Signal 1), but healthy moisture (no Signal 2), low dry days (no Signal 3), low heat (no Signal 4)
    mock_ndvi = MagicMock()
    mock_ndvi.get_vegetation_intelligence.return_value = (
        VegetationIntelligence(
            source="NASA MODIS / VIIRS NDVI",
            spatial_resolution="250 m",
            recent_mean_ndvi=0.20,
            historical_mean_ndvi=0.35,
            low_greenness_flag=True,
            bare_field_likelihood="medium",
            interpretation="Low greenness test"
        ), False
    )

    mock_smap = MagicMock()
    mock_smap.get_soil_moisture_intelligence.return_value = (
        SoilMoistureIntelligence(
            source="NASA SMAP L4",
            spatial_resolution="9 km",
            grid_centroid=GridCentroid(latitude=34.0, longitude=71.5),
            recent_root_zone_moisture=35.0,  # Well above 25.0 dry threshold
            historical_mean=30.0,
            dry_root_zone_flag=False,
            interpretation="Adequate moisture",
            data_coverage_percentage=100.0
        ), False
    )

    mock_imerg = MagicMock()
    mock_imerg.get_precipitation_intelligence.return_value = (
        PrecipitationIntelligence(
            source="NASA GPM IMERG",
            product_run="Final Run",
            spatial_resolution="0.1 deg",
            seasonal_rainfall_total_mm=120.0,
            consecutive_dry_days=3,  # Well below 14 threshold
            heavy_rain_days=1,
            dry_spell_risk=False,
            interpretation="Adequate rain"
        ), False
    )

    mock_power = MagicMock()
    mock_power.fetch_raw_data.return_value = (
        {"properties": {"parameter": {"T2M_MAX": {"2024-05-01": 25.0}, "T2M_MIN": {"2024-05-01": 15.0}}}}, False
    )

    service.ndvi_client = mock_ndvi
    service.smap_client = mock_smap
    service.imerg_client = mock_imerg
    service.power_client = mock_power

    res = service.get_earth_observation(
        farm_id="test",
        latitude=34.0151,
        longitude=71.5249,
        start_date="2024-05-01",
        end_date="2024-07-31"
    )

    # Only 1 signal (low NDVI) was present, so bare_field_windows MUST be empty
    assert len(res.bare_field_windows) == 0


def test_partial_upstream_availability():
    service = EarthObservationService()

    # Simulate SMAP failure
    mock_smap = MagicMock()
    mock_smap.get_soil_moisture_intelligence.side_effect = RuntimeError("SMAP API Connection Timeout")
    service.smap_client = mock_smap

    res = service.get_earth_observation(
        farm_id="test",
        latitude=34.0151,
        longitude=71.5249,
        start_date="2024-05-01",
        end_date="2024-07-31"
    )

    # SMAP should be in unavailable_sources, but the overall call must NOT fail
    assert any(u.source == "NASA SMAP L4 / Crop-CASMA" for u in res.data_quality.unavailable_sources)
    assert res.soil_moisture is None
    # Other sources should still be available
    assert "NASA GPM IMERG" in res.data_quality.available_sources


def test_earth_observation_unknown_farm_returns_404():
    res = client.get("/api/v1/earth-observation?farm_id=unknown-farm-id")
    assert res.status_code == 404
    err = res.json()
    assert err["error_code"] == "NOT_FOUND"
    assert err["request_id"] is not None
