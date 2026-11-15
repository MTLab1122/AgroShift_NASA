from unittest.mock import patch
from app.modules.nasa_data.power_client import NasaPowerClient

def test_export_pdf_and_csv(client):
    with patch.object(NasaPowerClient, "fetch_raw_data", side_effect=lambda *args, **kwargs: NasaPowerClient()._load_demo_fallback(34.0151, 71.5249, "2026-05-01", "2026-07-31")):
        # 1. Generate recommendation
        gen_res = client.post("/api/v1/recommendations/generate", json={
            "farm_id": "demo-peshawar-001",
            "priority": "balanced",
            "use_demo_fallback": True
        })
        assert gen_res.status_code == 201
        rec_id = gen_res.json()["recommendation_id"]

        # 2. Export PDF
        pdf_res = client.post("/api/v1/reports/pdf", json={"recommendation_id": rec_id})
        assert pdf_res.status_code == 200
        assert pdf_res.headers["content-type"] == "application/pdf"
        assert "attachment; filename=" in pdf_res.headers["content-disposition"]
        # PDF magic bytes
        assert pdf_res.content.startswith(b"%PDF-")

        # 3. Export Climate CSV
        csv_res = client.get("/api/v1/reports/climate-csv?latitude=34.0151&longitude=71.5249&use_demo_fallback=true")
        assert csv_res.status_code == 200
        assert "text/csv" in csv_res.headers["content-type"]
        csv_text = csv_res.text
        # Verify metadata comments
        assert "# AgroShift Climate Export" in csv_text
        assert "# Period:" in csv_text
        assert "date_iso" in csv_text
        # Verify missing data is NA, never 0
        assert "NA" in csv_text
