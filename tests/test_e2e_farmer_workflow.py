import sys
from pathlib import Path

# Add backend directory to path
backend_dir = Path(__file__).resolve().parent.parent / "backend"
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

import pytest
from unittest.mock import patch
from fastapi.testclient import TestClient
from app.main import app
from app.modules.nasa_data.power_client import NasaPowerClient

EXACT_LOCAL_CHECK = "Local Check: Verify canal water schedules, seed prices, soil salinity, pest pressure, and field-specific conditions before planting."
EXACT_DISCLAIMER = "NASA satellite data represents broad-area conditions, not a field-specific measurement."

@pytest.fixture
def client():
    with TestClient(app) as test_client:
        yield test_client


def test_complete_farmer_multi_nasa_workflow(client):
    """
    Executes the complete Phase 6 End-to-End Farmer Decision Workflow:
    1. Parse voice intent in Urdu and English
    2. Create farm at Peshawar Valley coordinates (34.0151, 71.5249)
    3. Create farmer profile with privacy protection (no raw phone exposure)
    4. Link farm to farmer
    5. Retrieve multi-NASA Earth observation checkup (SMAP, IMERG, NDVI, POWER)
    6. Verify bare-field detection with >= 2 independent signals
    7. Retrieve 10-year trend analysis enforcing >= 5 valid years rule
    8. Generate 3-strategy rotation comparison (baseline, water_saver_pulse_fix, soil_shield_forage)
    9. Verify confidence badge and mandatory local-check reminder
    10. Export upgraded PDF report and multi-NASA CSV dataset
    """

    # ---------------------------------------------------------
    # 1. Voice intent parsing (Urdu and English)
    # ---------------------------------------------------------
    voice_res_ur = client.post("/api/v1/farmers/parse-voice", json={"transcript": "گندم اور ٹیوب ویل پانی بچاؤ"})
    assert voice_res_ur.status_code == 200
    ur_data = voice_res_ur.json()
    assert ur_data["parsed_fields"]["current_crop"] == "wheat"
    assert ur_data["parsed_fields"]["irrigation_type"] == "tube_well"
    assert ur_data["parsed_fields"]["primary_goal"] == "water_efficiency"

    voice_res_en = client.post("/api/v1/farmers/parse-voice", json={"transcript": "I grow maize with canal irrigation and want more income"})
    assert voice_res_en.status_code == 200
    en_data = voice_res_en.json()
    assert en_data["parsed_fields"]["current_crop"] == "maize"
    assert en_data["parsed_fields"]["irrigation_type"] == "canal"
    assert en_data["parsed_fields"]["primary_goal"] == "cash_yield"

    # ---------------------------------------------------------
    # 2. Create farm at Peshawar Valley coordinates
    # ---------------------------------------------------------
    farm_payload = {
        "name": "Torkham Highway Pilot Farm",
        "latitude": 34.0151,
        "longitude": 71.5249,
        "area_value": 7.5,
        "area_unit": "acres",
        "soil_type": "loamy",
        "irrigation_type": "canal",
        "water_availability": "medium",
        "current_crop": "wheat",
        "is_demo_data": False,
    }
    farm_res = client.post("/api/v1/farms", json=farm_payload)
    assert farm_res.status_code == 201
    farm_data = farm_res.json()
    farm_id = farm_data["farm_id"]
    assert farm_id is not None

    # ---------------------------------------------------------
    # 3. Create farmer profile & verify privacy (phone masked)
    # ---------------------------------------------------------
    farmer_payload = {
        "full_name": "Tariq Khan",
        "phone_number": "0300-1234567",
        "preferred_language": "ur",
        "literacy_support_mode": "voice",
        "district": "peshawar",
        "village_or_settlement": "Peshawar Suburbs",
        "farm_id": farm_id,
    }
    farmer_res = client.post("/api/v1/farmers", json=farmer_payload)
    assert farmer_res.status_code == 201
    farmer_data = farmer_res.json()
    farmer_id = farmer_data["farmer_id"]
    assert farmer_id is not None
    # Verify privacy: raw phone number must NEVER be exposed
    assert farmer_data["phone_number"] == "***-***-4567"

    # ---------------------------------------------------------
    # 4. Link farm to farmer
    # ---------------------------------------------------------
    link_res = client.post(f"/api/v1/farmers/{farmer_id}/farms", json={"farm_id": farm_id, "relationship": "owner"})
    assert link_res.status_code == 201

    farms_linked = client.get(f"/api/v1/farmers/{farmer_id}/farms")
    assert farms_linked.status_code == 200
    assert any(f["farm_id"] == farm_id for f in farms_linked.json())

    # ---------------------------------------------------------
    # 5. Retrieve multi-NASA Earth observation checkup
    # ---------------------------------------------------------
    eo_res = client.get(f"/api/v1/earth-observation?farm_id={farm_id}&start_date=2024-05-01&end_date=2024-07-31&use_demo_fallback=true")
    assert eo_res.status_code == 200
    eo_data = eo_res.json()

    # SMAP L4 soil moisture
    assert eo_data["soil_moisture"] is not None
    assert eo_data["soil_moisture"]["source"] == "NASA SMAP L4 / Crop-CASMA"
    assert eo_data["soil_moisture"]["recent_root_zone_moisture"] == 19.8
    assert eo_data["soil_moisture"]["dry_root_zone_flag"] is True

    # GPM IMERG precipitation
    assert eo_data["precipitation"] is not None
    assert eo_data["precipitation"]["source"] == "NASA GPM IMERG"
    assert eo_data["precipitation"]["consecutive_dry_days"] >= 14
    assert eo_data["precipitation"]["dry_spell_risk"] is True

    # MODIS / VIIRS NDVI
    assert eo_data["vegetation"] is not None
    assert eo_data["vegetation"]["low_greenness_flag"] is True
    assert eo_data["vegetation"]["recent_mean_ndvi"] < 0.25

    # NASA POWER heat stress
    assert eo_data["heat_stress"] is not None
    assert eo_data["heat_stress"]["heat_stress_days"] >= 10

    # Bare-field detection requires >= 2 signals
    assert len(eo_data["bare_field_windows"]) >= 1
    assert eo_data["bare_field_windows"][0]["confidence"] in ["high", "medium"]

    # ---------------------------------------------------------
    # 6. Retrieve 10-year historical trend analysis
    # ---------------------------------------------------------
    trend_res = client.get(f"/api/v1/earth-observation/trends?farm_id={farm_id}&years=10")
    assert trend_res.status_code == 200
    trend_data = trend_res.json()
    assert trend_data["trend_status"] == "sufficient_history"
    assert trend_data["years_evaluated"] == 10
    assert len(trend_data["indicators"]) == 4

    # ---------------------------------------------------------
    # 7. Generate 3-strategy rotation comparison
    # ---------------------------------------------------------
    strat_res = client.get(f"/api/v1/recommendations/strategies?farm_id={farm_id}&primary_goal=water_efficiency")
    assert strat_res.status_code == 200
    strats = strat_res.json()
    assert len(strats) == 3

    baseline = next(s for s in strats if s["strategy_id"] == "baseline")
    pulse = next(s for s in strats if s["strategy_id"] == "water_saver_pulse_fix")
    cover = next(s for s in strats if s["strategy_id"] == "soil_shield_forage")

    assert baseline["relative_water_demand_indicator"] == "high"
    assert pulse["relative_water_demand_indicator"] == "low"
    assert cover["relative_water_demand_indicator"] == "medium"

    # Each strategy has at least 2 satellite evidence statements
    for s in [baseline, pulse, cover]:
        assert len(s["satellite_evidence"]) >= 2
        assert s["confidence"] in ["high", "medium", "low", "not_enough_information"]
        assert s["local_check_required"] is True
        assert s["local_check_reminder"] == EXACT_LOCAL_CHECK
        assert s["disclaimer"] == EXACT_DISCLAIMER

    # ---------------------------------------------------------
    # 8. Export upgraded PDF report and multi-NASA CSV dataset
    # ---------------------------------------------------------
    # Generate recommendation set
    with patch.object(NasaPowerClient, "fetch_raw_data", side_effect=lambda *args, **kwargs: NasaPowerClient()._load_demo_fallback(34.0151, 71.5249, "2024-05-01", "2024-07-31")):
        gen_res = client.post("/api/v1/recommendations/generate", json={
            "farm_id": farm_id,
            "priority": "water_efficiency",
            "use_demo_fallback": True
        })
        assert gen_res.status_code == 201
        rec_id = gen_res.json()["recommendation_id"]

        pdf_res = client.post("/api/v1/reports/pdf", json={"recommendation_id": rec_id})
        assert pdf_res.status_code == 200
        assert pdf_res.headers["content-type"] == "application/pdf"
        assert pdf_res.content.startswith(b"%PDF-")

    # CSV export
    csv_res = client.get(f"/api/v1/reports/climate-csv?latitude=34.0151&longitude=71.5249&use_demo_fallback=true")
    assert csv_res.status_code == 200
    csv_text = csv_res.text
    assert "date_iso" in csv_text
    assert "root_zone_soil_moisture_mm_m" in csv_text
    assert "ndvi" in csv_text
    assert "NA" in csv_text
