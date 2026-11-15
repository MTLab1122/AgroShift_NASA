"""
Comprehensive Runtime and API Verification Script for AgroShift.
"""

import urllib.request
import urllib.parse
import json
import sys

def test_endpoint(name, url, method="GET", data=None, headers=None, expected_status=200):
    req_headers = headers or {}
    req_data = None
    if data:
        if isinstance(data, dict):
            req_data = json.dumps(data).encode("utf-8")
            req_headers["Content-Type"] = "application/json"
        elif isinstance(data, bytes):
            req_data = data
            
    req = urllib.request.Request(url, data=req_data, headers=req_headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=20) as resp:
            status = resp.status
            content = resp.read()
            if status != expected_status:
                print(f"[FAIL] {name}: Expected {expected_status}, got {status}")
                return False, status, None
            print(f"[PASS] {name} (HTTP {status})")
            return True, status, content
    except urllib.error.HTTPError as e:
        if e.code == expected_status:
            print(f"[PASS] {name} (Expected HTTP {e.code})")
            return True, e.code, e.read()
        print(f"[FAIL] {name}: HTTP {e.code} - {e.reason}")
        return False, e.code, None
    except Exception as e:
        print(f"[FAIL] {name}: Exception {e}")
        return False, 0, None

def run_all():
    print("=== STARTING AGROSHIFT RUNTIME VERIFICATION ===")
    all_passed = True
    
    # 1. Health
    p, _, c = test_endpoint("Health /health", "http://localhost:8000/health")
    all_passed = all_passed and p
    p, _, c = test_endpoint("Health /api/v1/health", "http://localhost:8000/api/v1/health")
    all_passed = all_passed and p
    
    # 2. Docs & OpenAPI
    p, _, _ = test_endpoint("Swagger UI /docs", "http://localhost:8000/docs")
    all_passed = all_passed and p
    p, _, _ = test_endpoint("OpenAPI JSON /openapi.json", "http://localhost:8000/openapi.json")
    all_passed = all_passed and p
    
    # 3. Farms API
    p, _, c = test_endpoint("List Farms", "http://localhost:8000/api/v1/farms")
    all_passed = all_passed and p
    farms = json.loads(c.decode("utf-8")) if c else []
    demo_farm_id = farms[0]["farm_id"] if farms else "demo-peshawar-001"
    
    # 4. Crop Catalogue
    p, _, c = test_endpoint("List Crops", "http://localhost:8000/api/v1/crops")
    all_passed = all_passed and p
    crops = json.loads(c.decode("utf-8")) if c else []
    assert len(crops) == 9, f"Expected 9 crops, got {len(crops)}"
    
    # 5. NASA POWER Direct
    p, _, c = test_endpoint(
        "NASA POWER Direct",
        "http://localhost:8000/api/v1/nasa/power?latitude=34.0151&longitude=71.5249&use_demo_fallback=true"
    )
    all_passed = all_passed and p
    
    # 6. Climate Summary & History
    p, _, c = test_endpoint(
        "Climate Summary",
        f"http://localhost:8000/api/v1/climate/summary?farm_id={demo_farm_id}&use_demo_fallback=true"
    )
    all_passed = all_passed and p
    p, _, c = test_endpoint(
        "Climate History",
        f"http://localhost:8000/api/v1/climate/history?farm_id={demo_farm_id}&use_demo_fallback=true"
    )
    all_passed = all_passed and p
    
    # 7. Earth Observation (SMAP, IMERG, NDVI, POWER)
    p, _, c = test_endpoint(
        "Earth Observation Unified",
        f"http://localhost:8000/api/v1/earth-observation?farm_id={demo_farm_id}&use_demo_fallback=true"
    )
    all_passed = all_passed and p
    if c:
        eo_data = json.loads(c.decode("utf-8"))
        assert eo_data["soil_moisture"]["dry_root_zone_flag"] is True
        assert eo_data["precipitation"]["dry_spell_risk"] is True
        assert eo_data["vegetation"]["low_greenness_flag"] is True
        assert len(eo_data["bare_field_windows"]) >= 1
    
    # 8. Earth Observation Trends (10-Year)
    p, _, c = test_endpoint(
        "10-Year Historical Trends",
        f"http://localhost:8000/api/v1/earth-observation/trends?farm_id={demo_farm_id}&years=10"
    )
    all_passed = all_passed and p
    
    # 9. Three Benchmark Strategies
    p, _, c = test_endpoint(
        "Three-Strategy List",
        f"http://localhost:8000/api/v1/recommendations/strategies?farm_id={demo_farm_id}&primary_goal=water_efficiency"
    )
    all_passed = all_passed and p
    if c:
        strats = json.loads(c.decode("utf-8"))
        assert len(strats) == 3
        strat_ids = [s["strategy_id"] for s in strats]
        assert "baseline" in strat_ids
        assert "water_saver_pulse_fix" in strat_ids
        assert "soil_shield_forage" in strat_ids
    
    # 10. Generate Recommendation Set
    p, _, c = test_endpoint(
        "Generate Recommendations",
        "http://localhost:8000/api/v1/recommendations/generate",
        method="POST",
        data={"farm_id": demo_farm_id, "priority": "water_efficiency", "use_demo_fallback": True},
        expected_status=201
    )
    all_passed = all_passed and p
    rec_set = json.loads(c.decode("utf-8")) if c else {}
    rec_id = rec_set.get("recommendation_id")
    
    # 11. Compare Scenarios
    if rec_id:
        p, _, c = test_endpoint(
            "Compare Scenarios",
            "http://localhost:8000/api/v1/recommendations/compare",
            method="POST",
            data={"recommendation_id": rec_id, "farm_id": demo_farm_id, "primary_goal": "water_efficiency"}
        )
        all_passed = all_passed and p
        
    # 12. PDF Export
    if rec_id:
        p, _, c = test_endpoint(
            "Export PDF Report",
            "http://localhost:8000/api/v1/reports/pdf",
            method="POST",
            data={"recommendation_id": rec_id}
        )
        all_passed = all_passed and p
        if c:
            assert c.startswith(b"%PDF-"), "Exported PDF missing PDF magic bytes"
            
    # 13. CSV Export
    p, _, c = test_endpoint(
        "Export Climate CSV",
        f"http://localhost:8000/api/v1/reports/climate-csv?farm_id={demo_farm_id}&use_demo_fallback=true"
    )
    all_passed = all_passed and p
    if c:
        csv_text = c.decode("utf-8")
        assert "root_zone_soil_moisture_mm_m" in csv_text
        assert "ndvi" in csv_text
        assert "NA" in csv_text
        
    # 14. Voice Parser Endpoint
    p, _, c = test_endpoint(
        "Voice Intent Parser",
        "http://localhost:8000/api/v1/farmers/parse-voice",
        method="POST",
        data={"transcript": "گندم اور ٹیوب ویل پانی بچاؤ"}
    )
    all_passed = all_passed and p
    
    # 15. Frontend Pages
    frontend_routes = [
        ("/", "Root Landing"),
        ("/dashboard", "Command Center"),
        ("/dashboard/farmer", "Farmer Dashboard"),
        ("/recommendations/compare", "3-Strategy Compare"),
        ("/onboarding", "Farmer Onboarding"),
        ("/dashboard/climate", "NASA Climate"),
        ("/dashboard/reports", "Reports"),
        ("/crops", "Crops"),
        ("/farms", "Farms"),
    ]
    for route, label in frontend_routes:
        p, _, _ = test_endpoint(f"Frontend Route {label} ({route})", f"http://localhost:3000{route}")
        all_passed = all_passed and p

    print(f"\nALL RUNTIME VERIFICATIONS PASSED: {all_passed}")
    sys.exit(0 if all_passed else 1)

if __name__ == "__main__":
    run_all()
