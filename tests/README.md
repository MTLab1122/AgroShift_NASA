# AgroShift End-to-End Integration Test Suite

This test suite executes the complete judge-demo pipeline:
1. Health check verification (`GET /health`, `GET /api/v1/health`).
2. Farm creation with strict boundary and coordinate checks (`POST /api/v1/farms`).
3. Historical crop rotation cycle logging (`POST /api/v1/farms/{id}/crop-history`).
4. Agroclimatology data retrieval and `-999` fill-value normalization (`GET /api/v1/climate/summary`).
5. NASA POWER provenance and missing data preservation verification.
6. Three-scenario deterministic recommendation generation (`POST /api/v1/recommendations/generate`).
7. Multi-criteria scenario tradeoff comparison (`POST /api/v1/recommendations/compare`).
8. Executive PDF report compilation and binary verification (`POST /api/v1/reports/pdf`).
9. Climate CSV export with ISO dates and unit headers (`GET /api/v1/reports/climate-csv`).

## Running Tests
From repository root:
```bash
pytest tests/test_e2e_workflow.py -v
```
Or from `backend`:
```bash
pytest -v
```
