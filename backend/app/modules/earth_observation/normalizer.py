"""
Normalizer for Multi-NASA Earth-Observation data.
Converts NASA fill values (e.g. -999, -999.0, or any value <= -900) to Python None.
Ensures zero-imputation never occurs.
Calculates missing-data percentages and data coverage statistics.
"""

from typing import Any, Dict, List, Optional, Tuple


def sanitize_nasa_value(value: Any) -> Optional[float]:
    """
    Sanitizes a single observation value.
    If value is None, or string representation indicates fill/missing,
    or numeric value <= -900 (such as -999, -999.0), returns None.
    Never returns 0.0 or an imputed estimate for missing data.
    """
    if value is None:
        return None
    try:
        val_float = float(value)
        if val_float <= -900.0:
            return None
        return val_float
    except (ValueError, TypeError):
        return None


def sanitize_series(series: Dict[str, Any]) -> Dict[str, Optional[float]]:
    """
    Sanitizes a time-series dictionary of {date_str: value}.
    All values <= -900 become None.
    """
    sanitized: Dict[str, Optional[float]] = {}
    for date_key, val in series.items():
        sanitized[date_key] = sanitize_nasa_value(val)
    return sanitized


def calculate_missing_percentage(values: List[Any]) -> Tuple[float, float]:
    """
    Calculates missing percentage and data coverage percentage for a list of values.
    Returns: (missing_percentage, coverage_percentage)
    """
    if not values:
        return 100.0, 0.0

    total = len(values)
    missing = sum(1 for v in values if sanitize_nasa_value(v) is None)
    missing_pct = round((missing / total) * 100.0, 1)
    coverage_pct = round(100.0 - missing_pct, 1)
    return missing_pct, coverage_pct


def safe_mean(values: List[Optional[float]]) -> Optional[float]:
    """
    Computes mean of valid (non-None) numbers.
    Returns None if no valid numbers exist.
    """
    valid = [v for v in values if v is not None and sanitize_nasa_value(v) is not None]
    if not valid:
        return None
    return round(sum(valid) / len(valid), 2)


def safe_sum(values: List[Optional[float]]) -> Optional[float]:
    """
    Computes sum of valid (non-None) numbers.
    Returns None if no valid numbers exist.
    """
    valid = [v for v in values if v is not None and sanitize_nasa_value(v) is not None]
    if not valid:
        return None
    return round(sum(valid), 2)
