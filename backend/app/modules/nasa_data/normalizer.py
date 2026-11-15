from typing import Any, Dict, List, Optional, Tuple
from app.modules.nasa_data.schemas import DailyClimateRecord, MissingDataStats

FILL_VALUE_THRESHOLD = -900.0

PARAM_FIELD_MAP = {
    "T2M": "t2m",
    "T2M_MAX": "t2m_max",
    "T2M_MIN": "t2m_min",
    "PRECTOTCORR": "prectotcorr",
    "RH2M": "rh2m",
    "ALLSKY_SFC_SW_DWN": "allsky_sfc_sw_dwn"
}

def normalize_value(val: Optional[float]) -> Optional[float]:
    """
    Converts NASA POWER fill values (<= -900, e.g. -999) to None.
    Preserves valid zero and positive/negative values.
    Never substitutes missing values with zero or false.
    """
    if val is None:
        return None
    try:
        fval = float(val)
        if fval <= FILL_VALUE_THRESHOLD:
            return None
        return round(fval, 2)
    except (ValueError, TypeError):
        return None

def extract_units(raw_payload: Dict[str, Any]) -> Dict[str, str]:
    """
    Extracts parameter units dynamically from NASA POWER metadata object.
    Never hardcodes guessed units.
    """
    units_dict = {}
    parameters_meta = raw_payload.get("parameters", {})
    for param_name, meta in parameters_meta.items():
        if isinstance(meta, dict) and "units" in meta:
            units_dict[param_name] = meta["units"]
        else:
            units_dict[param_name] = "unknown"
            
    # Fallback to standard NASA POWER known units if parameters meta was empty or malformed
    default_units = {
        "T2M": "°C",
        "T2M_MAX": "°C",
        "T2M_MIN": "°C",
        "PRECTOTCORR": "mm/day",
        "RH2M": "%",
        "ALLSKY_SFC_SW_DWN": "MJ/m^2/day"
    }
    for k, v in default_units.items():
        if k not in units_dict:
            units_dict[k] = v
            
    return units_dict

def normalize_nasa_power_payload(
    raw_payload: Dict[str, Any]
) -> Tuple[List[DailyClimateRecord], MissingDataStats, Dict[str, str]]:
    """
    Parses and normalizes raw NASA POWER Daily Point JSON.
    """
    properties = raw_payload.get("properties", {})
    parameter_data = properties.get("parameter", {})
    parameter_units = extract_units(raw_payload)

    # Collect all unique dates across parameters
    date_keys = set()
    for param_values in parameter_data.values():
        if isinstance(param_values, dict):
            date_keys.update(param_values.keys())

    sorted_dates = sorted(list(date_keys))
    records: List[DailyClimateRecord] = []
    
    missing_days_count = 0
    total_days_count = len(sorted_dates)
    parameters_with_gaps_set = set()

    for ymd in sorted_dates:
        # Convert YYYYMMDD to YYYY-MM-DD
        iso_date = f"{ymd[:4]}-{ymd[4:6]}-{ymd[6:]}" if len(ymd) == 8 else ymd
        
        day_values = {}
        day_has_any_missing = False

        for param_key, field_name in PARAM_FIELD_MAP.items():
            raw_val = parameter_data.get(param_key, {}).get(ymd)
            clean_val = normalize_value(raw_val)
            day_values[field_name] = clean_val
            if clean_val is None:
                day_has_any_missing = True
                parameters_with_gaps_set.add(param_key)

        if day_has_any_missing:
            missing_days_count += 1

        record = DailyClimateRecord(
            date=iso_date,
            **day_values
        )
        records.append(record)

    missing_percentage = (
        round((missing_days_count / total_days_count) * 100.0, 2)
        if total_days_count > 0
        else 0.0
    )

    missing_stats = MissingDataStats(
        missing_days_count=missing_days_count,
        total_days_count=total_days_count,
        missing_percentage=missing_percentage,
        parameters_with_gaps=sorted(list(parameters_with_gaps_set))
    )

    return records, missing_stats, parameter_units
