from app.modules.farm_management.voice_parser import parse_voice_transcript

def test_voice_english_intent_mapping():
    assert parse_voice_transcript("Wheat")["value"] == "wheat"
    assert parse_voice_transcript("Maize")["value"] == "maize"
    assert parse_voice_transcript("Rice")["value"] == "rice"
    assert parse_voice_transcript("Tube well")["value"] == "tube_well"
    assert parse_voice_transcript("Canal")["value"] == "canal"
    assert parse_voice_transcript("Low water")["value"] == "low"
    assert parse_voice_transcript("Save water")["value"] == "water_efficiency"
    assert parse_voice_transcript("Fix soil")["value"] == "soil_health"
    assert parse_voice_transcript("More income")["value"] == "cash_yield"

def test_voice_urdu_intent_mapping():
    assert parse_voice_transcript("گندم")["value"] == "wheat"
    assert parse_voice_transcript("مکئی")["value"] == "maize"
    assert parse_voice_transcript("چاول")["value"] == "rice"
    assert parse_voice_transcript("ٹیوب ویل")["value"] == "tube_well"
    assert parse_voice_transcript("نہر")["value"] == "canal"
    assert parse_voice_transcript("کم پانی")["value"] == "low"
    assert parse_voice_transcript("پانی بچاؤ")["value"] == "water_efficiency"
    assert parse_voice_transcript("مٹی بہتر کرو")["value"] == "soil_health"
    assert parse_voice_transcript("زیادہ آمدنی")["value"] == "cash_yield"

def test_voice_unrecognized_returns_unknown():
    res1 = parse_voice_transcript("random unrelated talking")
    assert res1["value"] == "unknown"
    assert res1["recognized"] is False

    res2 = parse_voice_transcript("")
    assert res2["value"] == "unknown"
    assert res2["recognized"] is False

def test_voice_parse_api_endpoint(client):
    res = client.post("/api/v1/farmers/parse-voice", json={"transcript": "گندم"})
    assert res.status_code == 200
    assert res.json()["value"] == "wheat"

    bad_res = client.post("/api/v1/farmers/parse-voice", json={"transcript": "gibberish text 12345"})
    assert bad_res.status_code == 200
    assert bad_res.json()["value"] == "unknown"
