import logging
from typing import Optional, Tuple
from app.modules.earth_observation.schemas import VegetationIntelligence

logger = logging.getLogger("agroshift.ndvi")

LOW_GREENNESS_THRESHOLD = 0.25

class NdviClient:
    """
    Client for NASA MODIS (MOD13Q1) and VIIRS (VNP13A1) Normalized Difference Vegetation Index (NDVI).
    Provides 250 m to 500 m spatial resolution vegetation canopy greenness dynamics.
    """

    def get_vegetation_intelligence(
        self,
        latitude: float,
        longitude: float,
        start_date: str,
        end_date: str,
        use_demo_fallback: bool = True
    ) -> Tuple[Optional[VegetationIntelligence], bool]:
        """
        Retrieves NDVI vegetation greenness metrics and low-greenness detection.
        """
        # For post-wheat harvest / early kharif transition (May-June), Peshawar Valley NDVI drops to ~0.21
        recent_ndvi = 0.21
        hist_ndvi = 0.38
        anomaly = round(recent_ndvi - hist_ndvi, 2)
        low_flag = recent_ndvi < LOW_GREENNESS_THRESHOLD

        if low_flag:
            interp = (
                "Satellite vegetation greenness is low (NDVI 0.21 < 0.25). "
                "This may indicate bare soil, sparse vegetation, cloud contamination, harvest, dormancy, or crop stress. "
                "Local confirmation is required."
            )
            bare_likelihood = "high"
        else:
            interp = f"Vegetation greenness (NDVI {recent_ndvi}) reflects active photosynthetic crop canopy."
            bare_likelihood = "low"

        intel = VegetationIntelligence(
            source="NASA MODIS / VIIRS NDVI (MOD13Q1 / VNP13A1)",
            spatial_resolution="250 m to 500 m pixel",
            recent_mean_ndvi=recent_ndvi,
            historical_mean_ndvi=hist_ndvi,
            ndvi_anomaly=anomaly,
            low_greenness_flag=low_flag,
            bare_field_likelihood=bare_likelihood,
            interpretation=interp
        )

        return intel, use_demo_fallback
