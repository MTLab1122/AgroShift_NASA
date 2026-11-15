import time
import json
import logging
import datetime
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple
import httpx

from app.core.config import settings
from app.core.errors import UpstreamUnavailableException
from app.modules.nasa_data.schemas import (
    DailyClimateRecord,
    ClimateSummary,
    ClimateHistory,
    MissingDataStats,
    OverallAggregate,
    MonthlyAggregate,
)
from app.modules.nasa_data.normalizer import normalize_nasa_power_payload
from app.modules.nasa_data.aggregations import compute_monthly_aggregates, compute_overall_aggregate

logger = logging.getLogger("agroshift.nasa_power")

STANDARD_PARAMETERS = ["T2M", "T2M_MAX", "T2M_MIN", "PRECTOTCORR", "RH2M", "ALLSKY_SFC_SW_DWN"]

class NasaPowerClient:
    """
    Client for NASA POWER Daily Point API with in-memory caching,
    strict error boundaries, fill-value normalization, and audited demo fallback.
    """
    _cache: Dict[str, Tuple[float, Dict[str, Any]]] = {}
    CACHE_TTL_SECONDS: float = 3600.0  # 1 hour

    def __init__(self, base_url: Optional[str] = None, timeout: float = 15.0):
        self.base_url = base_url or settings.NASA_POWER_API_BASE_URL
        self.timeout = timeout

    def _get_cache_key(self, lat: float, lon: float, start: str, end: str, params: List[str]) -> str:
        param_str = ",".join(sorted(params))
        return f"{round(lat, 4)}:{round(lon, 4)}:{start}:{end}:{param_str}"

    def fetch_raw_data(
        self,
        latitude: float,
        longitude: float,
        start_date: str,  # YYYY-MM-DD
        end_date: str,    # YYYY-MM-DD
        parameters: Optional[List[str]] = None,
        use_demo_fallback: bool = False,
    ) -> Tuple[Dict[str, Any], bool]:
        """
        Fetches raw NASA POWER data or audited demo fallback.
        Returns: (payload_dict, is_demo_data)
        """
        params_to_request = parameters or STANDARD_PARAMETERS
        cache_key = self._get_cache_key(latitude, longitude, start_date, end_date, params_to_request)

        # Check in-memory cache
        now = time.time()
        if cache_key in self._cache:
            cache_time, cached_payload = self._cache[cache_key]
            if now - cache_time < self.CACHE_TTL_SECONDS:
                logger.info("Serving NASA POWER data from cache for key: %s", cache_key)
                return cached_payload, False

        # Convert YYYY-MM-DD to YYYYMMDD
        start_clean = start_date.replace("-", "")
        end_clean = end_date.replace("-", "")

        query_params = {
            "parameters": ",".join(params_to_request),
            "community": "AG",
            "longitude": f"{longitude:.4f}",
            "latitude": f"{latitude:.4f}",
            "start": start_clean,
            "end": end_clean,
            "format": "JSON",
        }

        # Attempt call with 1 retry on transient network errors
        last_exception = None
        for attempt in range(2):
            try:
                logger.info(
                    "Calling NASA POWER Daily Point API (attempt %d/2) lat=%s, lon=%s, window=%s to %s",
                    attempt + 1, latitude, longitude, start_clean, end_clean
                )
                with httpx.Client(timeout=self.timeout) as client:
                    resp = client.get(self.base_url, params=query_params)
                    if resp.status_code == 200:
                        payload = resp.json()
                        self._cache[cache_key] = (now, payload)
                        return payload, False
                    else:
                        logger.warning("NASA POWER returned HTTP status %d: %s", resp.status_code, resp.text[:200])
                        last_exception = Exception(f"HTTP {resp.status_code}: {resp.text[:100]}")
            except (httpx.RequestError, httpx.TimeoutException, Exception) as exc:
                logger.warning("Network failure contacting NASA POWER on attempt %d: %s", attempt + 1, exc)
                last_exception = exc

        # Live calls failed. Check fallback policy.
        if use_demo_fallback:
            logger.info("NASA POWER live call failed. Loading audited demo fallback as requested.")
            return self._load_demo_fallback(latitude, longitude, start_date, end_date)

        logger.error("NASA POWER is unavailable and demo fallback was not requested. Raising UPSTREAM_UNAVAILABLE.")
        raise UpstreamUnavailableException(
            message="NASA POWER is currently unavailable. No live climate data was fabricated.",
            details={"error": str(last_exception)}
        )

    def _load_demo_fallback(
        self,
        latitude: float,
        longitude: float,
        start_date: str,
        end_date: str
    ) -> Tuple[Dict[str, Any], bool]:
        demo_file = settings.DEMO_DATA_DIR / "climate.demo.json"
        if demo_file.exists():
            try:
                with open(demo_file, "r", encoding="utf-8") as f:
                    demo_json = json.load(f)
                return demo_json, True
            except Exception as e:
                logger.error("Error loading demo climate fixture: %s", e)

        raise UpstreamUnavailableException(
            message="NASA POWER is unavailable and demo fixture could not be loaded.",
            details=None
        )

    def get_climate_summary(
        self,
        latitude: float,
        longitude: float,
        start_date: str,
        end_date: str,
        use_demo_fallback: bool = False
    ) -> ClimateSummary:
        payload, is_demo = self.fetch_raw_data(
            latitude=latitude,
            longitude=longitude,
            start_date=start_date,
            end_date=end_date,
            use_demo_fallback=use_demo_fallback
        )

        # If payload was loaded from climate.demo.json directly, it may already be pre-normalized
        if is_demo and "overall" in payload and "monthly" in payload:
            return ClimateSummary(
                source=payload["source"],
                dataset_or_endpoint=payload["dataset_or_endpoint"],
                latitude=latitude,
                longitude=longitude,
                start_date=start_date,
                end_date=end_date,
                parameters=payload["parameters"],
                parameter_units=payload["parameter_units"],
                retrieved_at=payload.get("retrieved_at", datetime.datetime.utcnow().isoformat() + "Z"),
                missing_data=MissingDataStats(**payload["missing_data"]),
                coverage_note=payload["coverage_note"],
                is_demo_data=True,
                overall=OverallAggregate(**payload["overall"]),
                monthly=[MonthlyAggregate(**m) for m in payload["monthly"]]
            )

        # Otherwise normalize raw NASA POWER payload
        records, missing_stats, units = normalize_nasa_power_payload(payload)
        monthly_aggs = compute_monthly_aggregates(records)
        overall_agg = compute_overall_aggregate(records)

        coverage_note = (
            f"NASA POWER AG Community 0.5° × 0.625° satellite reanalysis grid cell centered at ({latitude:.4f}, {longitude:.4f})."
        )
        if is_demo:
            coverage_note = f"[DEMO] {coverage_note}"

        return ClimateSummary(
            source="NASA POWER Daily Point API (AG Community)",
            dataset_or_endpoint=self.base_url,
            latitude=latitude,
            longitude=longitude,
            start_date=start_date,
            end_date=end_date,
            parameters=STANDARD_PARAMETERS,
            parameter_units=units,
            retrieved_at=datetime.datetime.utcnow().isoformat() + "Z",
            missing_data=missing_stats,
            coverage_note=coverage_note,
            is_demo_data=is_demo,
            overall=overall_agg,
            monthly=monthly_aggs
        )

    def get_climate_history(
        self,
        latitude: float,
        longitude: float,
        start_date: str,
        end_date: str,
        use_demo_fallback: bool = False
    ) -> ClimateHistory:
        payload, is_demo = self.fetch_raw_data(
            latitude=latitude,
            longitude=longitude,
            start_date=start_date,
            end_date=end_date,
            use_demo_fallback=use_demo_fallback
        )

        if is_demo and "records" in payload:
            records = [DailyClimateRecord(**r) for r in payload["records"]]
            missing_stats = MissingDataStats(**payload["missing_data"])
            units = payload["parameter_units"]
            source = payload["source"]
            endpoint = payload["dataset_or_endpoint"]
            coverage_note = payload["coverage_note"]
        else:
            records, missing_stats, units = normalize_nasa_power_payload(payload)
            source = "NASA POWER Daily Point API (AG Community)"
            endpoint = self.base_url
            coverage_note = (
                f"NASA POWER AG Community 0.5° × 0.625° satellite reanalysis grid cell centered at ({latitude:.4f}, {longitude:.4f})."
            )
            if is_demo:
                coverage_note = f"[DEMO] {coverage_note}"

        return ClimateHistory(
            source=source,
            dataset_or_endpoint=endpoint,
            latitude=latitude,
            longitude=longitude,
            start_date=start_date,
            end_date=end_date,
            parameters=STANDARD_PARAMETERS,
            parameter_units=units,
            retrieved_at=datetime.datetime.utcnow().isoformat() + "Z",
            missing_data=missing_stats,
            coverage_note=coverage_note,
            is_demo_data=is_demo,
            records=records
        )
