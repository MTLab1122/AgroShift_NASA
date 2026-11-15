import pytest

VALID_POLYGON = {
    "type": "Polygon",
    "coordinates": [
        [
            [71.5200, 34.0100],
            [71.5300, 34.0100],
            [71.5300, 34.0200],
            [71.5200, 34.0200],
            [71.5200, 34.0100],
        ]
    ]
}

def test_create_farm_with_valid_geojson_polygon(client):
    payload = {
        "name": "Peshawar Field Polygons",
        "latitude": 34.0151,
        "longitude": 71.5249,
        "area_value": 4.5,
        "area_unit": "acres",
        "soil_type": "loamy",
        "irrigation_type": "tube_well",
        "water_availability": "medium",
        "field_boundary": VALID_POLYGON,
        "field_boundary_source": "map_drawn",
        "area_source": "map_calculated",
    }
    response = client.post("/api/v1/farms", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Peshawar Field Polygons"
    assert data["field_boundary"] is not None
    assert data["field_boundary"]["type"] == "Polygon"
    assert len(data["field_boundary"]["coordinates"][0]) == 5
    assert data["field_boundary_source"] == "map_drawn"
    assert data["area_source"] == "map_calculated"
    assert data["area_value"] == 4.5
    assert data["area_unit"] == "acres"

def test_create_farm_without_boundary_success(client):
    payload = {
        "name": "Point Only Farm",
        "latitude": 34.0151,
        "longitude": 71.5249,
        "area_value": 2.0,
        "area_unit": "acres",
        "soil_type": "loamy",
        "irrigation_type": "tube_well",
        "water_availability": "medium",
        "field_boundary": None,
        "field_boundary_source": "unknown",
        "area_source": "manual_entry",
    }
    response = client.post("/api/v1/farms", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["field_boundary"] is None
    assert data["field_boundary_source"] == "unknown"
    assert data["area_source"] == "manual_entry"

def test_invalid_polygon_type_rejection(client):
    bad_type_polygon = {
        "type": "LineString",
        "coordinates": [
            [71.52, 34.01],
            [71.53, 34.02],
        ]
    }
    payload = {
        "name": "Bad Type Farm",
        "latitude": 34.0151,
        "longitude": 71.5249,
        "area_value": 3.0,
        "area_unit": "acres",
        "soil_type": "loamy",
        "irrigation_type": "tube_well",
        "water_availability": "medium",
        "field_boundary": bad_type_polygon,
        "field_boundary_source": "map_drawn",
        "area_source": "map_calculated",
    }
    response = client.post("/api/v1/farms", json=payload)
    assert response.status_code == 422
    err = response.json()
    assert err["error_code"] == "VALIDATION_ERROR"
    assert "field_boundary" in str(err)

def test_invalid_coordinate_count_rejection(client):
    # Less than 4 points
    bad_count = {
        "type": "Polygon",
        "coordinates": [
            [
                [71.52, 34.01],
                [71.53, 34.02],
                [71.52, 34.01],
            ]
        ]
    }
    payload = {
        "name": "Too Few Points Farm",
        "latitude": 34.0151,
        "longitude": 71.5249,
        "area_value": 3.0,
        "area_unit": "acres",
        "soil_type": "loamy",
        "irrigation_type": "tube_well",
        "water_availability": "medium",
        "field_boundary": bad_count,
        "field_boundary_source": "map_drawn",
        "area_source": "map_calculated",
    }
    response = client.post("/api/v1/farms", json=payload)
    assert response.status_code == 422
    assert response.json()["error_code"] == "VALIDATION_ERROR"

def test_unclosed_polygon_rejection(client):
    unclosed = {
        "type": "Polygon",
        "coordinates": [
            [
                [71.52, 34.01],
                [71.53, 34.01],
                [71.53, 34.02],
                [71.52, 34.03],
            ]
        ]
    }
    payload = {
        "name": "Unclosed Polygon Farm",
        "latitude": 34.0151,
        "longitude": 71.5249,
        "area_value": 3.0,
        "area_unit": "acres",
        "soil_type": "loamy",
        "irrigation_type": "tube_well",
        "water_availability": "medium",
        "field_boundary": unclosed,
        "field_boundary_source": "map_drawn",
        "area_source": "map_calculated",
    }
    response = client.post("/api/v1/farms", json=payload)
    assert response.status_code == 422
    assert response.json()["error_code"] == "VALIDATION_ERROR"

def test_invalid_longitude_rejection(client):
    bad_lon = {
        "type": "Polygon",
        "coordinates": [
            [
                [-195.0, 34.01],
                [71.53, 34.01],
                [71.53, 34.02],
                [71.52, 34.02],
                [-195.0, 34.01],
            ]
        ]
    }
    payload = {
        "name": "Bad Lon Polygon Farm",
        "latitude": 34.0151,
        "longitude": 71.5249,
        "area_value": 3.0,
        "area_unit": "acres",
        "soil_type": "loamy",
        "irrigation_type": "tube_well",
        "water_availability": "medium",
        "field_boundary": bad_lon,
    }
    response = client.post("/api/v1/farms", json=payload)
    assert response.status_code == 422
    assert response.json()["error_code"] == "VALIDATION_ERROR"

def test_invalid_latitude_rejection(client):
    bad_lat = {
        "type": "Polygon",
        "coordinates": [
            [
                [71.52, 95.0],
                [71.53, 34.01],
                [71.53, 34.02],
                [71.52, 34.02],
                [71.52, 95.0],
            ]
        ]
    }
    payload = {
        "name": "Bad Lat Polygon Farm",
        "latitude": 34.0151,
        "longitude": 71.5249,
        "area_value": 3.0,
        "area_unit": "acres",
        "soil_type": "loamy",
        "irrigation_type": "tube_well",
        "water_availability": "medium",
        "field_boundary": bad_lat,
    }
    response = client.post("/api/v1/farms", json=payload)
    assert response.status_code == 422
    assert response.json()["error_code"] == "VALIDATION_ERROR"

def test_self_intersecting_polygon_rejection(client):
    # Figure 8 (bow-tie) self-intersection
    bowtie = {
        "type": "Polygon",
        "coordinates": [
            [
                [0.0, 0.0],
                [2.0, 2.0],
                [2.0, 0.0],
                [0.0, 2.0],
                [0.0, 0.0],
            ]
        ]
    }
    payload = {
        "name": "Self Intersecting Farm",
        "latitude": 34.0151,
        "longitude": 71.5249,
        "area_value": 3.0,
        "area_unit": "acres",
        "soil_type": "loamy",
        "irrigation_type": "tube_well",
        "water_availability": "medium",
        "field_boundary": bowtie,
    }
    response = client.post("/api/v1/farms", json=payload)
    assert response.status_code == 422
    assert response.json()["error_code"] == "VALIDATION_ERROR"

def test_area_value_less_than_or_equal_zero_rejection(client):
    payload = {
        "name": "Zero Area Farm",
        "latitude": 34.0151,
        "longitude": 71.5249,
        "area_value": 0.0,
        "area_unit": "acres",
        "soil_type": "loamy",
        "irrigation_type": "tube_well",
        "water_availability": "medium",
    }
    response = client.post("/api/v1/farms", json=payload)
    assert response.status_code == 422
    assert response.json()["error_code"] == "VALIDATION_ERROR"

def test_invalid_area_unit_rejection(client):
    payload = {
        "name": "Invalid Unit Farm",
        "latitude": 34.0151,
        "longitude": 71.5249,
        "area_value": 5.0,
        "area_unit": "square_miles",
        "soil_type": "loamy",
        "irrigation_type": "tube_well",
        "water_availability": "medium",
    }
    response = client.post("/api/v1/farms", json=payload)
    assert response.status_code == 422
    assert response.json()["error_code"] == "VALIDATION_ERROR"

def test_map_calculated_without_boundary_rejection(client):
    payload = {
        "name": "No Boundary Map Calc Farm",
        "latitude": 34.0151,
        "longitude": 71.5249,
        "area_value": 5.0,
        "area_unit": "acres",
        "soil_type": "loamy",
        "irrigation_type": "tube_well",
        "water_availability": "medium",
        "field_boundary": None,
        "area_source": "map_calculated",
    }
    response = client.post("/api/v1/farms", json=payload)
    assert response.status_code == 422
    assert response.json()["error_code"] == "VALIDATION_ERROR"

def test_boundary_returned_in_farm_detail(client):
    payload = {
        "name": "Detail Farm With Boundary",
        "latitude": 34.0151,
        "longitude": 71.5249,
        "area_value": 6.2,
        "area_unit": "hectares",
        "soil_type": "clay",
        "irrigation_type": "canal",
        "water_availability": "high",
        "field_boundary": VALID_POLYGON,
        "field_boundary_source": "map_drawn",
        "area_source": "map_calculated",
    }
    res = client.post("/api/v1/farms", json=payload)
    farm_id = res.json()["farm_id"]

    detail_res = client.get(f"/api/v1/farms/{farm_id}")
    assert detail_res.status_code == 200
    data = detail_res.json()
    assert data["field_boundary"]["type"] == "Polygon"
    assert data["field_boundary"]["coordinates"] == VALID_POLYGON["coordinates"]
    assert data["field_boundary_source"] == "map_drawn"
    assert data["area_source"] == "map_calculated"
    assert data["area_value"] == 6.2
    assert data["area_unit"] == "hectares"

def test_boundary_updated_through_farm_update(client):
    # Create farm
    payload = {
        "name": "Updatable Farm",
        "latitude": 34.0151,
        "longitude": 71.5249,
        "area_value": 3.0,
        "area_unit": "acres",
        "soil_type": "loamy",
        "irrigation_type": "tube_well",
        "water_availability": "medium",
        "field_boundary": None,
        "field_boundary_source": "unknown",
        "area_source": "manual_entry",
    }
    res = client.post("/api/v1/farms", json=payload)
    farm_id = res.json()["farm_id"]

    # Update with new boundary
    update_payload = {
        "field_boundary": VALID_POLYGON,
        "field_boundary_source": "map_drawn",
        "area_source": "map_calculated",
        "area_value": 5.4,
    }
    up_res = client.put(f"/api/v1/farms/{farm_id}", json=update_payload)
    assert up_res.status_code == 200
    up_data = up_res.json()
    assert up_data["field_boundary"] is not None
    assert up_data["area_value"] == 5.4
    assert up_data["field_boundary_source"] == "map_drawn"
    assert up_data["area_source"] == "map_calculated"

def test_boundary_removed_safely(client):
    # Create farm with boundary
    payload = {
        "name": "Farm To Clear Boundary",
        "latitude": 34.0151,
        "longitude": 71.5249,
        "area_value": 5.0,
        "area_unit": "acres",
        "soil_type": "loamy",
        "irrigation_type": "tube_well",
        "water_availability": "medium",
        "field_boundary": VALID_POLYGON,
        "field_boundary_source": "map_drawn",
        "area_source": "map_calculated",
    }
    res = client.post("/api/v1/farms", json=payload)
    farm_id = res.json()["farm_id"]

    # Clear boundary
    clear_payload = {
        "field_boundary": None,
        "field_boundary_source": "unknown",
        "area_source": "manual_entry",
    }
    up_res = client.put(f"/api/v1/farms/{farm_id}", json=clear_payload)
    assert up_res.status_code == 200
    up_data = up_res.json()
    assert up_data["field_boundary"] is None
    assert up_data["field_boundary_source"] == "unknown"
    assert up_data["area_source"] == "manual_entry"
