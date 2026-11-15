# AgroShift Judge Demonstration Script
**NASA Space Apps Challenge 2026 — Field Shift: Adapting Farms with NASA Data**
**Team InCir — Abasyn University Peshawar**
- **Muhammad Talha** (Team Lead) — BS Software Engineering, 6th Semester
- **Sana Jalal** — BS Software Engineering, 6th Semester
- **Hira Dawood** — BS Software Engineering, 6th Semester
- **Sudais Ahmad** — BS AI, 6th Semester
- **Aqsa Faisal** — BS AI, 6th Semester

---

## 1. Executive Problem Framing (Minute 0:00 - 0:45)
- **The Challenge:** In Pakistan's Peshawar Valley, climate shifts are hitting smallholders through terminal heat waves on wheat and escalating pumping costs during summer droughts.
- **The Core Problem:** Farmers lack accessible, location-specific agroclimatological intelligence to adapt crop rotations without taking catastrophic risks.
- **Our Answer:** **AgroShift** — a decision-support platform that transforms multi-NASA Earth observations (SMAP, IMERG, MODIS, POWER) into actionable, soil-health-positive crop rotation scenarios with voice-assisted farmer accessibility.

---

## 2. Farmer-First Voice Onboarding (Minute 0:45 - 1:30)
- **Navigation:** Open `/onboarding`.
- **Key Points to Show Judges:**
  1. **4-Step Progressive Wizard:** Location Pinning -> Crop Selection -> Water & Irrigation -> Primary Goal.
  2. **Voice Recognition in English and Urdu:** Click the large **"Speak"** button and speak: `"گندم اور ٹیوب ویل پانی بچاؤ"` or `"Wheat and tube-well save water"`.
  3. **Human-in-the-Loop Confirmation:** Show that recognized speech is displayed in an editable popover for farmer verification before applying to the form.
  4. **Urdu / English Interface Toggle:** Large, accessible UI buttons designed for smallholders with varying literacy.

---

## 3. Multi-NASA Earth-Observation Satellite Checkup (Minute 1:30 - 2:45)
- **Navigation:** Open `/dashboard/farmer`.
- **Key Points to Show Judges:**
  1. **Traffic-Light Satellite Health Card:**
     - **NASA SMAP L4 (9 km):** Root-zone soil moisture at 19.8 mm/m (Yellow - Below 25 mm/m threshold).
     - **NASA GPM IMERG (10 km):** 16 consecutive dry days (Yellow - Dry spell risk).
     - **NASA MODIS / VIIRS (250m):** NDVI 0.21 (Yellow - Bare-field summer fallow window).
     - **NASA POWER API:** 38 heat-stress days `>= 35°C` (Red - High thermal load).
  2. **Multi-Signal Bare-Field Detection:** Highlight that bare-field windows are strictly verified using **at least two independent physical satellite signals** (optical NDVI + microwave root-zone soil moisture).
  3. **10-Year Decadal Trends:** 10-year baseline vs recent conditions; enforces the rule that `>= 5 valid years` are strictly required.

---

## 4. Three-Strategy Rotation Comparison (Minute 2:45 - 4:00)
- **Navigation:** Open `/recommendations/compare`.
- **Key Points to Show Judges:**
  1. **Three Clear Benchmark Rotations:**
     - **Baseline:** Conventional High-Water Monoculture (Wheat → Maize → Fallow).
     - **Water-Saver Pulse Fix:** Low-water pulse sequence (Wheat → Mung Bean → Chickpea/Millet) reducing modeled irrigation passes by ~40%.
     - **Soil-Shield Forage:** Continuous biological cover (Berseem Clover → Maize → Cowpea Cover) preventing summer bare-field solar baking.
  2. **Satellite Evidence Injection:** Every strategy cites at least two specific NASA data streams (e.g. SMAP root moisture and IMERG dry spells).
  3. **Deterministic 5-Dimensional Scoring:** Transparent tradeoff radar/bar chart evaluating Water Fit, Climate Suitability, Soil Health, Income Stability, and Implementation Feasibility.
  4. **Confidence Badge & Mandatory Local Check:**
     - Shows `Confidence: HIGH`.
     - Prominently displays:
       > *"Local Check: Verify canal water schedules, seed prices, soil salinity, pest pressure, and field-specific conditions before planting."*
       > *"NASA satellite data represents broad-area conditions, not a field-specific measurement."*

---

## 5. Judge-Ready Reports & Data Export (Minute 4:00 - 4:45)
- **Navigation:** Click **"Export PDF Plan"** and **"CSV Data"**.
- **Key Points:**
  1. **ReportLab PDF Executive Brief:** Contains farmer profile, multi-NASA satellite checkup, 3-strategy comparison table, confidence badge, and local check disclaimers.
  2. **Climate CSV Export:** Exports standardized records with ISO dates, parameter units, and multi-NASA columns (`root_zone_soil_moisture_mm_m`, `ndvi`) with `NA` for missing entries.

---

## 6. Closing Statement (Minute 4:45 - 5:00)
> *"AgroShift demonstrates how multi-stream NASA Earth observations — from SMAP microwave moisture to MODIS canopy dynamics — can directly empower agricultural communities on the front lines of climate adaptation. By combining scientific integrity, voice accessibility in local languages, and transparent rotation tradeoffs, we give farmers decision support they can genuinely trust."*
