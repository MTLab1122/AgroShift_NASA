import json
from pathlib import Path
from app.core.config import settings

def test_climate_demo_fixture_missing_values():
    climate_demo_path = settings.DEMO_DATA_DIR / "climate.demo.json"
    assert climate_demo_path.exists()
    
    with open(climate_demo_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    assert data["is_demo_data"] is True
    assert data["latitude"] == 34.0151
    assert data["longitude"] == 71.5249
    assert data["source"] is not None
    assert "parameters" in data
    assert "parameter_units" in data
    
    # Check that missing data days have explicit nulls and not 0 or false
    records = data["records"]
    null_records = [r for r in records if r["t2m"] is None]
    assert len(null_records) > 0, "Demo fixture must have missing data points to demonstrate null-preservation"
    
    for r in null_records:
        assert r["t2m"] is None
        assert r["t2m"] != 0
        assert r["t2m"] is not False
        assert r["prectotcorr"] is None
        assert r["prectotcorr"] != 0

def test_crop_catalog_peshawar():
    catalog_path = settings.CROP_CATALOG_PATH
    assert catalog_path.exists()
    
    with open(catalog_path, "r", encoding="utf-8") as f:
        crops = json.load(f)

    assert len(crops) == 9
    crop_ids = {c["crop_id"] for c in crops}
    expected_ids = {
        "wheat", "maize", "rice", "sugarcane", "mustard",
        "chickpea", "lentil", "mung_bean", "berseem_clover"
    }
    assert crop_ids == expected_ids
    
    # Verify legumes are properly flagged
    legumes = {c["crop_id"] for c in crops if c["is_legume"]}
    assert "chickpea" in legumes
    assert "lentil" in legumes
    assert "mung_bean" in legumes
    assert "berseem_clover" in legumes
    assert "wheat" not in legumes
