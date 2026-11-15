"""
Tests for 10-Year Historical Trend Analysis and the >= 5 valid years rule.
"""

from fastapi.testclient import TestClient
from app.main import app
from app.modules.earth_observation.trend_analyzer import TrendAnalyzer

client = TestClient(app)


def test_trend_analyzer_sufficient_history():
    analyzer = TrendAnalyzer()
    res = analyzer.analyze_trends(
        farm_id="test-farm",
        latitude=34.0151,
        longitude=71.5249,
        years=10,
        valid_years_available=10,
        use_demo_fallback=True
    )
    assert res.trend_status == "sufficient_history"
    assert res.years_evaluated == 10
    assert len(res.indicators) == 4
    # Check that soil moisture indicator is present
    sm = next(i for i in res.indicators if "Soil Moisture" in i.indicator)
    assert sm.recent_value == 19.8
    assert sm.historical_mean == 27.4
    assert sm.anomaly == -7.6


def test_trend_analyzer_insufficient_history_enforced():
    analyzer = TrendAnalyzer()
    # When fewer than 5 valid years are available
    res = analyzer.analyze_trends(
        farm_id="test-farm",
        latitude=34.0151,
        longitude=71.5249,
        years=10,
        valid_years_available=3,
        use_demo_fallback=True
    )
    assert res.trend_status == "insufficient_history"
    assert res.years_evaluated == 3
    assert "At least 5 continuous years are strictly required" in res.explanation
    for ind in res.indicators:
        assert ind.recent_value is None
        assert ind.historical_mean is None
        assert ind.anomaly is None
        assert ind.confidence == "low"


def test_trends_endpoint_success():
    # Fetch demo farm
    res_farm = client.get("/api/v1/farms")
    assert res_farm.status_code == 200
    farms = res_farm.json()
    farm_id = farms[0]["farm_id"]

    res = client.get(f"/api/v1/earth-observation/trends?farm_id={farm_id}&years=10")
    assert res.status_code == 200
    data = res.json()
    assert data["farm_id"] == farm_id
    assert data["trend_status"] == "sufficient_history"
    assert len(data["indicators"]) >= 4


def test_trends_endpoint_unknown_farm_returns_404():
    res = client.get("/api/v1/earth-observation/trends?farm_id=non-existent-farm-uuid")
    assert res.status_code == 404
    err = res.json()
    assert err["error_code"] == "NOT_FOUND"
    assert err["request_id"] is not None
