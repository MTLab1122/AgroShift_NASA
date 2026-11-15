# Multi-NASA Earth-Observation Data Integration Specification

AgroShift synthesizes four distinct NASA Earth-observation and modeled reanalysis systems to provide a multi-dimensional checkup of crop-growing conditions in Pakistan's Peshawar Valley.

---

## 1. NASA Earth-Observation Streams Overview

| Source | Product ID | Spatial Resolution | Temporal Cadence | Primary Measurement | Agronomic Role in AgroShift |
|---|---|---|---|---|---|
| **NASA SMAP L4** | `SPL4SMGP.007` / Crop-CASMA | 9 km (0.09° grid centroid) | Daily Assimilated (3-hr LSM) | Root-Zone Soil Moisture (0–100 cm depth in mm/m) | Subsurface water deficit detection; triggers `dry_root_zone_flag` when `< 25 mm/m`. |
| **NASA GPM IMERG** | `GPM_3IMERGDF.07` | 0.1° × 0.1° (~10 km grid) | Daily Final Run (Calibrated) | Accumulated Precipitation (mm) | Dry-spell tracking; triggers `dry_spell_risk` when consecutive dry days `>= 14`. |
| **NASA MODIS / VIIRS** | `MOD13Q1` / `VNP13A1` | 250 m to 500 m pixel | 16-day Composite | Normalized Difference Vegetation Index (NDVI) | Canopy greenness and bare-field detection; flags low greenness when `NDVI < 0.25`. |
| **NASA POWER** | AG Daily Point API | 0.5° × 0.625° (~50 km) | Daily | T2M, T2M_MAX, T2M_MIN, PRECTOTCORR, RH2M, ALLSKY_SFC_SW_DWN | Growing degree days, summer heat stress (`T2M_MAX >= 35°C`), frost risk (`T2M_MIN <= 2°C`). |

---

## 2. Multi-NASA Integrity Protocol

### 2.1 Fill-Value Policy & Zero-Imputation Prohibition
- **Strict Fill-Value Stripping:** Any observation with value `<= -900` (e.g. `-999`, `-999.0`) is strictly normalized to Python `None` and JSON `null`.
- **Zero-Imputation Prohibition:** Missing satellite data is **never** converted to `0`, `false`, or an estimated average. A precipitation reading of `0 mm` represents observed dry weather, whereas `null` represents unobserved or missing satellite passes.
- **Visual Gaps:** All frontend Recharts time-series charts use `connectNulls={false}` so data gaps render as visible interruptions rather than false linear interpolations.

### 2.2 Bare-Field Window Detection Rule
- Bare-field status is **never** declared based on a single satellite signal alone.
- Detection requires at least **two independent physical signals** simultaneously:
  1. Optical signal: `MODIS NDVI < 0.25` (sparse canopy or post-harvest fallow).
  2. Microwave soil moisture: `SMAP root-zone soil moisture < 25.0 mm/m`.
  3. Satellite precipitation: `GPM IMERG consecutive dry days >= 14` or seasonal rain `< 50 mm`.
  4. Synoptic heat: `NASA POWER heat stress days >= 10`.

### 2.3 10-Year Decadal Trend Rule
- Historical baselines require at least **5 continuous valid years** from the satellite archive.
- If fewer than 5 valid years are available, the API returns `trend_status: "insufficient_history"` with indicators marked as low confidence and null baseline anomalies.

---

## 3. Dynamic Unit & Provenance Metadata

Every climate-derived result exposes:
```json
{
  "source": "string",
  "spatial_resolution": "string",
  "temporal_resolution": "string",
  "measurement": "string",
  "retrieval_method": "string",
  "data_quality": {
    "available_sources": ["..."],
    "unavailable_sources": [],
    "missing_percentage_by_source": {},
    "overall_confidence": "high | medium | low | not_enough_information"
  },
  "is_demo_data": false
}
```

---

## 4. Scientific Boundaries & Local-Check Notice

- **Gridded vs Farm-Level Sensor:** Gridded satellite observations (9 km to 50 km) represent regional spatial averages rather than field-level sensor measurements.
- **Mandatory Local Ground Check:**
  > *"Local Check: Verify canal water schedules, seed prices, soil salinity, pest pressure, and field-specific conditions before planting."*
- **Broad-Area Disclaimer:**
  > *"NASA satellite data represents broad-area conditions, not a field-specific measurement."*
