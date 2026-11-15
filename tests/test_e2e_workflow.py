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

@pytest.fixture
def client():
    with TestClient(app) as test_client:
        yield test_client

def test_complete_e2e_pipeline(client):
    """
    Executes the complete 9-step judge demo pipeline end-to-end:
    1. Health check
    2. Create farm
    3. Add crop history
    4. Fetch climate summary
    5. Verify NASA POWER or demo-fallback contract
    6. Generate 3 recommendations
    7. Compare scenarios
    8. Export PDF
    9. Export climate CSV
    """
    # ---------------------------------------------------------
    # 1. Health check
    # ---------------------------------------------------------
    h1 = client.get("/health")
    assert h1.status_code == 200
    assert h1.json() == {"status": "ok", "service": "agroshift-api", "version": "1.0.0"}

    h2 = client.get("/api/v1/health")
    assert h2.status_code == 200
    assert h2.json() == {"status": "ok", "service": "agroshift-api", "version": "1.0.0"}

    # ---------------------------------------------------------
    # 2. Create farm
    # ---------------------------------------------------------
    farm_payload = {
        "name": "Charsadda Riverine Trial Farm",
        "latitude": 34.1483,
        "longitude": 71.7406,
        "area_value": 7.5,
        "area_unit": "acres",
        "soil_type": "loamy",
        "irrigation_type": "tube_well",
        "water_availability": "medium"
    }
    farm_res = client.post("/api/v1/farms", json=farm_payload)
    assert farm_res.status_code == 201
    farm_data = farm_res.json()
    farm_id = farm_data["farm_id"]
    assert farm_data["name"] == "Charsadda Riverine Trial Farm"
    assert farm_data["latitude"] == 34.1483
    assert farm_data["longitude"] == 71.7406

    # ---------------------------------------------------------
    # 3. Add crop history
    # ---------------------------------------------------------
    hist_payload = {
        "crop_name": "Wheat (Gandum)",
        "season": "rabi",
        "start_date": "2025-11-15",
        "end_date": "2026-04-20",
        "notes": "Preceding crop in Charsadda double cropping cycle."
    }
    hist_res = client.post(f"/api/v1/farms/{farm_id}/crop-history", json=hist_payload)
    assert hist_res.status_code == 201
    hist_data = hist_res.json()
    assert hist_data["farm_id"] == farm_id
    assert hist_data["crop_name"] == "Wheat (Gandum)"

    # Verify listing
    hist_list = client.get(f"/api/v1/farms/{farm_id}/crop-history")
    assert hist_list.status_code == 200
    assert len(hist_list.json()) == 1

    # ---------------------------------------------------------
    # 4 & 5. Fetch climate summary & verify contract
    # ---------------------------------------------------------
    with patch.object(NasaPowerClient, "fetch_raw_data", side_effect=lambda *args, **kwargs: NasaPowerClient()._load_demo_fallback(34.1483, 71.7406, "2026-05-01", "2026-07-31")):
        clim_res = client.get(f"/api/v1/climate/summary?farm_id={farm_id}&use_demo_fallback=true")
        assert clim_res.status_code == 200
        clim_data = clim_res.json()

        # Contract checks
        assert "NASA POWER" in clim_data["source"]
        assert clim_data["dataset_or_endpoint"] is not None
        assert clim_data["latitude"] == 34.1483
        assert clim_data["longitude"] == 71.7406
        assert "T2M" in clim_data["parameters"]
        assert "parameter_units" in clim_data
        assert clim_data["parameter_units"]["T2M"] == "°C"
        assert clim_data["is_demo_data"] is True
        assert clim_data["missing_data"]["missing_days_count"] >= 1
        assert clim_data["overall"]["t2m_mean"] is not None

        # Verify daily history preserves missing observations as null (never 0)
        hist_clim = client.get(f"/api/v1/climate/history?farm_id={farm_id}&use_demo_fallback=true")
        assert hist_clim.status_code == 200
        records = hist_clim.json()["records"]
        gaps = [r for r in records if r["t2m"] is None]
        assert len(gaps) > 0, "Daily records must contain null gaps for fill-values"
        for gap in gaps:
            assert gap["t2m"] is None
            assert gap["t2m"] != 0

        # ---------------------------------------------------------
        # 6. Generate 3 recommendations
        # ---------------------------------------------------------
        gen_res = client.post("/api/v1/recommendations/generate", json={
            "farm_id": farm_id,
            "priority": "balanced",
            "use_demo_fallback": True
        })
        assert gen_res.status_code == 201
        rec_data = gen_res.json()
        assert rec_data["farm_id"] == farm_id
        assert len(rec_data["scenarios"]) == 3
        rec_id = rec_data["recommendation_id"]

        scen_ids = [s["scenario_id"] for s in rec_data["scenarios"]]
        assert scen_ids == ["baseline", "pulse_inclusive", "soil_cover"]

        # Pulse inclusive must include nitrogen-fixing legume
        pulse_scen = next(s for s in rec_data["scenarios"] if s["scenario_id"] == "pulse_inclusive")
        legumes = ["chickpea", "lentil", "mung_bean", "berseem_clover"]
        assert any(c in legumes for c in pulse_scen["crop_sequence"])

        # Soil cover scenario must include berseem_clover
        cover_scen = next(s for s in rec_data["scenarios"] if s["scenario_id"] == "soil_cover")
        assert "berseem_clover" in cover_scen["crop_sequence"]

        # Complete scenario validation
        for s in rec_data["scenarios"]:
            assert len(s["crop_sequence"]) > 0
            assert len(s["seasonal_calendar"]) > 0
            assert len(s["rationale"]) > 0
            assert len(s["benefits"]) > 0
            assert len(s["risks"]) > 0
            assert len(s["assumptions"]) > 0
            assert s["score"] is not None
            assert 0 <= s["score"] <= 100

        # ---------------------------------------------------------
        # 7. Compare scenarios
        # ---------------------------------------------------------
        comp_res = client.post("/api/v1/recommendations/compare", json={
            "recommendation_id": rec_id,
            "scenario_ids": ["baseline", "pulse_inclusive", "soil_cover"]
        })
        assert comp_res.status_code == 200
        comp_data = comp_res.json()
        assert len(comp_data["scenarios"]) == 3
        assert "water_savings" in comp_data["tradeoffs"]
        assert "soil_regeneration" in comp_data["tradeoffs"]

        # ---------------------------------------------------------
        # 8. Export PDF
        # ---------------------------------------------------------
        pdf_res = client.post("/api/v1/reports/pdf", json={"recommendation_id": rec_id})
        assert pdf_res.status_code == 200
        assert pdf_res.headers["content-type"] == "application/pdf"
        assert pdf_res.content.startswith(b"%PDF-")
        assert "AgroShift_Report_" in pdf_res.headers["content-disposition"]

        # ---------------------------------------------------------
        # 9. Export Climate CSV
        # ---------------------------------------------------------
        csv_res = client.get(f"/api/v1/reports/climate-csv?farm_id={farm_id}&use_demo_fallback=true")
        assert csv_res.status_code == 200
        assert "text/csv" in csv_res.headers["content-type"]
        csv_content = csv_res.text
        assert "# AgroShift Climate Export" in csv_content
        assert "date_iso" in csv_content
        assert "t2m_c" in csv_content or "t2m_mean_" in csv_content
        assert "NA" in csv_content
