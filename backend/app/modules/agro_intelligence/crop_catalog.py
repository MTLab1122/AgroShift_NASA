import json
import logging
from typing import Dict, List, Optional
from app.core.config import settings
from app.core.errors import NotFoundException
from app.modules.agro_intelligence.schemas import CropCatalogItem

logger = logging.getLogger("agroshift.crop_catalog")

FALLBACK_CROPS = [
    {
        "crop_id": "wheat",
        "name": "Wheat (Gandum)",
        "category": "cereal",
        "is_legume": False,
        "seasons": ["rabi"],
        "duration_days": 140,
        "water_demand": "medium",
        "suitable_soils": ["loamy", "clay"],
        "incompatible_predecessors": ["wheat"],
        "evidence_note": "Primary staple cereal in KP. Sensitive to terminal heat stress during grain filling (March-April). Recommended following kharif pulses or maize.",
        "evidence_status": "documented"
    },
    {
        "crop_id": "maize",
        "name": "Maize (Makai)",
        "category": "cereal",
        "is_legume": False,
        "seasons": ["kharif", "zaid"],
        "duration_days": 105,
        "water_demand": "medium",
        "suitable_soils": ["loamy", "sandy", "clay"],
        "incompatible_predecessors": ["maize"],
        "evidence_note": "Extensively cultivated across Peshawar and Charsadda valley floor. Moderate drought sensitivity during silking. Rotates efficiently with rabi wheat or pulses.",
        "evidence_status": "documented"
    },
    {
        "crop_id": "rice",
        "name": "Rice (Dhan / Shali)",
        "category": "cereal",
        "is_legume": False,
        "seasons": ["kharif"],
        "duration_days": 120,
        "water_demand": "high",
        "suitable_soils": ["clay", "loamy"],
        "incompatible_predecessors": ["rice"],
        "evidence_note": "High water-demand crop restricted to canal command zones or high tube-well discharge areas in Peshawar Valley. Incurs high pumping costs when groundwater is deep.",
        "evidence_status": "documented"
    },
    {
        "crop_id": "sugarcane",
        "name": "Sugarcane (Ganna)",
        "category": "cash_crop",
        "is_legume": False,
        "seasons": ["annual"],
        "duration_days": 330,
        "water_demand": "high",
        "suitable_soils": ["loamy", "clay"],
        "incompatible_predecessors": [],
        "evidence_note": "Year-round perennial cash crop feeding local sugar mills in Peshawar, Mardan, and Charsadda. High total water requirement throughout summer peak irradiance.",
        "evidence_status": "documented"
    },
    {
        "crop_id": "mustard",
        "name": "Mustard / Rapeseed (Raya / Toria)",
        "category": "oilseed",
        "is_legume": False,
        "seasons": ["rabi"],
        "duration_days": 110,
        "water_demand": "low",
        "suitable_soils": ["loamy", "sandy"],
        "incompatible_predecessors": ["mustard"],
        "evidence_note": "Low water-demand rabi oilseed suitable for moisture-constrained or tail-end canal lands. Vulnerable to aphid infestation if high relative humidity persists.",
        "evidence_status": "documented"
    },
    {
        "crop_id": "chickpea",
        "name": "Chickpea / Gram (Chana)",
        "category": "pulse",
        "is_legume": True,
        "seasons": ["rabi"],
        "duration_days": 130,
        "water_demand": "low",
        "suitable_soils": ["sandy", "loamy"],
        "incompatible_predecessors": ["chickpea", "lentil"],
        "evidence_note": "Symbiotic nitrogen-fixing pulse. Well adapted to sandy loam and low rainfall areas. Susceptible to Ascochyta blight under continuous high humidity or waterlogging.",
        "evidence_status": "documented"
    },
    {
        "crop_id": "lentil",
        "name": "Lentil (Masoor)",
        "category": "pulse",
        "is_legume": True,
        "seasons": ["rabi"],
        "duration_days": 115,
        "water_demand": "low",
        "suitable_soils": ["loamy", "clay", "sandy"],
        "incompatible_predecessors": ["chickpea", "lentil"],
        "evidence_note": "Nitrogen-fixing cool-season pulse. Modest water requirements. Excellent break crop in cereal-dominated rotations to improve soil biological activity.",
        "evidence_status": "documented"
    },
    {
        "crop_id": "mung_bean",
        "name": "Mung Bean (Mung)",
        "category": "pulse",
        "is_legume": True,
        "seasons": ["kharif", "zaid"],
        "duration_days": 70,
        "water_demand": "low",
        "suitable_soils": ["loamy", "sandy"],
        "incompatible_predecessors": ["mung_bean"],
        "evidence_note": "Short-duration summer/spring legume fitting narrow windows between wheat harvest and kharif planting. Fixes atmospheric nitrogen and requires minimal irrigation.",
        "evidence_status": "documented"
    },
    {
        "crop_id": "berseem_clover",
        "name": "Berseem Clover (Shaftal / Berseem)",
        "category": "forage_cover",
        "is_legume": True,
        "seasons": ["rabi"],
        "duration_days": 180,
        "water_demand": "medium",
        "suitable_soils": ["loamy", "clay"],
        "incompatible_predecessors": [],
        "evidence_note": "Multi-cut rabi forage legume known locally as the 'King of Forages'. High biological nitrogen fixation, dense soil canopy cover, and excellent soil structure improvement.",
        "evidence_status": "documented"
    }
]

class CropCatalog:
    _crops_cache: Optional[Dict[str, CropCatalogItem]] = None

    @classmethod
    def _load(cls) -> Dict[str, CropCatalogItem]:
        if cls._crops_cache is not None:
            return cls._crops_cache

        catalog_path = settings.CROP_CATALOG_PATH
        items = []
        if catalog_path.exists():
            try:
                with open(catalog_path, "r", encoding="utf-8") as f:
                    raw = json.load(f)
                items = [CropCatalogItem(**item) for item in raw]
            except Exception as e:
                logger.warning("Could not read %s: %s. Using fallback list.", catalog_path, e)

        if not items:
            items = [CropCatalogItem(**item) for item in FALLBACK_CROPS]

        cls._crops_cache = {c.crop_id: c for c in items}
        return cls._crops_cache

    @classmethod
    def list_all(cls) -> List[CropCatalogItem]:
        return list(cls._load().values())

    @classmethod
    def get(cls, crop_id: str) -> CropCatalogItem:
        crops = cls._load()
        if crop_id not in crops:
            raise NotFoundException("Crop", crop_id)
        return crops[crop_id]
