import json
import logging
from pathlib import Path
from sqlalchemy.orm import Session
from app.modules.farm_management.models import Farm, CropHistoryEntryModel
from app.core.config import settings

logger = logging.getLogger("agroshift.seed")

def seed_demo_farm_if_empty(db: Session) -> bool:
    """
    Seeds the demo farm ONLY when the farms table is empty.
    Returns True if seeded, False if database already contains records.
    """
    farm_count = db.query(Farm).count()
    if farm_count > 0:
        logger.info("Database already contains %d farm(s). Skipping seed.", farm_count)
        return False

    demo_file = settings.DEMO_DATA_DIR / "farm.demo.json"
    farm_data = None
    if demo_file.exists():
        try:
            with open(demo_file, "r", encoding="utf-8") as f:
                farm_data = json.load(f)
        except Exception as e:
            logger.warning("Could not read %s: %s. Using hardcoded fallback.", demo_file, e)

    if not farm_data:
        farm_data = {
            "farm_id": "demo-peshawar-001",
            "name": "[DEMO] Peshawar Valley Demo Farm",
            "latitude": 34.0151,
            "longitude": 71.5249,
            "area_value": 5.0,
            "area_unit": "acres",
            "soil_type": "loamy",
            "irrigation_type": "tube_well",
            "water_availability": "medium",
            "is_demo_data": True,
            "crop_history": [
                {
                    "entry_id": "hist-demo-001",
                    "crop_name": "Wheat (Gandum)",
                    "season": "rabi",
                    "start_date": "2025-11-15",
                    "end_date": "2026-04-20",
                    "notes": "Standard sowing post-kharif maize. Conventional flood irrigation via tube-well.",
                    "is_demo_data": True
                },
                {
                    "entry_id": "hist-demo-002",
                    "crop_name": "Maize (Makai)",
                    "season": "kharif",
                    "start_date": "2026-06-01",
                    "end_date": "2026-09-25",
                    "notes": "Grain maize hybrid. Encountered moderate irrigation power supply gaps in July.",
                    "is_demo_data": True
                }
            ]
        }

    demo_farm = Farm(
        farm_id=farm_data["farm_id"],
        name=farm_data["name"],
        latitude=farm_data["latitude"],
        longitude=farm_data["longitude"],
        area_value=farm_data["area_value"],
        area_unit=farm_data["area_unit"],
        soil_type=farm_data["soil_type"],
        irrigation_type=farm_data["irrigation_type"],
        water_availability=farm_data["water_availability"],
        is_demo_data=farm_data.get("is_demo_data", True),
    )
    db.add(demo_farm)
    db.flush()

    # Ensure no leftover crop history entries with matching IDs
    hist_entries = farm_data.get("crop_history", [])
    entry_ids = [h.get("entry_id") for h in hist_entries if h.get("entry_id")]
    if entry_ids:
        db.query(CropHistoryEntryModel).filter(CropHistoryEntryModel.entry_id.in_(entry_ids)).delete(synchronize_session=False)

    for hist in hist_entries:
        entry = CropHistoryEntryModel(
            entry_id=hist.get("entry_id", f"hist-{farm_data['farm_id']}-1"),
            farm_id=demo_farm.farm_id,
            crop_name=hist["crop_name"],
            season=hist["season"],
            start_date=hist.get("start_date"),
            end_date=hist.get("end_date"),
            notes=hist.get("notes"),
            is_demo_data=hist.get("is_demo_data", True),
        )
        db.add(entry)

    db.commit()
    logger.info("Successfully seeded demo farm '%s' with %d history entries.", demo_farm.farm_id, len(farm_data.get("crop_history", [])))
    return True
