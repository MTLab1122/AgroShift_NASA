# AgroShift Architecture & System Design

```
+-----------------------------------------------------------------------------------+
|                                Next.js 14 Frontend                                 |
|  (App Router, TypeScript, Tailwind CSS, Leaflet Maps, Recharts, Lucide Icons)       |
+----------------------------------------+------------------------------------------+
                                         | REST / JSON
                                         v
+-----------------------------------------------------------------------------------+
|                                 FastAPI Backend                                    |
|                             (Python 3.11, Pydantic v2)                            |
+----------------------------------------+------------------------------------------+
|  +--------------------+  +--------------------+  +------------------------------+  |
|  |  Farm Management   |  | NASA POWER Engine  |  | Agro Intelligence Engine     |  |
|  |  - CRUD Profile    |  | - Client & Cache   |  | - Deterministic Scoring      |  |
|  |  - Crop History    |  | - -999 Normalizer  |  | - 3 Standard Scenarios       |  |
|  |  - Geolocation Val |  | - Aggregator       |  | - Risk/Benefit/Assumptions   |  |
|  +--------------------+  +--------------------+  +------------------------------+  |
|  +--------------------+  +--------------------+  +------------------------------+  |
|  | Reports Engine     |  | Canonical Contracts|  | Database Layer               |  |
|  | - PDF (ReportLab)  |  | - Shared JSON Schem|  | - SQLite (SQLAlchemy 2.0)    |  |
|  | - CSV Generator    |  | - ApiError Handler |  | - Auto-seeded Demo Farm      |  |
|  +--------------------+  +--------------------+  +------------------------------+  |
+-----------------------------------------------------------------------------------+
                                         |
                                         v Upstream Call (HTTPS)
                  +----------------------------------------------+
                  | NASA POWER Daily Point Agroclimatology API   |
                  | (0.5° x 0.625° Satellite Reanalysis Grid)    |
                  +----------------------------------------------+
```

## 1. Monorepo Structure
- `backend/`: FastAPI application, modular routers, database models, services, and pytest suites.
- `frontend/`: Next.js App Router client application with SSR-safe Leaflet mapping and Recharts data visualizations.
- `shared/schemas/`: Canonical JSON Schemas acting as single source of truth for contracts.
- `data/`: Audited demo fixtures (`data/demo/`) and Peshawar Valley crop catalog (`data/crop-catalog/`).
- `docs/`: Comprehensive technical, scientific, and presentation documentation.
- `tests/`: End-to-end integration workflows.

## 2. Core Modules
1. **Farm Management Module (`backend/app/modules/farm_management/`):**
   Handles farm profiles, boundary markers, and historical cropping records with strict bounds validation.
2. **NASA POWER Climate Module (`backend/app/modules/nasa_data/`):**
   Fetches raw daily point data, dynamically reads units, strips `-999` fill values into `null`, aggregates statistics, and provides in-memory TTL caching and audited demo fallback.
3. **Agro Intelligence & Rotation Engine (`backend/app/modules/agro_intelligence/`):**
   Deterministic, transparent recommendation engine that generates exactly 3 distinct cropping rotations (`baseline`, `pulse_inclusive`, `soil_cover`) with detailed score breakdowns.
4. **Reports Module (`backend/app/modules/reports/`):**
   Produces professional executive PDF summaries via `reportlab` and standards-compliant CSV files.

## 3. Database Architecture
Configurable SQLite database accessed via SQLAlchemy 2.0 (`DATABASE_URL=sqlite:///./agroshift.db`). On initial startup with an empty database, AgroShift automatically seeds the Peshawar Valley demo farm (`demo-peshawar-001`).
