# AgroShift — 7-Slide Judge Presentation Deck
## NASA Space Apps Challenge 2026 — Field Shift: Adapting Farms with NASA Data

- **Team:** Team InCir
- **Institution:** Abasyn University Peshawar
- **Team Lead:** Muhammad Talha (5 Members)
- **Product:** AgroShift
- **Primary NASA Source:** NASA POWER Daily Point API
- **Supporting NASA Sources:** NASA SMAP / Crop-CASMA, NASA GPM IMERG, NASA MODIS / VIIRS NDVI
- **Target Geography:** Peshawar Valley, Khyber Pakhtunkhwa, Pakistan (`34.0151° N, 71.5249° E`)

---

## Presentation Timing Guide

| Slide | Focus | Standard Pacing (3m 10s) | Strict Pacing (2m 40s) |
|---|---|---|---|
| **Slide 1** | Title & Credibility | 0:00 – 0:15 (15s) | 0:00 – 0:10 (10s) |
| **Slide 2** | The Local Farm Problem | 0:15 – 0:40 (25s) | 0:10 – 0:25 (15s) |
| **Slide 3** | The AgroShift Solution | 0:40 – 1:10 (30s) | 0:25 – 0:45 (20s) |
| **Slide 4** | NASA Satellite Engine | 1:10 – 1:50 (40s) | 0:45 – 1:15 (30s) |
| **Slide 5** | 3-Strategy Live Demo | 1:50 – 2:45 (55s) | 1:15 – 2:00 (45s) |
| **Slide 6** | Impact & Responsible AI | 2:45 – 3:15 (30s) | 2:00 – 2:25 (25s) |
| **Slide 7** | Team, Tech & Next Steps | 3:15 – 3:30 (15s) | 2:25 – 2:40 (15s) |

---

# SLIDE 1 — TITLE & INTRODUCTION

### Headline
# AgroShift
### Subheadline
**Turning NASA Satellite Insights Into Smarter Farm Decisions**

### Supporting Text
*Climate-aware crop planning for Peshawar Valley*

### Team & Credibility Block
```text
Team: Team InCir
Institution: Abasyn University Peshawar
Team Lead: Muhammad Talha (5 members)

Challenge: Field Shift: Adapting Farms with NASA Data
Location: Peshawar Valley, Pakistan (34.0151° N, 71.5249° E)
Core Engine: NASA POWER, SMAP L4, GPM IMERG, MODIS NDVI
```

### Visual Direction
- Dark green (`#166534`) to NASA blue (`#0B3D91`) gradient background.
- Glowing animated map pin placed over Peshawar Valley on a satellite Earth backdrop.
- NASA Space Apps Challenge 2026 emblem and Team InCir badge.
- Satellite orbital trajectory visually encircling the Peshawar agricultural plain.

### Speaker Note (15 Seconds)
> *"AgroShift helps farmers and local advisors turn NASA satellite observations into simple, transparent crop-rotation choices. It is designed for Peshawar Valley, where changing heat, rainfall, and water availability affect farming decisions."*

---

# SLIDE 2 — THE PROBLEM

### Headline
## Farmers need clear answers, not complicated satellite data.
### Subheadline
**Changing weather makes crop planning harder every season.**

### Core Stresses in Peshawar Valley
- **Rising Heat Extremes (Sun):** May–June heat waves scorch seedlings and force premature grain maturation.
- **Uncertain Rainfall (Cloud/Rain):** Erratic monsoon timing and sudden dry spells disrupt traditional calendars.
- **Limited Irrigation Water (Droplet):** Canal rotations and tube well electricity shortages create critical soil moisture gaps.
- **Post-Harvest Bare Soil:** Prolonged summer fallows leave topsoil exposed to thermal desiccation and wind erosion.

### Critical Farmer Questions
1. *"What should I grow next?"*
2. *"Will my field have enough water?"*
3. *"How can I protect my soil?"*

### Bottom Statement
> **"Satellite data is powerful — but difficult for farmers to access and understand."**

### Speaker Note (25 Seconds)
> *"Farmers make high-stakes decisions with limited local information. AgroShift turns broad-area NASA observations into a simple starting point for planning, while reminding users that local field conditions still matter."*

---

# SLIDE 3 — OUR SOLUTION

### Headline
## Pin your farm. Choose your goal. See three clear plans.
### Subheadline
**AgroShift makes NASA data simple, useful, and farmer-friendly.**

### 4-Step Decision Flow
```text
[ 1. Pin Farm ] ──➔ [ 2. Choose Crop & Goal ] ──➔ [ 3. NASA Checkup ] ──➔ [ 4. Compare 3 Plans ]
```

