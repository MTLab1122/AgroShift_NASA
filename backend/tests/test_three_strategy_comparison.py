"""
Tests for Three-Strategy Crop-Rotation Comparison and Satellite Evidence Injection.
"""

from fastapi.testclient import TestClient
from app.main import app
from app.modules.agro_intelligence.engine import AgroIntelligenceEngine
from app.modules.farm_management.schemas import FarmProfile

client = TestClient(app)


def test_three_strategies_generation_and_satellite_evidence():
    farm = FarmProfile(
        farm_id="test-farm-1",
        name="Peshawar Test Farm",
        latitude=34.0151,
        longitude=71.5249,
        area_value=5.0,
        area_unit="acres",
        soil_type="loamy",
        irrigation_type="canal",
        water_availability="medium",
        current_crop="wheat",
        created_at="2024-01-01T00:00:00Z",
        updated_at="2024-01-01T00:00:00Z",
    )

    strategies = AgroIntelligenceEngine.generate_three_strategies(
        farm=farm,
        primary_goal="water_efficiency"
    )

    assert len(strategies) == 3
    strat_ids = [s.strategy_id for s in strategies]
    assert "baseline" in strat_ids
    assert "water_saver_pulse_fix" in strat_ids
    assert "soil_shield_forage" in strat_ids

    # Check baseline
    b = next(s for s in strategies if s.strategy_id == "baseline")
    assert b.relative_water_demand_indicator == "high"
    assert len(b.satellite_evidence) >= 2
    assert any("SMAP" in ev or "POWER" in ev or "NDVI" in ev for ev in b.satellite_evidence)

    # Check water saver
    p = next(s for s in strategies if s.strategy_id == "water_saver_pulse_fix")
    assert p.relative_water_demand_indicator == "low"
    assert "Potential reduction in modeled water-demand indicator relative to baseline" in p.relative_water_saving_note
    assert len(p.satellite_evidence) >= 2
    assert p.scoring.soil_health_breakdown.legume_included is True

    # Check soil shield
    s = next(s for s in strategies if s.strategy_id == "soil_shield_forage")
    assert s.relative_water_demand_indicator == "medium"
    assert len(s.satellite_evidence) >= 2
    assert s.scoring.soil_health_breakdown.cover_forage_included is True


def test_strategy_scoring_goal_weighting():
    farm = FarmProfile(
        farm_id="test-farm-2",
        name="Charsadda Farm",
        latitude=34.1500,
        longitude=71.7400,
        area_value=8.0,
        area_unit="acres",
        soil_type="clay",
        irrigation_type="tube_well",
        water_availability="low",
        current_crop="wheat",
        created_at="2024-01-01T00:00:00Z",
        updated_at="2024-01-01T00:00:00Z",
    )

    # When goal is water_efficiency, water_saver_pulse_fix should score highest
    strats_water = AgroIntelligenceEngine.generate_three_strategies(farm=farm, primary_goal="water_efficiency")
    p_water = next(s for s in strats_water if s.strategy_id == "water_saver_pulse_fix")
    b_water = next(s for s in strats_water if s.strategy_id == "baseline")
    assert p_water.scoring.overall_score > b_water.scoring.overall_score

    # When goal is soil_health, soil_shield_forage should score high
    strats_soil = AgroIntelligenceEngine.generate_three_strategies(farm=farm, primary_goal="soil_health")
    s_soil = next(s for s in strats_soil if s.strategy_id == "soil_shield_forage")
    assert s_soil.scoring.soil_health_diversity >= 90.0


def test_strategies_api_endpoint():
    # Fetch demo farm
    res_farm = client.get("/api/v1/farms")
    assert res_farm.status_code == 200
    farm_id = res_farm.json()[0]["farm_id"]

    res = client.get(f"/api/v1/recommendations/strategies?farm_id={farm_id}&primary_goal=water_efficiency")
    assert res.status_code == 200
    strategies = res.json()
    assert len(strategies) == 3
    for s in strategies:
        assert s["confidence"] in ["high", "medium", "low", "not_enough_information"]
        assert s["local_check_required"] is True
        assert len(s["satellite_evidence"]) >= 2
        assert len(s["rotation_sequence"]) == 3
