from typing import Any, Dict, Optional

VOICE_INTENT_MAP = {
    # Crop mappings
    "wheat": ("current_crop", "wheat"),
    "gandum": ("current_crop", "wheat"),
    "گندم": ("current_crop", "wheat"),
    "maize": ("current_crop", "maize"),
    "makai": ("current_crop", "maize"),
    "مکئی": ("current_crop", "maize"),
    "rice": ("current_crop", "rice"),
    "chawal": ("current_crop", "rice"),
    "چاول": ("current_crop", "rice"),

    # Irrigation mappings
    "tube well": ("irrigation_type", "tube_well"),
    "tubewell": ("irrigation_type", "tube_well"),
    "ٹیوب ویل": ("irrigation_type", "tube_well"),
    "ٹیوبویل": ("irrigation_type", "tube_well"),
    "canal": ("irrigation_type", "canal"),
    "nehr": ("irrigation_type", "canal"),
    "نہر": ("irrigation_type", "canal"),

    # Water availability
    "low water": ("water_availability", "low"),
    "kam pani": ("water_availability", "low"),
    "کم پانی": ("water_availability", "low"),
    "medium water": ("water_availability", "medium"),
    "darmiyana pani": ("water_availability", "medium"),
    "درمیانہ پانی": ("water_availability", "medium"),
    "high water": ("water_availability", "high"),
    "ziyada pani": ("water_availability", "high"),
    "زیادہ پانی": ("water_availability", "high"),

    # Primary goal
    "save water": ("primary_goal", "water_efficiency"),
    "water efficiency": ("primary_goal", "water_efficiency"),
    "pani bachao": ("primary_goal", "water_efficiency"),
    "پانی بچاؤ": ("primary_goal", "water_efficiency"),
    "fix soil": ("primary_goal", "soil_health"),
    "soil health": ("primary_goal", "soil_health"),
    "mitti behtar": ("primary_goal", "soil_health"),
    "مٹی بہتر کرو": ("primary_goal", "soil_health"),
    "more income": ("primary_goal", "cash_yield"),
    "cash yield": ("primary_goal", "cash_yield"),
    "income": ("primary_goal", "cash_yield"),
    "ziyada amdani": ("primary_goal", "cash_yield"),
    "زیادہ آمدنی": ("primary_goal", "cash_yield"),
    "balanced": ("primary_goal", "balanced"),
    "barabar": ("primary_goal", "balanced"),
    "متوازن": ("primary_goal", "balanced"),
}

def parse_voice_transcript(transcript: Optional[str]) -> Dict[str, Any]:
    """
    Parses spoken English or Urdu transcript into structured form intents.
    Returns dictionary with parsed fields, or preserves 'unknown' / None when unrecognized.
    Never treats unrecognized speech as a valid value.
    """
    if not transcript or not transcript.strip():
        return {
            "field": "unknown",
            "value": "unknown",
            "confidence": "none",
            "recognized": False
        }

    clean_text = transcript.strip().lower()

    parsed_fields: Dict[str, str] = {}
    matched_patterns = []
    primary_field = None
    primary_value = None

    for pattern, (field_name, field_value) in VOICE_INTENT_MAP.items():
        if pattern in clean_text:
            matched_patterns.append(pattern)
            if field_name not in parsed_fields:
                parsed_fields[field_name] = field_value
            if primary_field is None:
                primary_field = field_name
                primary_value = field_value

    if primary_field:
        return {
            "field": primary_field,
            "value": primary_value,
            "parsed_fields": parsed_fields,
            "matched_pattern": matched_patterns[0],
            "matched_patterns": matched_patterns,
            "confidence": "high",
            "recognized": True
        }

    # If not recognized, do not invent or default
    return {
        "field": "unknown",
        "value": "unknown",
        "parsed_fields": {},
        "raw_text": transcript,
        "confidence": "none",
        "recognized": False
    }