1. **Pin the Farm:** Select location on an interactive Leaflet map and draw exact field boundary polygons with automatic geodesic area calculation (Acres / Hectares).
2. **Choose Crop & Goal:** Select current/previous crop and primary goal:
   - *Save Water* (پانی بچاؤ)
   - *Rebuild Soil* (مٹی کی زرخیزی)
   - *Improve Income* (بہتر پیداوار)
3. **NASA Satellite Checkup:** Instant multi-sensor health check (soil moisture, heat stress, rainfall deficit, canopy greenness).
4. **Compare 3 Plans:** Transparent side-by-side comparison of 3 rotation options tailored to local conditions.
5. **Download Reports:** One-click executive PDF farm plan and clean tabular CSV export.

### Accessibility Highlights
- **Voice-Assisted Onboarding:** Speech recognition in English and Urdu (اردو) for low-literacy farmers.
- **Large Touch Targets:** Minimum 44×44px interactive controls optimized for mobile handsets in the field.

### Bottom Statement
> **"No technical expertise required."**

### Speaker Note (30 Seconds)
> *"Our solution is designed for accessibility. A farmer can use a map, simple choices, and optional voice input. The app then translates NASA observations into understandable rotation options."*

---

# SLIDE 4 — NASA DATA AT THE CORE

### Headline
## NASA satellites help us see what the field cannot always show.
### Subheadline
**AgroShift combines multiple NASA Earth-observation signals into one simple farm checkup.**

### NASA Constellation Integration Matrix

| NASA Source | What It Helps Us Understand | How AgroShift Uses It |
|---|---|---|
| **NASA POWER** | Temperature, humidity, solar radiation, and 10-year baseline climate conditions | Identifies extreme heat-stress windows and frost-risk conditions. **Primary climate engine.** |
| **NASA SMAP / Crop-CASMA** | 0–5 cm surface and 0–100 cm root-zone soil wetness profile | Flags dry root-zone conditions, moisture trends, and verifies sowing suitability. |
| **NASA GPM IMERG** | High-resolution satellite precipitation estimates | Tracks cumulative rainfall deficits and consecutive dry spells across irrigation zones. |
| **NASA MODIS / VIIRS NDVI** | Vegetation canopy greenness and photosynthetic vigor | Identifies low-greenness stress and detects bare-soil exposure windows. |

### Data Pipeline
```text
NASA Satellites (POWER, SMAP, GPM, MODIS) ──➔ AgroShift Science Engine (Null Integrity) ──➔ Farmer Decision Plans
```

### Scientific Rigor Rule
- **Fill-Value Normalization:** NASA fill values (`<= -900`) strictly map to `null` (never interpolated or defaulted to zero), preserving honest satellite gaps.

### Bottom Statement
> **"NASA POWER is our primary climate-data engine."**

### Speaker Note (40 Seconds)
> *"NASA POWER provides daily climate variables. SMAP and Crop-CASMA provide soil-moisture context. GPM IMERG provides precipitation estimates. NDVI helps us understand vegetation greenness. AgroShift combines these signals while clearly showing data coverage and limitations."*

---

# SLIDE 5 — LIVE DEMO & 3-STRATEGY COMPARISON

### Headline
## From a farm pin to a practical rotation plan.
### Subheadline
**AgroShift turns NASA observations into clear, comparable choices.**

### 3-Strategy Comparison Matrix

| Strategy | Seasonal Sequence | Why NASA Data Suggests It | Impact & Score |
|---|---|---|---|
| **1. Current Baseline** *(Monoculture)* | **Rabi:** Wheat<br>**Kharif:** Maize / Rice<br>*Summer Fallow* | Control benchmark. NASA POWER confirms prolonged heat exposure and SMAP indicates severe soil desiccation during summer fallow. | **Water Demand:** High<br>**Score:** 58 / 100 |
| **2. Water Saver & Pulse Fix** *(Drought Shield)* | **Rabi:** Wheat<br>**Spring:** Mung Bean<br>**Kharif:** Chickpea / Millet | Suggested when GPM IMERG flags rain deficits & SMAP shows depleted root moisture. Short-cycle pulse fixes 35–45 kg N/ha into soil. | **-40% Irrigation Demand**<br>**Score:** 88 / 100 |
| **3. Soil Shield & Forage** *(Thermal Cover)* | **Rabi:** Wheat<br>**Summer:** Berseem Clover<br>**Kharif:** Hybrid Maize | Suggested when MODIS NDVI shows bare ground and POWER shows high solar irradiance. Maintains living canopy to prevent soil erosion. | **+28% Soil Health**<br>**Score:** 82 / 100 |

### Production Quality Gates
- **Interactive Field Mapper:** Live Leaflet boundary drawing with instant Turf.js geodesic area calculation.
- **Fallback Resilience:** Automatic demo data fallback with clear visual `[Demo Data]` badges whenever upstream APIs are unreachable.
- **ReportLab PDF & CSV:** Deterministic exports containing full satellite provenance and timestamps.

