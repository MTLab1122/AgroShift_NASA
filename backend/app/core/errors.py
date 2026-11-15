import uuid
from typing import Any, Optional
from pydantic import BaseModel

class ApiError(BaseModel):
    error_code: str
    message: str
    details: Optional[Any] = None
    request_id: Optional[str] = None

class AppException(Exception):
    def __init__(
        self,
        error_code: str,
        message: str,
        status_code: int = 400,
        details: Optional[Any] = None,
        request_id: Optional[str] = None
    ):
        self.error_code = error_code
        self.message = message
        self.status_code = status_code
        self.details = details
        self.request_id = request_id or str(uuid.uuid4())
        super().__init__(self.message)

class NotFoundException(AppException):
    def __init__(self, resource: str, identifier: str, request_id: Optional[str] = None):
        super().__init__(
            error_code="NOT_FOUND",
            message=f"{resource} with identifier '{identifier}' was not found.",
            status_code=404,
            details={"resource": resource, "identifier": identifier},
            request_id=request_id
        )

class ValidationException(AppException):
    def __init__(self, message: str, details: Optional[Any] = None, request_id: Optional[str] = None):
        super().__init__(
            error_code="VALIDATION_ERROR",
            message=message,
            status_code=422,
            details=details,
            request_id=request_id
        )

class UpstreamUnavailableException(AppException):
    def __init__(
        self,
        message: str = "NASA POWER is currently unavailable. No live climate data was fabricated.",
        details: Optional[Any] = None,
        request_id: Optional[str] = None
    ):
        super().__init__(
            error_code="UPSTREAM_UNAVAILABLE",
            message=message,
            status_code=503,
            details=details,
            request_id=request_id
        )
