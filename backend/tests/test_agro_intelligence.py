import pytest
from unittest.mock import patch
from app.modules.farm_management.schemas import FarmProfile
from app.modules.agro_intelligence.engine import AgroIntelligenceEngine
from app.modules.agro_intelligence.crop_catalog import CropCatalog
from app.modules.nasa_data.power_client import NasaPowerClient

def test_crop_catalog_api(client):
    res = client.get("/api/v1/crops")
    assert res.status_code == 200
    crops = res.json()
    assert len(crops) == 9
    crop_map = {c["crop_id"]: c for c in crops}
    assert "wheat" in crop_map
    assert "chickpea" in crop_map
    assert "mung_bean" in crop_map
    assert "berseem_clover" in crop_map

    # Individual crop
    c_res = client.get("/api/v1/crops/mung_bean")
    assert c_res.status_code == 200
    assert c_res.json()["is_legume"] is True

    # 404 crop
    bad_res = client.get("/api/v1/crops/nonexistent_crop")
    assert bad_res.status_code == 404
    assert bad_res.json()["error_code"] == "NOT_FOUND"

def test_generate_recommendations_three_scenarios(client):
    # Ensure demo farm exists
    farm_res = client.get("/api/v1/farms/demo-peshawar-001")
    assert farm_res.status_code == 200

    with patch.object(NasaPowerClient, "fetch_raw_data", side_effect=lambda *args, **kwargs: NasaPowerClient()._load_demo_fallback(34.0151, 71.5249, "2026-05-01", "2026-07-31")):
        payload = {
            "farm_id": "demo-peshawar-001",
            "priority": "balanced",
            "use_demo_fallback": True
        }
        gen_res = client.post("/api/v1/recommendations/generate", json=payload)
        assert gen_res.status_code == 201
        rec = gen_res.json()
        assert rec["farm_id"] == "demo-peshawar-001"
        assert len(rec["scenarios"]) == 3

        scenario_ids = [s["scenario_id"] for s in rec["scenarios"]]
        assert scenario_ids == ["baseline", "pulse_inclusive", "soil_cover"]

        # Pulse inclusive must contain a nitrogen fixing legume
        pulse_scen = next(s for s in rec["scenarios"] if s["scenario_id"] == "pulse_inclusive")
        legumes = ["chickpea", "lentil", "mung_bean", "berseem_clover"]
        has_legume = any(crop in legumes for crop in pulse_scen["crop_sequence"])
        assert has_legume is True, "pulse_inclusive scenario must include a legume"

        # Soil cover scenario must contain berseem_clover or forage
        cover_scen = next(s for s in rec["scenarios"] if s["scenario_id"] == "soil_cover")
        assert "berseem_clover" in cover_scen["crop_sequence"]

        # All scenario required fields must be non-empty
        for s in rec["scenarios"]:
            assert len(s["crop_sequence"]) > 0
            assert len(s["seasonal_calendar"]) > 0
            assert len(s["rationale"]) > 0
            assert len(s["benefits"]) > 0
            assert len(s["risks"]) > 0
            assert len(s["assumptions"]) > 0
            assert s["score"] is not None
            assert 0 <= s["score"] <= 100
            assert s["score_breakdown"]["water_fit"] is not None
            assert s["score_breakdown"]["climate_suitability"] is not None
            assert s["score_breakdown"]["soil_health_diversity"] is not None

        # Verify retrieval by ID
        rec_id = rec["recommendation_id"]
        get_res = client.get(f"/api/v1/recommendations/{rec_id}")
        assert get_res.status_code == 200
        assert get_res.json()["recommendation_id"] == rec_id

def test_deterministic_scoring(client):
    farm_res = client.get("/api/v1/farms/demo-peshawar-001")
    farm_data = farm_res.json()
    farm = FarmProfile.model_validate(farm_data)

    # Calling engine twice with identical inputs must produce identical scores
    rec1 = AgroIntelligenceEngine.generate_recommendations(farm, None, "balanced")
    rec2 = AgroIntelligenceEngine.generate_recommendations(farm, None, "balanced")

    for s1, s2 in zip(rec1.scenarios, rec2.scenarios):
        assert s1.score == s2.score
        assert s1.score_breakdown.water_fit == s2.score_breakdown.water_fit
        assert s1.score_breakdown.climate_suitability == s2.score_breakdown.climate_suitability
        assert s1.score_breakdown.soil_health_diversity == s2.score_breakdown.soil_health_diversity

def test_critical_missing_inputs_score_is_null():
    farm = FarmProfile(
        farm_id="farm-unknown",
        name="Unknown Farm",
        latitude=34.0,
        longitude=71.5,
        area_value=1.0,
        area_unit="acres",
        soil_type="unknown",
        irrigation_type="unknown",
        water_availability="unknown",
        is_demo_data=False,
        crop_history=[],
        created_at="2026-01-01T00:00:00Z",
        updated_at="2026-01-01T00:00:00Z"
    )

    # No climate data and critical farm characteristics are unknown
    rec = AgroIntelligenceEngine.generate_recommendations(farm, None, "balanced")
    assert any("not enough information" in lim.lower() for lim in rec.limitations)
    for s in rec.scenarios:
        assert s.score is None
        assert s.score_breakdown.water_fit is None
        assert s.score_breakdown.climate_suitability is None
        assert s.score_breakdown.soil_health_diversity is None

def test_scenario_comparison_endpoint(client):
    farm_res = client.get("/api/v1/farms/demo-peshawar-001")
    with patch.object(NasaPowerClient, "fetch_raw_data", side_effect=lambda *args, **kwargs: NasaPowerClient()._load_demo_fallback(34.0151, 71.5249, "2026-05-01", "2026-07-31")):
        gen_res = client.post("/api/v1/recommendations/generate", json={
            "farm_id": "demo-peshawar-001",
            "priority": "balanced",
            "use_demo_fallback": True
        })
        rec_id = gen_res.json()["recommendation_id"]

        comp_res = client.post("/api/v1/recommendations/compare", json={
            "recommendation_id": rec_id,
            "scenario_ids": ["baseline", "pulse_inclusive"]
        })
        assert comp_res.status_code == 200
        comp_data = comp_res.json()
        assert len(comp_data["scenarios"]) == 2
        assert "tradeoffs" in comp_data
        assert "summary_notes" in comp_data
