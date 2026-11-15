# AgroShift Integration & Verification Checklist

| Phase | Milestone / Component | Contract / Path | Status | Verification Method |
|---|---|---|---|---|
| **Phase 0** | Backend Base & Schemas | `shared/schemas/*.json` | Complete | JSON Schema validation |
| **Phase 0** | Health Endpoints | `GET /health`, `GET /api/v1/health` | Complete | HTTP 200 exact shape check |
| **Phase 0** | SQLite Demo Seed | `demo-peshawar-001` | Complete | Startup seed verification |
| **Phase 0** | Canonical Error Model | `ApiError` with `request_id` | Complete | Validation error tests |
| **Phase 1** | Farm Management | `POST/GET/PUT/DELETE /api/v1/farms` | In Progress | Pytest CRUD suite |
| **Phase 1** | Crop History CRUD | `POST/GET/PUT/DELETE /api/v1/farms/{id}/crop-history` | In Progress | Linked foreign-key tests |
| **Phase 1** | Leaflet Picker | `FarmLocationPicker.tsx` | In Progress | Dynamic client-only SSR check |
| **Phase 2** | NASA POWER Client | `GET /api/v1/nasa/power` | In Progress | Mocked & live test harness |
| **Phase 2** | -999 Normalizer | Convert `<= -900` to `null` | In Progress | Fill-value test suite |
| **Phase 2** | Aggregations | Monthly & overall means/sums | In Progress | Math precision tests |
| **Phase 2** | Demo Fallback | `?use_demo_fallback=true` | In Progress | Resiliency tests |
| **Phase 3** | Crop Catalog | 9 Peshawar Valley Crops | Complete | Data fixture inspection |
| **Phase 3** | Rotation Engine | `POST /api/v1/recommendations/generate` | In Progress | Deterministic 3-scenario tests |
| **Phase 4** | PDF Report Engine | `POST /api/v1/reports/pdf` | In Progress | ReportLab binary test |
| **Phase 4** | Next.js Dashboard | `/dashboard`, `/dashboard/climate`, etc. | In Progress | Production build test |
| **Phase 5** | End-to-End Workflow | `tests/test_e2e_workflow.py` | In Progress | Full pipeline automation |
