import pytest
from app.core.errors import ApiError, AppException, NotFoundException, ValidationException, UpstreamUnavailableException

def test_api_error_model():
    err = ApiError(
        error_code="TEST_ERROR",
        message="A test error occurred.",
        details={"field": "value"},
        request_id="test-uuid-1234"
    )
    d = err.model_dump()
    assert d["error_code"] == "TEST_ERROR"
    assert d["message"] == "A test error occurred."
    assert d["details"] == {"field": "value"}
    assert d["request_id"] == "test-uuid-1234"

def test_app_exceptions():
    nf = NotFoundException("Farm", "farm-123")
    assert nf.status_code == 404
    assert nf.error_code == "NOT_FOUND"
    assert nf.request_id is not None
    assert "farm-123" in nf.message

    val = ValidationException("Invalid latitude", {"latitude": 95.0})
    assert val.status_code == 422
    assert val.error_code == "VALIDATION_ERROR"
    assert val.details == {"latitude": 95.0}

    up = UpstreamUnavailableException()
    assert up.status_code == 503
    assert up.error_code == "UPSTREAM_UNAVAILABLE"
    assert "No live climate data was fabricated" in up.message
