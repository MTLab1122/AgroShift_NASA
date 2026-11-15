"""
Tests for Confidence and Local-Check Badges, Disclaimers, and Scientific Integrity Rules.
"""

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

EXACT_LOCAL_CHECK_TEXT = "Local Check: Verify canal water schedules, seed prices, soil salinity, pest pressure, and field-specific conditions before planting."
EXACT_DISCLAIMER_TEXT = "NASA satellite data represents broad-area conditions, not a field-specific measurement."


def test_confidence_and_local_check_in_strategies():
    res_farm = client.get("/api/v1/farms")
    assert res_farm.status_code == 200
    farm_id = res_farm.json()[0]["farm_id"]

    res = client.get(f"/api/v1/recommendations/strategies?farm_id={farm_id}")
    assert res.status_code == 200
    strategies = res.json()

    for s in strategies:
        assert s["local_check_required"] is True
        assert s["local_check_reminder"] == EXACT_LOCAL_CHECK_TEXT
        assert s["disclaimer"] == EXACT_DISCLAIMER_TEXT
        assert s["confidence"] in ["high", "medium", "low", "not_enough_information"]


def test_confidence_and_local_check_in_comparison_endpoint():
    res_farm = client.get("/api/v1/farms")
    assert res_farm.status_code == 200
    farm_id = res_farm.json()[0]["farm_id"]

    # Generate recommendation first
    gen_res = client.post(
        "/api/v1/recommendations/generate",
        json={"farm_id": farm_id, "priority": "balanced", "use_demo_fallback": True}
    )
    assert gen_res.status_code == 201
    rec_id = gen_res.json()["recommendation_id"]

    comp_res = client.post(
        "/api/v1/recommendations/compare",
        json={"recommendation_id": rec_id, "farm_id": farm_id, "primary_goal": "water_efficiency"}
    )
    assert comp_res.status_code == 200
    data = comp_res.json()

    assert data["local_check_required"] is True
    assert data["local_check_reminder"] == EXACT_LOCAL_CHECK_TEXT
    assert data["disclaimer"] == EXACT_DISCLAIMER_TEXT
    assert data["confidence"] in ["high", "medium", "low", "not_enough_information"]
    assert len(data["strategies"]) == 3
