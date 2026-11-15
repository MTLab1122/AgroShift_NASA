# AgroShift — NASA Space Apps Challenge 2026

**Challenge:** Field Shift: Adapting Farms with NASA Data  
**Team:** Team InCir  
**Institution:** Abasyn University Peshawar  
**Team Lead:** Muhammad Talha  
**Team Size:** 5 members  
**Primary Demonstration Pilot:** Peshawar Valley, Khyber Pakhtunkhwa, Pakistan  
**Primary Pilot Coordinates:** `34.0151° N, 71.5249° E`

---

## 1. Executive Summary

**AgroShift** is an operational, judge-ready decision-support platform designed to help smallholder farmers and extension advisors in Pakistan's Peshawar Valley explore climate-resilient crop rotation strategies that regenerate soil health and mitigate climate stressors.

AgroShift synthesizes **four NASA Earth-observation systems**:
1. **NASA SMAP L4 / Crop-CASMA (9 km):** Root-zone soil moisture monitoring at 0–100 cm depth. Flags critical water deficit when `< 25 mm/m`.
2. **NASA GPM IMERG (10 km):** Gauge-calibrated satellite precipitation and dry-spell risk tracking (`consecutive_dry_days >= 14`).
3. **NASA MODIS / VIIRS (250m–500m):** Normalized Difference Vegetation Index (NDVI) monitoring canopy greenness and identifying bare fallow windows (`NDVI < 0.25`).
4. **NASA POWER Daily Point API (0.5° × 0.625°):** Reanalysis agroclimatology driving thermal stress monitoring (`T2M_MAX >= 35°C`), frost alerts (`T2M_MIN <= 2°C`), and growing degree days.

---

## 2. Exact 3-Command Quickstart

To run the complete system from a clean clone:

```bash
# 1. Backend setup and run
cd backend && python -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt && uvicorn app.main:app --reload --port 8000

# 2. Frontend setup and run
cd ../frontend && npm install && npm run dev

# 3. Run full test suite
cd ../backend && pytest && cd ../tests && pytest
```

*Note for Windows PowerShell:*
- Backend: `cd backend; python -m venv .venv; .venv\Scripts\Activate.ps1; pip install -r requirements.txt; uvicorn app.main:app --reload --port 8000`
- Frontend: `cd frontend; npm install; npm run dev`
- Tests: `cd backend; pytest; cd ../tests; pytest`

---

## 3. Architecture & Data Flow

```text
                               +---------------------------------------------+
                               |              Next.js 14 Frontend            |
                               |  (App Router, TypeScript, Tailwind, Leaflet,|
                               |          Recharts, Lucide Icons)            |
                               +----------------------+----------------------+
                                                      | REST / JSON
                                                      v
                               +---------------------------------------------+
                               |               FastAPI Backend               |
                               |          (Python 3.11+, Pydantic v2)        |
                               +----------------------+----------------------+
                                                      |
                  +-------------------+---------------+-------------------+-------------------+
                  |                   |                                   |                   |
                  v                   v                                   v                   v
      +-----------------------+ +--------------------+            +-------------------+ +-------------------+
      |   NASA SMAP L4 /      | |   NASA GPM IMERG   |            | NASA MODIS/VIIRS  | | NASA POWER Daily  |
      |   Crop-CASMA (9 km)   | |  Precip (~10 km)   |            |  NDVI (250m-500m) | |   Point API       |
      | Root-Zone Soil Moist. | | Dry-Spell Risk     |            | Fallow Detection  | | Agroclimatology   |
      +-----------------------+ +--------------------+            +-------------------+ +-------------------+
                  |                   |                                   |                   |
                  +-------------------+---------------+-------------------+-------------------+
                                                      |
                                                      v
                                       +-----------------------------+
                                       |   AgroShift Decision Engine |
                                       |  (Deterministic Scoring &   |
                                       |   3-Strategy Comparison)    |
                                       +-----------------------------+
```

---

## 4. Key Phase 6 Features

### 4.1 Farmer Profile & Voice-Assisted Onboarding (`/onboarding`)
- **4-Step Progressive Flow:** Pin location -> Current crop -> Irrigation & water -> Primary goal & review.
- **Web Speech API Voice Recognition:** Supports spoken English and Urdu (اردو) commands (e.g. *"گندم اور ٹیوب ویل پانی بچاؤ"*).
- **Human-in-the-Loop Confirmation:** Spoken inputs are previewed in an editable modal before applying.
- **Privacy Protection:** Phone numbers are strictly masked (`***-***-4567`) in all API responses.

