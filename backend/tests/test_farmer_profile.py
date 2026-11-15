import pytest

def test_create_and_get_farmer(client):
    payload = {
        "full_name": "Gul Khan",
        "phone_number": "+92-300-1234567",
        "preferred_language": "ur",
        "literacy_support_mode": "voice",
        "district": "peshawar",
        "village_or_settlement": "Palosi"
    }
    res = client.post("/api/v1/farmers", json=payload)
    assert res.status_code == 201
    data = res.json()
    farmer_id = data["farmer_id"]
    assert data["full_name"] == "Gul Khan"
    assert data["preferred_language"] == "ur"
    assert data["literacy_support_mode"] == "voice"
    assert data["district"] == "peshawar"
    assert data["village_or_settlement"] == "Palosi"
    # Verify phone number is masked
    assert data["phone_number"] == "***-***-4567"
    assert "+92-300-1234567" not in data["phone_number"]

    # Get farmer
    get_res = client.get(f"/api/v1/farmers/{farmer_id}")
    assert get_res.status_code == 200
    assert get_res.json()["farmer_id"] == farmer_id
    assert get_res.json()["phone_number"] == "***-***-4567"

def test_farmer_crud_and_link_farm(client):
    # Create farm
    farm_res = client.post("/api/v1/farms", json={
        "name": "Taru Jabba Field",
        "latitude": 34.01,
        "longitude": 71.65,
        "area_value": 4.0,
        "area_unit": "acres",
        "soil_type": "loamy",
        "irrigation_type": "tube_well",
        "water_availability": "medium"
    })
    farm_id = farm_res.json()["farm_id"]

    # Create farmer linked to farm
    farmer_res = client.post("/api/v1/farmers", json={
        "full_name": "Tariq Mehmood",
        "district": "charsadda",
        "farm_id": farm_id
    })
    assert farmer_res.status_code == 201
    farmer_id = farmer_res.json()["farmer_id"]
    assert farmer_res.json()["farm_id"] == farm_id

    # List farmer farms
    farms_list = client.get(f"/api/v1/farmers/{farmer_id}/farms")
    assert farms_list.status_code == 200
    assert len(farms_list.json()) >= 1
    assert any(f["farm_id"] == farm_id for f in farms_list.json())

    # Update farmer
    up_res = client.put(f"/api/v1/farmers/{farmer_id}", json={
        "village_or_settlement": "Utmanzai"
    })
    assert up_res.status_code == 200
    assert up_res.json()["village_or_settlement"] == "Utmanzai"

    # Delete farmer
    del_res = client.delete(f"/api/v1/farmers/{farmer_id}")
    assert del_res.status_code == 200

    # 404 check
    assert client.get(f"/api/v1/farmers/{farmer_id}").status_code == 404
