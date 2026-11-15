import uuid
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, HTTPException, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder

from app.core.config import settings
from app.core.errors import ApiError, AppException
from app.db.base import Base
from app.db.session import engine, SessionLocal
from app.db.seed import seed_demo_farm_if_empty
from app.modules.farm_management.router import router as farm_router, farmer_router as farmer_router
from app.modules.nasa_data.router import router as nasa_router
from app.modules.earth_observation.router import router as eo_router
from app.modules.agro_intelligence.router import router as agro_router
from app.modules.reports.router import router as reports_router

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("agroshift.api")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables
    logger.info("Initializing database schema...")
    Base.metadata.create_all(bind=engine)
    
    # Auto-seed demo farm if database is empty
    with SessionLocal() as db:
        seed_demo_farm_if_empty(db)
        
    yield
    logger.info("AgroShift API shutting down.")

app = FastAPI(
    title="AgroShift API",
    description="NASA Space Apps Challenge 2026 - Field Shift: Adapting Farms with NASA Data",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Global Exception Handlers returning canonical ApiError shape ---

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    request_id = str(uuid.uuid4())
    serialized_errors = jsonable_encoder(exc.errors())
    logger.warning("Validation error on %s %s [req_id=%s]: %s", request.method, request.url.path, request_id, serialized_errors)
    error_response = ApiError(
        error_code="VALIDATION_ERROR",
        message="The request payload failed schema validation.",
        details=serialized_errors,
        request_id=request_id
    )
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content=error_response.model_dump()
    )

@app.exception_handler(AppException)
async def app_exception_handler(request: Request, exc: AppException):
    logger.warning("Application exception on %s %s [%s]: %s", request.method, request.url.path, exc.error_code, exc.message)
    error_response = ApiError(
        error_code=exc.error_code,
        message=exc.message,
        details=exc.details,
        request_id=exc.request_id
    )
    return JSONResponse(
        status_code=exc.status_code,
        content=error_response.model_dump()
    )

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    request_id = str(uuid.uuid4())
    logger.warning("HTTPException on %s %s [req_id=%s]: %s", request.method, request.url.path, request_id, exc.detail)
    error_response = ApiError(
        error_code="HTTP_ERROR",
        message=str(exc.detail),
        details={"status_code": exc.status_code},
        request_id=request_id
    )
    return JSONResponse(
        status_code=exc.status_code,
        content=error_response.model_dump()
    )

@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    request_id = str(uuid.uuid4())
    logger.error("Unhandled exception on %s %s [req_id=%s]: %s", request.method, request.url.path, request_id, str(exc), exc_info=True)
    error_response = ApiError(
        error_code="INTERNAL_SERVER_ERROR",
        message="An unexpected server error occurred.",
        details=str(exc) if settings.DEBUG else None,
        request_id=request_id
    )
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content=error_response.model_dump()
    )

# --- Health Endpoints ---

HEALTH_PAYLOAD = {
    "status": "ok",
    "service": "agroshift-api",
    "version": "1.0.0"
}

@app.get("/health", tags=["System"])
def get_health():
    return HEALTH_PAYLOAD

@app.get("/api/v1/health", tags=["System"])
def get_api_v1_health():
    return HEALTH_PAYLOAD

# Include Routers
app.include_router(farm_router)
app.include_router(farmer_router)
app.include_router(nasa_router)
app.include_router(eo_router)
app.include_router(agro_router)
app.include_router(reports_router)
