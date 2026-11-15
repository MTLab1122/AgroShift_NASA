from unittest.mock import patch
import pytest
from app.modules.nasa_data.normalizer import normalize_value, normalize_nasa_power_payload
from app.modules.nasa_data.aggregations import compute_monthly_aggregates, compute_overall_aggregate
from app.modules.nasa_data.schemas import DailyClimateRecord
from app.modules.nasa_data.power_client import NasaPowerClient
from app.core.errors import UpstreamUnavailableException

def test_fill_value_normalization():
    # NASA fill values (-999, -999.0, -900) must become None
    assert normalize_value(-999) is None
    assert normalize_value(-999.0) is None
    assert normalize_value(-900.0) is None
    assert normalize_value(-950.5) is None
    
    # Valid values, including 0.0, negative temperatures, positive values
    assert normalize_value(0.0) == 0.0
    assert normalize_value(0) == 0.0
    assert normalize_value(-5.4) == -5.4
    assert normalize_value(32.85) == 32.85
    assert normalize_value(None) is None

def test_mock_payload_with_fill_values_and_units():
    mock_raw_payload = {
        "parameters": {
            "T2M": {"units": "°C", "longname": "Temperature at 2 Meters"},
            "PRECTOTCORR": {"units": "mm/day", "longname": "Precipitation"}
        },
        "properties": {
            "parameter": {
                "T2M": {
                    "20260501": 28.5,
                    "20260502": -999.0,
                    "20260503": 30.2
                },
                "T2M_MAX": {
                    "20260501": 35.0,
                    "20260502": -999.0,
                    "20260503": 37.1
                },
                "T2M_MIN": {
                    "20260501": 21.0,
                    "20260502": -999.0,
                    "20260503": 23.0
                },
                "PRECTOTCORR": {
                    "20260501": 0.0,
                    "20260502": -999.0,
                    "20260503": 4.5
                },
                "RH2M": {
                    "20260501": 45.0,
                    "20260502": -999.0,
                    "20260503": 50.0
                },
                "ALLSKY_SFC_SW_DWN": {
                    "20260501": 22.0,
                    "20260502": -999.0,
                    "20260503": 21.5
                }
            }
        }
    }

    records, missing_stats, units = normalize_nasa_power_payload(mock_raw_payload)

    # 3 total days, day 2 has -999
    assert len(records) == 3
    assert missing_stats.total_days_count == 3
    assert missing_stats.missing_days_count == 1
    assert round(missing_stats.missing_percentage, 1) == 33.3
    assert "T2M" in missing_stats.parameters_with_gaps

    # Day 1
    assert records[0].date == "2026-05-01"
    assert records[0].t2m == 28.5
    assert records[0].prectotcorr == 0.0  # Real 0.0 preserved

    # Day 2
    assert records[1].date == "2026-05-02"
    assert records[1].t2m is None
    assert records[1].prectotcorr is None

    # Day 3
    assert records[2].date == "2026-05-03"
    assert records[2].t2m == 30.2
    assert records[2].prectotcorr == 4.5

    # Check aggregations
    monthly = compute_monthly_aggregates(records)
    assert len(monthly) == 1
    m = monthly[0]
    assert m.month == "2026-05"
    assert m.days_in_month == 3
    assert m.valid_days == 2
    # Mean of 28.5 and 30.2 is 29.35
    assert m.t2m_mean == 29.35
    # Sum of 0.0 and 4.5 is 4.5
    assert m.prectotcorr_sum == 4.5
    assert m.prectotcorr_daily_mean == 2.25

    overall = compute_overall_aggregate(records)
    assert overall.total_days == 3
    assert overall.t2m_mean == 29.35
    assert overall.prectotcorr_sum == 4.5

def test_upstream_unavailable_without_fallback():
    client = NasaPowerClient()
    NasaPowerClient._cache.clear()
    # Mock network error
    with patch("httpx.Client.get", side_effect=Exception("Connection refused")):
        with pytest.raises(UpstreamUnavailableException) as exc_info:
            client.fetch_raw_data(
                latitude=34.0151,
                longitude=71.5249,
                start_date="2026-05-01",
                end_date="2026-05-30",
                use_demo_fallback=False
            )
        assert exc_info.value.error_code == "UPSTREAM_UNAVAILABLE"
        assert "No live climate data was fabricated" in exc_info.value.message

def test_demo_fallback_success_when_requested():
    client = NasaPowerClient()
    # Clear cache to ensure fallback code path executes
    NasaPowerClient._cache.clear()
    with patch("httpx.Client.get", side_effect=Exception("Connection timed out")):
        payload, is_demo = client.fetch_raw_data(
            latitude=34.0151,
            longitude=71.5249,
            start_date="2026-05-01",
            end_date="2026-07-31",
            use_demo_fallback=True
        )
        assert is_demo is True
        assert payload is not None

def test_climate_endpoints_with_demo_fallback(client):
    NasaPowerClient._cache.clear()
    with patch.object(NasaPowerClient, "fetch_raw_data", side_effect=lambda *args, **kwargs: NasaPowerClient()._load_demo_fallback(34.0151, 71.5249, "2026-05-01", "2026-07-31")):
        # Call summary with use_demo_fallback=True
        resp = client.get("/api/v1/climate/summary?latitude=34.0151&longitude=71.5249&use_demo_fallback=true")
        assert resp.status_code == 200
        data = resp.json()
        assert data["is_demo_data"] is True
        assert data["latitude"] == 34.0151
        assert data["longitude"] == 71.5249
        assert data["missing_data"]["missing_days_count"] >= 1
        assert len(data["monthly"]) > 0

        # Call history with use_demo_fallback=True
        h_resp = client.get("/api/v1/climate/history?latitude=34.0151&longitude=71.5249&use_demo_fallback=true")
        assert h_resp.status_code == 200
        h_data = h_resp.json()
        assert h_data["is_demo_data"] is True
        assert len(h_data["records"]) > 0
        # Verify missing observations are null, not 0 or false
        null_days = [r for r in h_data["records"] if r["t2m"] is None]
        assert len(null_days) > 0
        for nd in null_days:
            assert nd["t2m"] is None
            assert nd["t2m"] != 0

def test_climate_validation_errors(client):
    # Invalid lat > 90
    bad_lat = client.get("/api/v1/climate/summary?latitude=99.0&longitude=71.5")
    assert bad_lat.status_code == 422
    assert bad_lat.json()["error_code"] == "VALIDATION_ERROR"

    # End date before start date
    bad_dates = client.get("/api/v1/climate/summary?latitude=34.0&longitude=71.5&start_date=2026-06-01&end_date=2026-05-01")
    assert bad_dates.status_code == 422
    assert bad_dates.json()["error_code"] == "VALIDATION_ERROR"