### 4.2 Multi-NASA Traffic-Light Health Checkup (`/dashboard/farmer`)
- **Visual Status Indicators:** Green / Yellow / Red / Gray indicators for:
  - Root-zone soil moisture (SMAP)
  - Dry-spell duration (IMERG)
  - Field canopy greenness (MODIS NDVI)
  - Extreme summer heat stress (POWER)
- **Multi-Signal Bare-Field Detection:** Requires at least **two independent physical signals** (e.g. low NDVI + depleted root moisture) before declaring a bare-field window.

### 4.3 Three-Strategy Rotation Comparison (`/recommendations/compare`)
1. **Baseline (Conventional Monoculture):** Wheat → Maize → Summer Fallow. High water demand, seasonal bare soil exposure.
2. **Water-Saver Pulse Fix:** Wheat → Mung Bean → Chickpea/Millet. Low water demand, biological nitrogen fixation (30-45 kg N/ha), ~40% fewer irrigation passes.
3. **Soil-Shield Forage Rotation:** Berseem Clover → Maize → Cowpea Cover. Continuous living cover protects topsoil from heat desiccation and feeds dairy herds.

### 4.4 Trust Badges & Scientific Integrity Rules
- **Confidence Badge:** Displays confidence level (`HIGH`, `MEDIUM`, `LOW`, `NOT ENOUGH INFORMATION`).
- **Decadal Trend Rule:** Requires at least 5 continuous valid years from the satellite archive.
- **Mandatory Local-Check Alert:**
  > *"Local Check: Verify canal water schedules, seed prices, soil salinity, pest pressure, and field-specific conditions before planting."*
- **Broad-Area Disclaimer:**
  > *"NASA satellite data represents broad-area conditions, not a field-specific measurement."*
- **No False Claims:** Zero claims of guaranteed yield, profit, or water delivery certainty.

### 4.5 Map-Based Field Location & Boundary Selection (`/farms/new`, `/farms/[farmId]/edit`, `/farms/[farmId]`)
- **Interactive Field Boundary Mapper:** Draw cultivated polygon boundaries directly on an interactive Leaflet map canvas.
- **Automated Field Area Calculation:** Precision spherical geodesic area calculation using Turf.js in acres and hectares (`1 ha = 2.47105 acres`).
- **GeoJSON Polygon Storage:** Validated `[longitude, latitude]` closed polygon geometry with strict boundary integrity and self-intersection prevention.
- **Manual Area Override:** Optional override supporting official land registry records while preserving boundary geometry.
- **Detail Preview & Disclaimers:** Visual polygon overlay on farm detail views with standard scientific approximation advisories.

---

## 5. Automated Verification Checklist

AgroShift includes automated test suites covering all scientific and technical gates:

- **Backend Pytest Suite (62 tests):**
  - Multi-NASA fill-value normalization (`<= -900` to `None`)
  - GeoJSON Polygon validation, boundary closure, bounds checking, and area source rules
  - Deterministic crop recommendation scoring
  - Multi-source bare-field logic
  - Data degradation and upstream retry failure handling
- **Frontend Playwright E2E & Geospatial Unit Tests (20 tests):**
  - Interactive Leaflet map loading, location pinning, and polygon drawing
  - Real-time geodesic area calculation and unit switching (Acres ↔ Hectares)
  - Coordinate order fidelity (Leaflet `[lat, lon]` ↔ GeoJSON `[lon, lat]`)
  - 4-step progressive onboarding and speech input
  - Multi-NASA traffic-light dashboard inspection
  - 3-strategy side-by-side comparison
  - Accessible touch targets and mobile viewport rendering (375px)
  - 10-year decadal trend analyzer (`>= 5 valid years` rule)
  - Bare-field detection requiring `>= 2` independent signals
  - Partial upstream availability handling
  - Farmer profile CRUD and phone number privacy masking
  - Voice intent parser for English and Urdu
  - 3-Strategy rotation comparison and deterministic goal weighting
  - Canonical `ApiError` error contract with unique `request_id`
  - ReportLab PDF generation and climate CSV export