### Bottom Statement
> **"Each plan shows seasonal schedule, water-demand indicator, soil-health score, NASA evidence, risks, and assumptions."**

### Speaker Note (55 Seconds)
> *"In the demo, we select a farm near Peshawar, choose wheat, and select water conservation. AgroShift checks NASA-derived conditions and compares a baseline rotation with a pulse-inclusive rotation and a soil-cover rotation. The farmer sees the evidence, trade-offs, and a downloadable plan."*

---

# SLIDE 6 — IMPACT & RESPONSIBLE AI

### Headline
## Better decisions begin with clearer information.
### Subheadline
**AgroShift supports farmers without pretending to guarantee outcomes.**

### Three Trust Pillars

#### 1. Farmer Impact (🌱)
- Simple, transparent starting point for crop planning.
- Clear comparison of rotation trade-offs (water vs. soil fertility).
- Voice-assisted Urdu/English accessible inputs.
- Downloadable PDF and CSV farm plans for extension advisory sessions.

#### 2. Community Impact (👥)
- Calibrated specifically for Peshawar, Charsadda, and Mardan districts.
- Promotes regional aquifer and water-table conservation.
- Empowers public and private agricultural extension officers.
- Encourages pulse crop adoption to reduce synthetic chemical fertilizer dependency.

#### 3. Scientific Honesty (🛡️)
- Satellites observe broad regional pixels (~10–50 km), not farm-specific micro-truth.
- Missing satellite passes remain explicitly labeled as missing.
- Zero black-box AI hallucinations — recommendation rules are 100% deterministic.
- Zero unsupported claims of guaranteed yields, profits, or water savings.

### Mandatory Local-Check Badge
> **Local Check: Verify canal water schedules, seed prices, soil salinity, pest pressure, and field-specific conditions before planting.**

### Speaker Note (30 Seconds)
> *"AgroShift does not promise guaranteed yields or profits. It gives farmers a transparent starting point, shows uncertainty, and encourages local verification before planting."*

---

# SLIDE 7 — TEAM, NASA DATA & NEXT STEPS

### Headline
## Team InCir — Building practical space-data solutions for local farms.
### Subheadline
**NASA data at the core. Local farmers at the center. Transparent decisions throughout.**

### Team InCir (Abasyn University Peshawar)
1. **Muhammad Talha** (Team Lead) — BS Software Engineering, 6th Semester
2. **Sana Jalal** — BS Software Engineering, 6th Semester
3. **Hira Dawood** — BS Software Engineering, 6th Semester
4. **Sudais Ahmad** — BS AI, 6th Semester
5. **Aqsa Faisal** — BS AI, 6th Semester

### Technology Architecture
- **Frontend:** Next.js 14 App Router, TypeScript, Tailwind CSS, Leaflet, React-Leaflet, Recharts, Lucide.
- **Backend:** Python 3.11, FastAPI, Pydantic v2, SQLAlchemy, SQLite, ReportLab.
- **Testing:** 62 Pytest tests, 20 Playwright browser tests, 100% passing.

### Next Operational Steps
1. **Extension Service Integration:** Partner with Khyber Pakhtunkhwa Agricultural Extension Directorate.
2. **Soil Sensor Ground-Truthing:** Couple satellite observations with local soil laboratory test kits.
3. **Multilingual Expansion:** Add native Pashto (پښتو) voice transcription alongside Urdu.
4. **Offline PWA:** Offline caching for remote rural valleys with intermittent mobile cellular connectivity.

### Call to Action
> **AgroShift: NASA data, local decisions.**

### Project Links
- **Local Web App:** `http://localhost:3000`
- **Interactive OpenAPI Documentation:** `http://localhost:8000/docs`
- **Interactive Presentation Deck:** `docs/presentation/AgroShift_7_Slide_Deck.html`

### Speaker Note (15 Seconds)
> *"AgroShift was built by Team InCir from Abasyn University Peshawar, led by Muhammad Talha with Sana Jalal, Hira Dawood, Sudais Ahmad, and Aqsa Faisal — 6th-semester Software Engineering and AI undergraduates. We used NASA POWER as our primary climate-data source, with SMAP/Crop-CASMA, GPM IMERG, and NDVI products supporting the broader Earth-observation checkup. Our goal is to make NASA data useful, understandable, and locally relevant for farmers."*

---

# FINAL CLOSING STATEMENT (VERBATIM FOR PRESENTATION)

> *"AgroShift uses NASA Earth-observation data as the core of its decision-support workflow. It helps farmers and advisors in Peshawar Valley explore climate-aware crop-rotation options, while clearly showing uncertainty, missing data, and the need for local verification. AgroShift does not guarantee outcomes; it makes NASA-derived information more understandable, transparent, and actionable."*
