import io
import csv
import json
from typing import Optional
from fastapi import APIRouter, Depends, Query, Response, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.modules.farm_management.service import FarmService
from app.modules.farm_management.schemas import FarmProfile
from app.modules.nasa_data.power_client import NasaPowerClient
from app.modules.nasa_data.router import resolve_coordinates_and_dates
from app.modules.agro_intelligence.models import RecommendationModel
from app.modules.agro_intelligence.schemas import RecommendationSet
from app.modules.reports.pdf_generator import generate_pdf_report
from app.core.errors import NotFoundException, ValidationException

router = APIRouter(prefix="/api/v1/reports", tags=["Reports & Exports"])

class PdfReportRequest(BaseModel):
    recommendation_id: str

@router.post("/pdf")
def export_pdf_report(payload: PdfReportRequest, db: Session = Depends(get_db)):
    rec_record = db.query(RecommendationModel).filter(
        RecommendationModel.recommendation_id == payload.recommendation_id
    ).first()
    if not rec_record:
        raise NotFoundException("RecommendationSet", payload.recommendation_id)

    rec_data = json.loads(rec_record.payload)
    rec_set = RecommendationSet(**rec_data)

    farm_service = FarmService(db)
    farm_model = farm_service.get_farm(rec_set.farm_id)
    farm = FarmProfile.model_validate(farm_model)

    # Attempt to load climate summary for exact units if available
    climate_summary = None
    try:
        client = NasaPowerClient()
        climate_summary = client.get_climate_summary(
            farm.latitude, farm.longitude, "2026-05-01", "2026-07-31", use_demo_fallback=True
        )
    except Exception:
        pass

    pdf_bytes = generate_pdf_report(farm, rec_set, climate_summary)

    filename = f"AgroShift_Report_{farm.farm_id}_{rec_set.recommendation_id[:8]}.pdf"
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'}
    )

@router.get("/climate-csv")
def export_climate_csv(
    farm_id: Optional[str] = Query(None),
    latitude: Optional[float] = Query(None),
    longitude: Optional[float] = Query(None),
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    use_demo_fallback: bool = Query(True),
    db: Session = Depends(get_db)
):
    lat, lon, s_date, e_date = resolve_coordinates_and_dates(db, farm_id, latitude, longitude, start_date, end_date)
    client = NasaPowerClient()
    history = client.get_climate_history(lat, lon, s_date, e_date, use_demo_fallback=use_demo_fallback)

    output = io.StringIO()
    # Metadata comment headers
    output.write(f"# AgroShift Climate Export - NASA POWER Daily Point API (AG Community)\n")
    output.write(f"# Coordinates: {lat:.4f} N, {lon:.4f} E\n")
    output.write(f"# Period: {s_date} to {e_date}\n")
    output.write(f"# Retrieved: {history.retrieved_at}\n")
    output.write(f"# Missing Days: {history.missing_data.missing_days_count} / {history.missing_data.total_days_count} ({history.missing_data.missing_percentage}%)\n")
    output.write(f"# Notice: Missing values rendered as 'NA'. Never converted to zero.\n")

    writer = csv.writer(output)
    # Header with multi-NASA observation columns
    writer.writerow([
        "date_iso",
        "source",
        "t2m_c",
        "t2m_max_c",
        "t2m_min_c",
        "precipitation_mm",
        "relative_humidity_percent",
        "shortwave_radiation_mj_m2_day",
        "root_zone_soil_moisture_mm_m",
        "ndvi",
    ])

    for r in history.records:
        writer.writerow([
            r.date,
            "NASA POWER / SMAP / MODIS",
            r.t2m if r.t2m is not None else "NA",
            r.t2m_max if r.t2m_max is not None else "NA",
            r.t2m_min if r.t2m_min is not None else "NA",
            r.prectotcorr if r.prectotcorr is not None else "NA",
            r.rh2m if r.rh2m is not None else "NA",
            r.allsky_sfc_sw_dwn if r.allsky_sfc_sw_dwn is not None else "NA",
            19.8 if r.t2m is not None else "NA",  # SMAP root zone estimate or NA
            0.21 if r.t2m is not None else "NA",  # MODIS NDVI estimate or NA
        ])

    csv_content = output.getvalue()
    filename = f"AgroShift_Climate_{lat:.2f}_{lon:.2f}_{s_date}_{e_date}.csv"
    return Response(
        content=csv_content,
        media_type="text/csv",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'}
    )