- **Root E2E Test Suite (2 tests):**
  - `test_e2e_workflow.py`: Complete 9-step judge demo pipeline
  - `test_e2e_farmer_workflow.py`: Full Phase 6 farmer decision lifecycle
- **Frontend Production Build:**
  - `npm run build` compiles 18 static and dynamic routes with **zero TypeScript errors**.

---

## 6. Hackathon Judging Alignment

| Hackathon Criterion | AgroShift Implementation |
|---|---|
| **Relevance & Impact** | Directly targets climate resilience and water stress in Pakistan's vulnerable Peshawar Valley basin. |
| **Use of NASA Data** | Synthesizes NASA SMAP L4, GPM IMERG, MODIS/VIIRS NDVI, and NASA POWER into operational decision support. |
| **Scientific Integrity** | `-999` fill values normalized to `null`; `connectNulls={false}`; zero claims of guaranteed yield or profit. |
| **Farmer Accessibility** | Voice recognition in Urdu and English, progressive onboarding, and traffic-light visual cards. |
| **Technical Quality** | Next.js App Router, TypeScript, Tailwind CSS, FastAPI, Pydantic v2, SQLAlchemy, Recharts, ReportLab, 100% test pass rate. |

---

## 7. API Route Directory

All operational API endpoints are versioned with the `/api/v1` prefix and implement the canonical `ApiError` format:

| Method | Route | Description |
|---|---|---|
| `GET` | `/health` | Server health check (HTTP 200) |
| `GET` | `/api/v1/health` | Canonical API health check |
| `GET` | `/docs` | Interactive OpenAPI Swagger UI documentation |
| `POST` | `/api/v1/farmers` | Create farmer profile (bilingual, literacy support) |
| `GET` | `/api/v1/farmers` | List farmer profiles (with masked phone numbers) |
| `GET` | `/api/v1/farmers/{farmer_id}` | Retrieve specific farmer profile |
| `PUT` | `/api/v1/farmers/{farmer_id}` | Update farmer profile |
| `DELETE` | `/api/v1/farmers/{farmer_id}` | Delete farmer profile safely |
| `POST` | `/api/v1/farmers/voice-intent` | Parse spoken English/Urdu voice transcripts |
| `POST` | `/api/v1/farms` | Create new farm profile with coordinate validation |
| `GET` | `/api/v1/farms` | List registered farm profiles |
| `GET` | `/api/v1/farms/{farm_id}` | Retrieve farm overview with crop rotation history |
| `PUT` | `/api/v1/farms/{farm_id}` | Update farm boundary, soil, or irrigation attributes |
| `DELETE` | `/api/v1/farms/{farm_id}` | Safe cascade deletion of farm |
| `POST` | `/api/v1/farms/{farm_id}/crop-history` | Record historical crop season entry |
| `GET` | `/api/v1/farms/{farm_id}/crop-history` | List crop history records for farm |
| `GET` | `/api/v1/crops` | List 9 regional Peshawar Valley crops catalog |
| `GET` | `/api/v1/crops/{crop_id}` | Get agronomic parameters for single crop |
| `GET` | `/api/v1/nasa/power/daily` | Query NASA POWER Daily Point API directly |
| `GET` | `/api/v1/climate/summary` | Aggregate climate metrics, GDD, and heat alerts |
| `GET` | `/api/v1/climate/history` | Historical daily time-series with null-safe fill handling |
| `GET` | `/api/v1/earth-observation/unified` | Multi-source fused satellite checkup (SMAP+IMERG+NDVI+POWER) |
| `GET` | `/api/v1/earth-observation/historical-trends` | 10-year decadal trend analysis |
| `GET` | `/api/v1/recommendations/strategies` | Side-by-side 3-strategy comparison matrix |
| `POST` | `/api/v1/recommendations/generate` | Generate deterministic crop-rotation recommendation set |
| `GET` | `/api/v1/recommendations/{id}` | Retrieve generated recommendation set |
| `POST` | `/api/v1/scenarios/compare` | Multi-scenario comparison matrix |
| `GET` | `/api/v1/reports/pdf` | Generate downloadable executive PDF summary |
| `GET` | `/api/v1/reports/csv` | Download multi-NASA climate dataset with `NA` missing values |

---

## 8. NASA Data Flows & Scientific Processing

