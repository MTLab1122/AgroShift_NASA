"""
Tests for Multi-NASA Earth Observation data normalization and fill-value stripping.
"""

from app.modules.earth_observation.normalizer import (
    sanitize_nasa_value,
    sanitize_series,
    calculate_missing_percentage,
    safe_mean,
    safe_sum,
)


def test_fill_value_stripping():
    # Strict NASA fill-value contract: values <= -900 become None
    assert sanitize_nasa_value(-999) is None
    assert sanitize_nasa_value(-999.0) is None
    assert sanitize_nasa_value(-900.0) is None
    assert sanitize_nasa_value("-999") is None
    assert sanitize_nasa_value(None) is None

    # Valid values must be preserved exactly
    assert sanitize_nasa_value(0.0) == 0.0
    assert sanitize_nasa_value(25.4) == 25.4
    assert sanitize_nasa_value(-10.5) == -10.5

    # Missing values must NEVER be converted to 0.0 or False
    res = sanitize_nasa_value(-999)
    assert res is not 0
    assert res is not 0.0
    assert res is not False


def test_sanitize_series():
    raw_series = {
        "2024-05-01": 24.5,
        "2024-05-02": -999.0,
        "2024-05-03": 0.0,
        "2024-05-04": -999,
        "2024-05-05": 30.1,
    }
    sanitized = sanitize_series(raw_series)
    assert sanitized["2024-05-01"] == 24.5
    assert sanitized["2024-05-02"] is None
    assert sanitized["2024-05-03"] == 0.0
    assert sanitized["2024-05-04"] is None
    assert sanitized["2024-05-05"] == 30.1


def test_calculate_missing_percentage():
    values = [20.0, None, -999, 25.0, 30.0]  # 2 missing out of 5 -> 40%
    missing_pct, coverage_pct = calculate_missing_percentage(values)
    assert missing_pct == 40.0
    assert coverage_pct == 60.0

    # Empty list
    empty_missing, empty_cov = calculate_missing_percentage([])
    assert empty_missing == 100.0
    assert empty_cov == 0.0


def test_safe_mean_and_sum():
    values = [10.0, None, -999.0, 20.0, 30.0]
    # valid values are 10.0, 20.0, 30.0 -> mean 20.0, sum 60.0
    assert safe_mean(values) == 20.0
    assert safe_sum(values) == 60.0

    # All missing
    all_missing = [-999.0, None, -999]
    assert safe_mean(all_missing) is None
    assert safe_sum(all_missing) is None
