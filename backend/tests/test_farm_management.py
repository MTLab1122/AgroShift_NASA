import pytest

def test_create_farm_success(client):
    payload = {
        "name": "Charsadda Trial Farm",
        "latitude": 34.1483,
        "longitude": 71.7406,
        "area_value": 3.5,
        "area_unit": "acres",
        "soil_type": "clay",
        "irrigation_type": "canal",
        "water_availability": "high"
    }
    response = client.post("/api/v1/farms", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Charsadda Trial Farm"
    assert data["latitude"] == 34.1483
    assert data["longitude"] == 71.7406
    assert data["area_value"] == 3.5
    assert data["area_unit"] == "acres"
    assert data["soil_type"] == "clay"
    assert data["irrigation_type"] == "canal"
    assert data["water_availability"] == "high"
    assert data["is_demo_data"] is False
    assert "farm_id" in data
    assert "created_at" in data

def test_latitude_longitude_bounds_validation(client):
    # Invalid latitude > 90
    bad_lat = {
        "name": "Bad Lat Farm",
        "latitude": 95.0,
        "longitude": 71.5,
        "area_value": 2.0,
        "area_unit": "acres",
        "soil_type": "loamy",
        "irrigation_type": "tube_well",
        "water_availability": "medium"
    }
    r1 = client.post("/api/v1/farms", json=bad_lat)
    assert r1.status_code == 422
    err1 = r1.json()
    assert err1["error_code"] == "VALIDATION_ERROR"
    assert err1["request_id"] is not None

    # Invalid longitude < -180
    bad_lon = {
        "name": "Bad Lon Farm",
        "latitude": 34.0,
        "longitude": -190.0,
        "area_value": 2.0,
        "area_unit": "acres",
        "soil_type": "loamy",
        "irrigation_type": "tube_well",
        "water_availability": "medium"
    }
    r2 = client.post("/api/v1/farms", json=bad_lon)
    assert r2.status_code == 422
    assert r2.json()["error_code"] == "VALIDATION_ERROR"

def test_area_value_and_unit_validation(client):
    # area_value <= 0 is invalid
    bad_area = {
        "name": "Zero Area Farm",
        "latitude": 34.0,
        "longitude": 71.5,
        "area_value": 0.0,
        "area_unit": "acres",
        "soil_type": "loamy",
        "irrigation_type": "tube_well",
        "water_availability": "medium"
    }
    r = client.post("/api/v1/farms", json=bad_area)
    assert r.status_code == 422
    assert r.json()["error_code"] == "VALIDATION_ERROR"

    # Invalid unit (not acres or hectares)
    bad_unit = {
        "name": "Bad Unit Farm",
        "latitude": 34.0,
        "longitude": 71.5,
        "area_value": 5.0,
        "area_unit": "square_miles",
        "soil_type": "loamy",
        "irrigation_type": "tube_well",
        "water_availability": "medium"
    }
    r_unit = client.post("/api/v1/farms", json=bad_unit)
    assert r_unit.status_code == 422
    assert r_unit.json()["error_code"] == "VALIDATION_ERROR"

def test_unknown_value_preservation(client):
    payload = {
        "name": "Unknown Assessment Plot",
        "latitude": 34.01,
        "longitude": 71.52,
        "area_value": 1.5,
        "area_unit": "hectares",
        "soil_type": "unknown",
        "irrigation_type": "unknown",
        "water_availability": "unknown"
    }
    response = client.post("/api/v1/farms", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["soil_type"] == "unknown"
    assert data["irrigation_type"] == "unknown"
    assert data["water_availability"] == "unknown"

def test_crop_history_crud_and_date_order(client):
    # First create a farm
    farm_res = client.post("/api/v1/farms", json={
        "name": "Rotation Test Farm",
        "latitude": 34.05,
        "longitude": 71.55,
        "area_value": 4.0,
        "area_unit": "acres",
        "soil_type": "loamy",
        "irrigation_type": "tube_well",
        "water_availability": "medium"
    })
    farm_id = farm_res.json()["farm_id"]

    # Add valid crop history
    hist_payload = {
        "crop_name": "Wheat (Gandum)",
        "season": "rabi",
        "start_date": "2025-11-15",
        "end_date": "2026-04-20",
        "notes": "Winter cycle"
    }
    c_res = client.post(f"/api/v1/farms/{farm_id}/crop-history", json=hist_payload)
    assert c_res.status_code == 201
    hist_data = c_res.json()
    assert hist_data["farm_id"] == farm_id
    assert hist_data["crop_name"] == "Wheat (Gandum)"
    entry_id = hist_data["entry_id"]

    # Invalid date order: end_date < start_date
    bad_dates = {
        "crop_name": "Invalid Maize",
        "season": "kharif",
        "start_date": "2026-06-01",
        "end_date": "2026-05-01"
    }
    bad_res = client.post(f"/api/v1/farms/{farm_id}/crop-history", json=bad_dates)
    assert bad_res.status_code == 422
    assert bad_res.json()["error_code"] == "VALIDATION_ERROR"

    # List crop history
    list_res = client.get(f"/api/v1/farms/{farm_id}/crop-history")
    assert list_res.status_code == 200
    assert len(list_res.json()) == 1

    # Update crop history
    up_res = client.put(f"/api/v1/farms/{farm_id}/crop-history/{entry_id}", json={
        "notes": "Updated note with soil test details"
    })
    assert up_res.status_code == 200
    assert up_res.json()["notes"] == "Updated note with soil test details"

    # Delete crop history
    del_res = client.delete(f"/api/v1/farms/{farm_id}/crop-history/{entry_id}")
    assert del_res.status_code == 200
    assert client.get(f"/api/v1/farms/{farm_id}/crop-history").json() == []

def test_farm_deletion_cascade(client):
    farm_res = client.post("/api/v1/farms", json={
        "name": "Cascade Test Farm",
        "latitude": 34.0,
        "longitude": 71.5,
        "area_value": 2.0,
        "area_unit": "acres",
        "soil_type": "loamy",
        "irrigation_type": "tube_well",
        "water_availability": "medium"
    })
    farm_id = farm_res.json()["farm_id"]

    # Add entry
    client.post(f"/api/v1/farms/{farm_id}/crop-history", json={
        "crop_name": "Mustard",
        "season": "rabi"
    })

    # Delete farm
    del_res = client.delete(f"/api/v1/farms/{farm_id}")
    assert del_res.status_code == 200

    # Ensure farm is 404
    get_res = client.get(f"/api/v1/farms/{farm_id}")
    assert get_res.status_code == 404
    assert get_res.json()["error_code"] == "NOT_FOUND"