1. **NASA POWER Daily Point API:**
   - Endpoint: `https://power.larc.nasa.gov/api/temporal/daily/point`
   - Parameters: `T2M`, `T2M_MAX`, `T2M_MIN`, `PRECTOTCORR`, `RH2M`, `ALLSKY_SFC_SW_DWN`
   - Fill-value handling: Values `<= -900` are converted strictly to `None` in Python and `null` in JSON.
   - Missing observations are never coerced to `0` or `false`.
   - Aggregations: Sums and daily means for precipitation; arithmetic means for temperature, humidity, and radiation.
2. **NASA SMAP L4 / Crop-CASMA:**
   - 9 km root-zone soil moisture (0–100 cm depth).
   - Flag trigger: `root_zone_soil_moisture < 25 mm/m` triggers a dry root-zone warning.
3. **NASA GPM IMERG:**
   - 10 km satellite precipitation estimates.
   - Dry-spell tracking: `consecutive_dry_days >= 14` triggers a dry-spell risk indicator.
   - Heavy rain trigger: `daily_precipitation >= 20 mm` triggers an erosion vulnerability warning.
4. **NASA MODIS / VIIRS NDVI:**
   - 250m–500m canopy greenness.
   - Bare-field signal: `NDVI < 0.25` combined with SMAP/IMERG moisture deficits confirms bare-soil fallow exposure.
5. **Decadal Trend Analysis:**
   - Compares the recent 90-day window against a 10-year climatological baseline.
   - Enforces a minimum of 5 valid historical years before computing trends.

---

## 9. Scientific Limitations & Responsible AI

- **Spatial Resolution:** Gridded satellite reanalysis (0.5° × 0.625° for POWER, 9 km for SMAP, 10 km for IMERG) captures broad regional weather and soil trends, not sub-field variations.
- **Latency:** NASA POWER has an inherent 2–4 day latency; IMERG Early run has ~4 hours latency; SMAP has 2–3 days latency.
- **No False Certainty:** AgroShift never guarantees yield, profit, water volumes, or crop survival. All recommendations are labeled as tentative, decision-support guidance.
- **Local Verification Requirement:** Every recommendation and dashboard page reminds farmers to consult local Khyber Pakhtunkhwa extension officers, test field salinity, and inspect local canal irrigation rotations before planting.

---

## 10. Judge Demonstration Script

1. **Step 1 — Landing (`/`):** View Peshawar Valley context, challenge badges, and Team InCir credentials. Click **"Start Farmer Onboarding"**.
2. **Step 2 — Onboarding (`/onboarding`):**
   - Click the interactive Leaflet map to select a demo parcel in Peshawar (`34.0151, 71.5249`) or Charsadda.
   - Use voice input or click **"Wheat (گندم)"** as current crop and **"Tube Well"** irrigation.
   - Select primary goal: **"Save Water (پانی بچاؤ)"**. Submit to create profile and redirect to dashboard.
3. **Step 3 — Multi-NASA Health Checkup (`/dashboard/farmer`):**
   - Review the traffic-light indicators: SMAP Soil Moisture (Orange/Dry), GPM Rain Deficit (Yellow), NDVI Canopy (Low), POWER Heat (Moderate).
   - Note the multi-signal bare-field alert.
4. **Step 4 — 3-Strategy Comparison (`/recommendations/compare`):**
   - Inspect the 3 side-by-side plans:
     - Baseline (Wheat → Maize → Fallow)
     - Water-Saver Pulse Fix (Wheat → Mung Bean → Chickpea)
     - Soil-Shield Forage (Wheat → Berseem Clover → Maize)
   - Compare transparent scores, radar weights, and satellite evidence citations.
5. **Step 5 — Exports (`/dashboard/reports`):**
   - Click **"Export PDF Report"** to view the generated executive farm plan.
   - Click **"Export Climate CSV"** to inspect the clean tabular data with explicit `NA` fill handling and satellite provenance.

---

## 11. Team InCir — Abasyn University Peshawar

1. **Muhammad Talha** (Team Lead) — BS Software Engineering, 6th Semester
2. **Sana Jalal** — BS Software Engineering, 6th Semester
3. **Hira Dawood** — BS Software Engineering, 6th Semester
4. **Sudais Ahmad** — BS AI, 6th Semester
5. **Aqsa Faisal** — BS AI, 6th Semester


