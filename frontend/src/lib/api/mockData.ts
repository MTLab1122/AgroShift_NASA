// Auto-generated mock datasets for offline & GitHub Pages 24/7 access
export const MOCK_CROPS = [
  {
    "crop_id": "wheat",
    "name": "Wheat (Gandum)",
    "category": "cereal",
    "is_legume": false,
    "seasons": [
      "rabi"
    ],
    "duration_days": 140,
    "water_demand": "medium",
    "suitable_soils": [
      "loamy",
      "clay"
    ],
    "incompatible_predecessors": [
      "wheat"
    ],
    "evidence_note": "Primary staple cereal in Khyber Pakhtunkhwa. Sensitive to terminal heat stress during grain filling (March-April). Recommended following kharif pulses or maize.",
    "evidence_status": "documented"
  },
  {
    "crop_id": "maize",
    "name": "Maize (Makai)",
    "category": "cereal",
    "is_legume": false,
    "seasons": [
      "kharif",
      "zaid"
    ],
    "duration_days": 105,
    "water_demand": "medium",
    "suitable_soils": [
      "loamy",
      "sandy",
      "clay"
    ],
    "incompatible_predecessors": [
      "maize"
    ],
    "evidence_note": "Extensively cultivated across Peshawar and Charsadda valley floor. Moderate drought sensitivity during silking. Rotates efficiently with rabi wheat or pulses.",
    "evidence_status": "documented"
  },
  {
    "crop_id": "rice",
    "name": "Rice (Dhan / Shali)",
    "category": "cereal",
    "is_legume": false,
    "seasons": [
      "kharif"
    ],
    "duration_days": 120,
    "water_demand": "high",
    "suitable_soils": [
      "clay",
      "loamy"
    ],
    "incompatible_predecessors": [
      "rice"
    ],
    "evidence_note": "High water-demand crop restricted to canal command zones or high tube-well discharge areas in Peshawar Valley. Incurs high pumping costs when groundwater is deep.",
    "evidence_status": "documented"
  },
  {
    "crop_id": "sugarcane",
    "name": "Sugarcane (Ganna)",
    "category": "cash_crop",
    "is_legume": false,
    "seasons": [
      "annual"
    ],
    "duration_days": 330,
    "water_demand": "high",
    "suitable_soils": [
      "loamy",
      "clay"
    ],
    "incompatible_predecessors": [],
    "evidence_note": "Year-round perennial cash crop feeding local sugar mills in Peshawar, Mardan, and Charsadda. High total water requirement throughout summer peak irradiance.",
    "evidence_status": "documented"
  },
  {
    "crop_id": "mustard",
    "name": "Mustard / Rapeseed (Raya / Toria)",
    "category": "oilseed",
    "is_legume": false,
    "seasons": [
      "rabi"
    ],
    "duration_days": 110,
    "water_demand": "low",
    "suitable_soils": [
      "loamy",
      "sandy"
    ],
    "incompatible_predecessors": [
      "mustard"
    ],
    "evidence_note": "Low water-demand rabi oilseed suitable for moisture-constrained or tail-end canal lands. Vulnerable to aphid infestation if high relative humidity persists.",
    "evidence_status": "documented"
  },
  {
    "crop_id": "chickpea",
    "name": "Chickpea / Gram (Chana)",
    "category": "pulse",
    "is_legume": true,
    "seasons": [
      "rabi"
    ],
    "duration_days": 130,
    "water_demand": "low",
    "suitable_soils": [
      "sandy",
      "loamy"
    ],
    "incompatible_predecessors": [
      "chickpea",
      "lentil"
    ],
    "evidence_note": "Symbiotic nitrogen-fixing pulse. Well adapted to sandy loam and low rainfall areas. Susceptible to Ascochyta blight under continuous high humidity or waterlogging.",
    "evidence_status": "documented"
  },
  {
    "crop_id": "lentil",
    "name": "Lentil (Masoor)",
    "category": "pulse",
    "is_legume": true,
    "seasons": [
      "rabi"
    ],
    "duration_days": 115,
    "water_demand": "low",
    "suitable_soils": [
      "loamy",
      "clay",
      "sandy"
    ],
    "incompatible_predecessors": [
      "chickpea",
      "lentil"
    ],
    "evidence_note": "Nitrogen-fixing cool-season pulse. Modest water requirements. Excellent break crop in cereal-dominated rotations to improve soil biological activity.",
    "evidence_status": "documented"
  },
  {
    "crop_id": "mung_bean",
    "name": "Mung Bean (Mung)",
    "category": "pulse",
    "is_legume": true,
    "seasons": [
      "kharif",
      "zaid"
    ],
    "duration_days": 70,
    "water_demand": "low",
    "suitable_soils": [
      "loamy",
      "sandy"
    ],
    "incompatible_predecessors": [
      "mung_bean"
    ],
    "evidence_note": "Short-duration summer/spring legume fitting narrow windows between wheat harvest and kharif planting. Fixes atmospheric nitrogen and requires minimal irrigation.",
    "evidence_status": "documented"
  },
  {
    "crop_id": "berseem_clover",
    "name": "Berseem Clover (Shaftal / Berseem)",
    "category": "forage_cover",
    "is_legume": true,
    "seasons": [
      "rabi"
    ],
    "duration_days": 180,
    "water_demand": "medium",
    "suitable_soils": [
      "loamy",
      "clay"
    ],
    "incompatible_predecessors": [],
    "evidence_note": "Multi-cut rabi forage legume known locally as the 'King of Forages'. High biological nitrogen fixation, dense soil canopy cover, and excellent soil structure improvement.",
    "evidence_status": "documented"
  }
];

export const MOCK_FARMS = [{
  "farm_id": "demo-peshawar-001",
  "name": "[DEMO] Peshawar Valley Demo Farm",
  "latitude": 34.0151,
  "longitude": 71.5249,
  "area_value": 5.0,
  "area_unit": "acres",
  "soil_type": "loamy",
  "irrigation_type": "tube_well",
  "water_availability": "medium",
  "is_demo_data": true,
  "created_at": "2026-10-01T08:00:00Z",
  "updated_at": "2026-10-01T08:00:00Z",
  "crop_history": [
    {
      "entry_id": "hist-demo-001",
      "farm_id": "demo-peshawar-001",
      "crop_name": "Wheat (Gandum)",
      "season": "rabi",
      "start_date": "2025-11-15",
      "end_date": "2026-04-20",
      "notes": "Standard sowing post-kharif maize. Conventional flood irrigation via tube-well.",
      "is_demo_data": true,
      "created_at": "2026-10-01T08:00:00Z"
    },
    {
      "entry_id": "hist-demo-002",
      "farm_id": "demo-peshawar-001",
      "crop_name": "Maize (Makai)",
      "season": "kharif",
      "start_date": "2026-06-01",
      "end_date": "2026-09-25",
      "notes": "Grain maize hybrid. Encountered moderate irrigation power supply gaps in July.",
      "is_demo_data": true,
      "created_at": "2026-10-01T08:00:00Z"
    }
  ]
}];

export const MOCK_CLIMATE_SUMMARY = {
  "source": "NASA POWER Daily Point API (AG Community)",
  "dataset_or_endpoint": "https://power.larc.nasa.gov/api/temporal/daily/point",
  "latitude": 34.0151,
  "longitude": 71.5249,
  "start_date": "2026-05-01",
  "end_date": "2026-07-31",
  "parameters": [
    "T2M",
    "T2M_MAX",
    "T2M_MIN",
    "PRECTOTCORR",
    "RH2M",
    "ALLSKY_SFC_SW_DWN"
  ],
  "parameter_units": {
    "T2M": "\u00b0C",
    "T2M_MAX": "\u00b0C",
    "T2M_MIN": "\u00b0C",
    "PRECTOTCORR": "mm/day",
    "RH2M": "%",
    "ALLSKY_SFC_SW_DWN": "MJ/m^2/day"
  },
  "retrieved_at": "2026-10-01T12:00:00Z",
  "missing_data": {
    "missing_days_count": 2,
    "total_days_count": 92,
    "missing_percentage": 2.17,
    "parameters_with_gaps": [
      "T2M",
      "T2M_MAX",
      "T2M_MIN",
      "PRECTOTCORR",
      "RH2M",
      "ALLSKY_SFC_SW_DWN"
    ]
  },
  "coverage_note": "[DEMO] NASA POWER satellite reanalysis (MERRA-2/GEOS-FP) gridded cell centered at (34.0151, 71.5249). Includes 2 simulated fill-value (-999) gaps properly rendered as null.",
  "is_demo_data": true,
  "overall": {
    "total_days": 92,
    "t2m_mean": 33.32,
    "t2m_max_mean": 40.32,
    "t2m_min_mean": 26.33,
    "prectotcorr_sum": 18.9,
    "prectotcorr_daily_mean": 0.21,
    "rh2m_mean": 54.54,
    "allsky_sfc_sw_dwn_mean": 24.3
  },
  "monthly": [
    {
      "month": "2026-05",
      "days_in_month": 31,
      "valid_days": 30,
      "t2m_mean": 30.06,
      "t2m_max_mean": 37.05,
      "t2m_min_mean": 23.07,
      "prectotcorr_sum": 0.0,
      "prectotcorr_daily_mean": 0.0,
      "rh2m_mean": 46.2,
      "allsky_sfc_sw_dwn_mean": 24.37
    },
    {
      "month": "2026-06",
      "days_in_month": 30,
      "valid_days": 29,
      "t2m_mean": 33.31,
      "t2m_max_mean": 40.3,
      "t2m_min_mean": 26.31,
      "prectotcorr_sum": 2.1,
      "prectotcorr_daily_mean": 0.07,
      "rh2m_mean": 54.55,
      "allsky_sfc_sw_dwn_mean": 24.32
    },
    {
      "month": "2026-07",
      "days_in_month": 31,
      "valid_days": 31,
      "t2m_mean": 36.49,
      "t2m_max_mean": 43.49,
      "t2m_min_mean": 29.5,
      "prectotcorr_sum": 16.8,
      "prectotcorr_daily_mean": 0.54,
      "rh2m_mean": 62.6,
      "allsky_sfc_sw_dwn_mean": 24.2
    }
  ],
  "records": [
    {
      "date": "2026-05-01",
      "t2m": 29.0,
      "t2m_max": 36.0,
      "t2m_min": 22.0,
      "prectotcorr": 0.0,
      "rh2m": 42.0,
      "allsky_sfc_sw_dwn": 22.5
    },
    {
      "date": "2026-05-02",
      "t2m": 29.65,
      "t2m_max": 36.7,
      "t2m_min": 22.6,
      "prectotcorr": 0.0,
      "rh2m": 43.5,
      "allsky_sfc_sw_dwn": 23.3
    },
    {
      "date": "2026-05-03",
      "t2m": 30.3,
      "t2m_max": 37.4,
      "t2m_min": 23.2,
      "prectotcorr": 0.0,
      "rh2m": 45.0,
      "allsky_sfc_sw_dwn": 24.1
    },
    {
      "date": "2026-05-04",
      "t2m": 30.5,
      "t2m_max": 37.2,
      "t2m_min": 23.8,
      "prectotcorr": 0.0,
      "rh2m": 46.5,
      "allsky_sfc_sw_dwn": 24.9
    },
    {
      "date": "2026-05-05",
      "t2m": 30.75,
      "t2m_max": 37.9,
      "t2m_min": 23.6,
      "prectotcorr": 0.0,
      "rh2m": 48.0,
      "allsky_sfc_sw_dwn": 25.7
    },
    {
      "date": "2026-05-06",
      "t2m": 29.4,
      "t2m_max": 36.6,
      "t2m_min": 22.2,
      "prectotcorr": 0.0,
      "rh2m": 49.5,
      "allsky_sfc_sw_dwn": 26.5
    },
    {
      "date": "2026-05-07",
      "t2m": 29.6,
      "t2m_max": 36.4,
      "t2m_min": 22.8,
      "prectotcorr": 0.0,
      "rh2m": 51.0,
      "allsky_sfc_sw_dwn": 22.5
    },
    {
      "date": "2026-05-08",
      "t2m": 30.25,
      "t2m_max": 37.1,
      "t2m_min": 23.4,
      "prectotcorr": 0.0,
      "rh2m": 42.0,
      "allsky_sfc_sw_dwn": 23.3
    },
    {
      "date": "2026-05-09",
      "t2m": 30.5,
      "t2m_max": 37.8,
      "t2m_min": 23.2,
      "prectotcorr": 0.0,
      "rh2m": 43.5,
      "allsky_sfc_sw_dwn": 24.1
    },
    {
      "date": "2026-05-10",
      "t2m": 30.7,
      "t2m_max": 37.6,
      "t2m_min": 23.8,
      "prectotcorr": 0.0,
      "rh2m": 45.0,
      "allsky_sfc_sw_dwn": 24.9
    },
    {
      "date": "2026-05-11",
      "t2m": 29.35,
      "t2m_max": 36.3,
      "t2m_min": 22.4,
      "prectotcorr": 0.0,
      "rh2m": 46.5,
      "allsky_sfc_sw_dwn": 25.7
    },
    {
      "date": "2026-05-12",
      "t2m": 30.0,
      "t2m_max": 37.0,
      "t2m_min": 23.0,
      "prectotcorr": 0.0,
      "rh2m": 48.0,
      "allsky_sfc_sw_dwn": 26.5
    },
    {
      "date": "2026-05-13",
      "t2m": 29.8,
      "t2m_max": 36.8,
      "t2m_min": 22.8,
      "prectotcorr": 0.0,
      "rh2m": 49.5,
      "allsky_sfc_sw_dwn": 22.5
    },
    {
      "date": "2026-05-14",
      "t2m": 30.45,
      "t2m_max": 37.5,
      "t2m_min": 23.4,
      "prectotcorr": 0.0,
      "rh2m": 51.0,
      "allsky_sfc_sw_dwn": 23.3
    },
    {
      "date": "2026-05-15",
      "t2m": 31.1,
      "t2m_max": 38.2,
      "t2m_min": 24.0,
      "prectotcorr": 0.0,
      "rh2m": 42.0,
      "allsky_sfc_sw_dwn": 24.1
    },
    {
      "date": "2026-05-16",
      "t2m": 29.3,
      "t2m_max": 36.0,
      "t2m_min": 22.6,
      "prectotcorr": 0.0,
      "rh2m": 43.5,
      "allsky_sfc_sw_dwn": 24.9
    },
    {
      "date": "2026-05-17",
      "t2m": 29.55,
      "t2m_max": 36.7,
      "t2m_min": 22.4,
      "prectotcorr": 0.0,
      "rh2m": 45.0,
      "allsky_sfc_sw_dwn": 25.7
    },
    {
      "date": "2026-05-18",
      "t2m": null,
      "t2m_max": null,
      "t2m_min": null,
      "prectotcorr": null,
      "rh2m": null,
      "allsky_sfc_sw_dwn": null
    },
    {
      "date": "2026-05-19",
      "t2m": 30.4,
      "t2m_max": 37.2,
      "t2m_min": 23.6,
      "prectotcorr": 0.0,
      "rh2m": 48.0,
      "allsky_sfc_sw_dwn": 22.5
    },
    {
      "date": "2026-05-20",
      "t2m": 31.05,
      "t2m_max": 37.9,
      "t2m_min": 24.2,
      "prectotcorr": 0.0,
      "rh2m": 49.5,
      "allsky_sfc_sw_dwn": 23.3
    },
    {
      "date": "2026-05-21",
      "t2m": 29.3,
      "t2m_max": 36.6,
      "t2m_min": 22.0,
      "prectotcorr": 0.0,
      "rh2m": 51.0,
      "allsky_sfc_sw_dwn": 24.1
    },
    {
      "date": "2026-05-22",
      "t2m": 29.5,
      "t2m_max": 36.4,
      "t2m_min": 22.6,
      "prectotcorr": 0.0,
      "rh2m": 42.0,
      "allsky_sfc_sw_dwn": 24.9
    },
    {
      "date": "2026-05-23",
      "t2m": 30.15,
      "t2m_max": 37.1,
      "t2m_min": 23.2,
      "prectotcorr": 0.0,
      "rh2m": 43.5,
      "allsky_sfc_sw_dwn": 25.7
    },
    {
      "date": "2026-05-24",
      "t2m": 30.8,
      "t2m_max": 37.8,
      "t2m_min": 23.8,
      "prectotcorr": 0.0,
      "rh2m": 45.0,
      "allsky_sfc_sw_dwn": 26.5
    },
    {
      "date": "2026-05-25",
      "t2m": 30.6,
      "t2m_max": 37.6,
      "t2m_min": 23.6,
      "prectotcorr": 0.0,
      "rh2m": 46.5,
      "allsky_sfc_sw_dwn": 22.5
    },
    {
      "date": "2026-05-26",
      "t2m": 29.25,
      "t2m_max": 36.3,
      "t2m_min": 22.2,
      "prectotcorr": 0.0,
      "rh2m": 48.0,
      "allsky_sfc_sw_dwn": 23.3
    },
    {
      "date": "2026-05-27",
      "t2m": 29.9,
      "t2m_max": 37.0,
      "t2m_min": 22.8,
      "prectotcorr": 0.0,
      "rh2m": 49.5,
      "allsky_sfc_sw_dwn": 24.1
    },
    {
      "date": "2026-05-28",
      "t2m": 30.1,
      "t2m_max": 36.8,
      "t2m_min": 23.4,
      "prectotcorr": 0.0,
      "rh2m": 51.0,
      "allsky_sfc_sw_dwn": 24.9
    },
    {
      "date": "2026-05-29",
      "t2m": 30.35,
      "t2m_max": 37.5,
      "t2m_min": 23.2,
      "prectotcorr": 0.0,
      "rh2m": 42.0,
      "allsky_sfc_sw_dwn": 25.7
    },
    {
      "date": "2026-05-30",
      "t2m": 31.0,
      "t2m_max": 38.2,
      "t2m_min": 23.8,
      "prectotcorr": 0.0,
      "rh2m": 43.5,
      "allsky_sfc_sw_dwn": 26.5
    },
    {
      "date": "2026-05-31",
      "t2m": 29.2,
      "t2m_max": 36.0,
      "t2m_min": 22.4,
      "prectotcorr": 0.0,
      "rh2m": 45.0,
      "allsky_sfc_sw_dwn": 22.5
    },
    {
      "date": "2026-06-01",
      "t2m": 33.05,
      "t2m_max": 39.9,
      "t2m_min": 26.2,
      "prectotcorr": 0.0,
      "rh2m": 54.5,
      "allsky_sfc_sw_dwn": 23.3
    },
    {
      "date": "2026-06-02",
      "t2m": 33.3,
      "t2m_max": 40.6,
      "t2m_min": 26.0,
      "prectotcorr": 0.0,
      "rh2m": 56.0,
      "allsky_sfc_sw_dwn": 24.1
    },
    {
      "date": "2026-06-03",
      "t2m": 33.5,
      "t2m_max": 40.4,
      "t2m_min": 26.6,
      "prectotcorr": 0.0,
      "rh2m": 57.5,
      "allsky_sfc_sw_dwn": 24.9
    },
    {
      "date": "2026-06-04",
      "t2m": 34.15,
      "t2m_max": 41.1,
      "t2m_min": 27.2,
      "prectotcorr": 0.0,
      "rh2m": 59.0,
      "allsky_sfc_sw_dwn": 25.7
    },
    {
      "date": "2026-06-05",
      "t2m": 32.8,
      "t2m_max": 39.8,
      "t2m_min": 25.8,
      "prectotcorr": 2.1,
      "rh2m": 50.0,
      "allsky_sfc_sw_dwn": 22.5
    },
    {
      "date": "2026-06-06",
      "t2m": 32.6,
      "t2m_max": 39.6,
      "t2m_min": 25.6,
      "prectotcorr": 0.0,
      "rh2m": 51.5,
      "allsky_sfc_sw_dwn": 22.5
    },
    {
      "date": "2026-06-07",
      "t2m": 33.25,
      "t2m_max": 40.3,
      "t2m_min": 26.2,
      "prectotcorr": 0.0,
      "rh2m": 53.0,
      "allsky_sfc_sw_dwn": 23.3
    },
    {
      "date": "2026-06-08",
      "t2m": 33.9,
      "t2m_max": 41.0,
      "t2m_min": 26.8,
      "prectotcorr": 0.0,
      "rh2m": 54.5,
      "allsky_sfc_sw_dwn": 24.1
    },
    {
      "date": "2026-06-09",
      "t2m": 34.1,
      "t2m_max": 40.8,
      "t2m_min": 27.4,
      "prectotcorr": 0.0,
      "rh2m": 56.0,
      "allsky_sfc_sw_dwn": 24.9
    },
    {
      "date": "2026-06-10",
      "t2m": 32.35,
      "t2m_max": 39.5,
      "t2m_min": 25.2,
      "prectotcorr": 0.0,
      "rh2m": 57.5,
      "allsky_sfc_sw_dwn": 25.7
    },
    {
      "date": "2026-06-11",
      "t2m": 33.0,
      "t2m_max": 40.2,
      "t2m_min": 25.8,
      "prectotcorr": 0.0,
      "rh2m": 59.0,
      "allsky_sfc_sw_dwn": 26.5
    },
    {
      "date": "2026-06-12",
      "t2m": 33.2,
      "t2m_max": 40.0,
      "t2m_min": 26.4,
      "prectotcorr": 0.0,
      "rh2m": 50.0,
      "allsky_sfc_sw_dwn": 22.5
    },
    {
      "date": "2026-06-13",
      "t2m": 33.85,
      "t2m_max": 40.7,
      "t2m_min": 27.0,
      "prectotcorr": 0.0,
      "rh2m": 51.5,
      "allsky_sfc_sw_dwn": 23.3
    },
    {
      "date": "2026-06-14",
      "t2m": 34.1,
      "t2m_max": 41.4,
      "t2m_min": 26.8,
      "prectotcorr": 0.0,
      "rh2m": 53.0,
      "allsky_sfc_sw_dwn": 24.1
    },
    {
      "date": "2026-06-15",
      "t2m": 32.3,
      "t2m_max": 39.2,
      "t2m_min": 25.4,
      "prectotcorr": 0.0,
      "rh2m": 54.5,
      "allsky_sfc_sw_dwn": 24.9
    },
    {
      "date": "2026-06-16",
      "t2m": 32.95,
      "t2m_max": 39.9,
      "t2m_min": 26.0,
      "prectotcorr": 0.0,
      "rh2m": 56.0,
      "allsky_sfc_sw_dwn": 25.7
    },
    {
      "date": "2026-06-17",
      "t2m": 33.6,
      "t2m_max": 40.6,
      "t2m_min": 26.6,
      "prectotcorr": 0.0,
      "rh2m": 57.5,
      "allsky_sfc_sw_dwn": 26.5
    },
    {
      "date": "2026-06-18",
      "t2m": 33.4,
      "t2m_max": 40.4,
      "t2m_min": 26.4,
      "prectotcorr": 0.0,
      "rh2m": 59.0,
      "allsky_sfc_sw_dwn": 22.5
    },
    {
      "date": "2026-06-19",
      "t2m": 34.05,
      "t2m_max": 41.1,
      "t2m_min": 27.0,
      "prectotcorr": 0.0,
      "rh2m": 50.0,
      "allsky_sfc_sw_dwn": 23.3
    },
    {
      "date": "2026-06-20",
      "t2m": 32.7,
      "t2m_max": 39.8,
      "t2m_min": 25.6,
      "prectotcorr": 0.0,
      "rh2m": 51.5,
      "allsky_sfc_sw_dwn": 24.1
    },
    {
      "date": "2026-06-21",
      "t2m": 32.9,
      "t2m_max": 39.6,
      "t2m_min": 26.2,
      "prectotcorr": 0.0,
      "rh2m": 53.0,
      "allsky_sfc_sw_dwn": 24.9
    },
    {
      "date": "2026-06-22",
      "t2m": null,
      "t2m_max": null,
      "t2m_min": null,
      "prectotcorr": null,
      "rh2m": null,
      "allsky_sfc_sw_dwn": null
    },
    {
      "date": "2026-06-23",
      "t2m": 33.8,
      "t2m_max": 41.0,
      "t2m_min": 26.6,
      "prectotcorr": 0.0,
      "rh2m": 56.0,
      "allsky_sfc_sw_dwn": 26.5
    },
    {
      "date": "2026-06-24",
      "t2m": 34.0,
      "t2m_max": 40.8,
      "t2m_min": 27.2,
      "prectotcorr": 0.0,
      "rh2m": 57.5,
      "allsky_sfc_sw_dwn": 22.5
    },
    {
      "date": "2026-06-25",
      "t2m": 32.65,
      "t2m_max": 39.5,
      "t2m_min": 25.8,
      "prectotcorr": 0.0,
      "rh2m": 59.0,
      "allsky_sfc_sw_dwn": 23.3
    },
    {
      "date": "2026-06-26",
      "t2m": 32.9,
      "t2m_max": 40.2,
      "t2m_min": 25.6,
      "prectotcorr": 0.0,
      "rh2m": 50.0,
      "allsky_sfc_sw_dwn": 24.1
    },
    {
      "date": "2026-06-27",
      "t2m": 33.1,
      "t2m_max": 40.0,
      "t2m_min": 26.2,
      "prectotcorr": 0.0,
      "rh2m": 51.5,
      "allsky_sfc_sw_dwn": 24.9
    },
    {
      "date": "2026-06-28",
      "t2m": 33.75,
      "t2m_max": 40.7,
      "t2m_min": 26.8,
      "prectotcorr": 0.0,
      "rh2m": 53.0,
      "allsky_sfc_sw_dwn": 25.7
    },
    {
      "date": "2026-06-29",
      "t2m": 34.4,
      "t2m_max": 41.4,
      "t2m_min": 27.4,
      "prectotcorr": 0.0,
      "rh2m": 54.5,
      "allsky_sfc_sw_dwn": 26.5
    },
    {
      "date": "2026-06-30",
      "t2m": 32.2,
      "t2m_max": 39.2,
      "t2m_min": 25.2,
      "prectotcorr": 0.0,
      "rh2m": 56.0,
      "allsky_sfc_sw_dwn": 22.5
    },
    {
      "date": "2026-07-01",
      "t2m": 36.05,
      "t2m_max": 43.1,
      "t2m_min": 29.0,
      "prectotcorr": 0.0,
      "rh2m": 65.5,
      "allsky_sfc_sw_dwn": 23.3
    },
    {
      "date": "2026-07-02",
      "t2m": 36.7,
      "t2m_max": 43.8,
      "t2m_min": 29.6,
      "prectotcorr": 0.0,
      "rh2m": 67.0,
      "allsky_sfc_sw_dwn": 24.1
    },
    {
      "date": "2026-07-03",
      "t2m": 36.9,
      "t2m_max": 43.6,
      "t2m_min": 30.2,
      "prectotcorr": 0.0,
      "rh2m": 58.0,
      "allsky_sfc_sw_dwn": 24.9
    },
    {
      "date": "2026-07-04",
      "t2m": 37.15,
      "t2m_max": 44.3,
      "t2m_min": 30.0,
      "prectotcorr": 0.0,
      "rh2m": 59.5,
      "allsky_sfc_sw_dwn": 25.7
    },
    {
      "date": "2026-07-05",
      "t2m": 35.8,
      "t2m_max": 43.0,
      "t2m_min": 28.6,
      "prectotcorr": 0.0,
      "rh2m": 61.0,
      "allsky_sfc_sw_dwn": 26.5
    },
    {
      "date": "2026-07-06",
      "t2m": 36.0,
      "t2m_max": 42.8,
      "t2m_min": 29.2,
      "prectotcorr": 0.0,
      "rh2m": 62.5,
      "allsky_sfc_sw_dwn": 22.5
    },
    {
      "date": "2026-07-07",
      "t2m": 36.65,
      "t2m_max": 43.5,
      "t2m_min": 29.8,
      "prectotcorr": 0.0,
      "rh2m": 64.0,
      "allsky_sfc_sw_dwn": 23.3
    },
    {
      "date": "2026-07-08",
      "t2m": 36.9,
      "t2m_max": 44.2,
      "t2m_min": 29.6,
      "prectotcorr": 0.0,
      "rh2m": 65.5,
      "allsky_sfc_sw_dwn": 24.1
    },
    {
      "date": "2026-07-09",
      "t2m": 37.1,
      "t2m_max": 44.0,
      "t2m_min": 30.2,
      "prectotcorr": 0.0,
      "rh2m": 67.0,
      "allsky_sfc_sw_dwn": 24.9
    },
    {
      "date": "2026-07-10",
      "t2m": 35.75,
      "t2m_max": 42.7,
      "t2m_min": 28.8,
      "prectotcorr": 8.4,
      "rh2m": 58.0,
      "allsky_sfc_sw_dwn": 21.7
    },
    {
      "date": "2026-07-11",
      "t2m": 36.4,
      "t2m_max": 43.4,
      "t2m_min": 29.4,
      "prectotcorr": 0.0,
      "rh2m": 59.5,
      "allsky_sfc_sw_dwn": 26.5
    },
    {
      "date": "2026-07-12",
      "t2m": 36.2,
      "t2m_max": 43.2,
      "t2m_min": 29.2,
      "prectotcorr": 0.0,
      "rh2m": 61.0,
      "allsky_sfc_sw_dwn": 22.5
    },
    {
      "date": "2026-07-13",
      "t2m": 36.85,
      "t2m_max": 43.9,
      "t2m_min": 29.8,
      "prectotcorr": 0.0,
      "rh2m": 62.5,
      "allsky_sfc_sw_dwn": 23.3
    },
    {
      "date": "2026-07-14",
      "t2m": 37.5,
      "t2m_max": 44.6,
      "t2m_min": 30.4,
      "prectotcorr": 0.0,
      "rh2m": 64.0,
      "allsky_sfc_sw_dwn": 24.1
    },
    {
      "date": "2026-07-15",
      "t2m": 35.7,
      "t2m_max": 42.4,
      "t2m_min": 29.0,
      "prectotcorr": 0.0,
      "rh2m": 65.5,
      "allsky_sfc_sw_dwn": 24.9
    },
    {
      "date": "2026-07-16",
      "t2m": 35.95,
      "t2m_max": 43.1,
      "t2m_min": 28.8,
      "prectotcorr": 0.0,
      "rh2m": 67.0,
      "allsky_sfc_sw_dwn": 25.7
    },
    {
      "date": "2026-07-17",
      "t2m": 36.6,
      "t2m_max": 43.8,
      "t2m_min": 29.4,
      "prectotcorr": 0.0,
      "rh2m": 58.0,
      "allsky_sfc_sw_dwn": 26.5
    },
    {
      "date": "2026-07-18",
      "t2m": 36.8,
      "t2m_max": 43.6,
      "t2m_min": 30.0,
      "prectotcorr": 0.0,
      "rh2m": 59.5,
      "allsky_sfc_sw_dwn": 22.5
    },
    {
      "date": "2026-07-19",
      "t2m": 37.45,
      "t2m_max": 44.3,
      "t2m_min": 30.6,
      "prectotcorr": 0.0,
      "rh2m": 61.0,
      "allsky_sfc_sw_dwn": 23.3
    },
    {
      "date": "2026-07-20",
      "t2m": 35.7,
      "t2m_max": 43.0,
      "t2m_min": 28.4,
      "prectotcorr": 0.0,
      "rh2m": 62.5,
      "allsky_sfc_sw_dwn": 24.1
    },
    {
      "date": "2026-07-21",
      "t2m": 35.9,
      "t2m_max": 42.8,
      "t2m_min": 29.0,
      "prectotcorr": 0.0,
      "rh2m": 64.0,
      "allsky_sfc_sw_dwn": 24.9
    },
    {
      "date": "2026-07-22",
      "t2m": 36.55,
      "t2m_max": 43.5,
      "t2m_min": 29.6,
      "prectotcorr": 0.0,
      "rh2m": 65.5,
      "allsky_sfc_sw_dwn": 25.7
    },
    {
      "date": "2026-07-23",
      "t2m": 37.2,
      "t2m_max": 44.2,
      "t2m_min": 30.2,
      "prectotcorr": 0.0,
      "rh2m": 67.0,
      "allsky_sfc_sw_dwn": 26.5
    },
    {
      "date": "2026-07-24",
      "t2m": 37.0,
      "t2m_max": 44.0,
      "t2m_min": 30.0,
      "prectotcorr": 0.0,
      "rh2m": 58.0,
      "allsky_sfc_sw_dwn": 22.5
    },
    {
      "date": "2026-07-25",
      "t2m": 35.65,
      "t2m_max": 42.7,
      "t2m_min": 28.6,
      "prectotcorr": 8.4,
      "rh2m": 59.5,
      "allsky_sfc_sw_dwn": 19.3
    },
    {
      "date": "2026-07-26",
      "t2m": 36.3,
      "t2m_max": 43.4,
      "t2m_min": 29.2,
      "prectotcorr": 0.0,
      "rh2m": 61.0,
      "allsky_sfc_sw_dwn": 24.1
    },
    {
      "date": "2026-07-27",
      "t2m": 36.5,
      "t2m_max": 43.2,
      "t2m_min": 29.8,
      "prectotcorr": 0.0,
      "rh2m": 62.5,
      "allsky_sfc_sw_dwn": 24.9
    },
    {
      "date": "2026-07-28",
      "t2m": 36.75,
      "t2m_max": 43.9,
      "t2m_min": 29.6,
      "prectotcorr": 0.0,
      "rh2m": 64.0,
      "allsky_sfc_sw_dwn": 25.7
    },
    {
      "date": "2026-07-29",
      "t2m": 37.4,
      "t2m_max": 44.6,
      "t2m_min": 30.2,
      "prectotcorr": 0.0,
      "rh2m": 65.5,
      "allsky_sfc_sw_dwn": 26.5
    },
    {
      "date": "2026-07-30",
      "t2m": 35.6,
      "t2m_max": 42.4,
      "t2m_min": 28.8,
      "prectotcorr": 0.0,
      "rh2m": 67.0,
      "allsky_sfc_sw_dwn": 22.5
    },
    {
      "date": "2026-07-31",
      "t2m": 36.25,
      "t2m_max": 43.1,
      "t2m_min": 29.4,
      "prectotcorr": 0.0,
      "rh2m": 58.0,
      "allsky_sfc_sw_dwn": 23.3
    }
  ]
};

export const MOCK_EARTH_OBSERVATION = {
  "farm_id": "00000000-0000-0000-0000-000000000001",
  "latitude": 34.0151,
  "longitude": 71.5249,
  "analysis_period": {
    "recent_start_date": "2024-05-01",
    "recent_end_date": "2024-07-31",
    "historical_start_date": "2014-01-01",
    "historical_end_date": "2024-12-31"
  },
  "soil_moisture": {
    "source": "NASA SMAP L4 / Crop-CASMA",
    "spatial_resolution": "9 km (0.09\u00b0 grid)",
    "grid_centroid": {
      "latitude": 34.02,
      "longitude": 71.55
    },
    "recent_root_zone_moisture": 19.8,
    "historical_mean": 27.4,
    "moisture_anomaly": -7.6,
    "unit": "mm/m",
    "dry_root_zone_flag": true,
    "interpretation": "Root-zone soil moisture (19.8 mm/m) is below the configured dry threshold (25 mm/m). Water-demanding crops face elevated moisture deficits without canal/well irrigation.",
    "data_coverage_percentage": 94.5
  },
  "climate": {
    "source": "NASA POWER Daily Point API",
    "heat_stress_days": 38,
    "frost_risk_days": 0
  },
  "precipitation": {
    "source": "NASA GPM IMERG",
    "product_run": "Final Run (Gauge-Calibrated)",
    "spatial_resolution": "0.1\u00b0 \u00d7 0.1\u00b0 (~10 km grid)",
    "seasonal_rainfall_total_mm": 42.5,
    "daily_mean_mm": 0.47,
    "rainfall_deficit_mm": -22.5,
    "consecutive_dry_days": 16,
    "heavy_rain_days": 2,
    "dry_spell_risk": true,
    "interpretation": "Elevated dry-spell risk detected with 16 consecutive dry days and a 22.5 mm seasonal rainfall deficit. Crops without supplemental irrigation face moisture stress."
  },
  "vegetation": {
    "source": "NASA MODIS / VIIRS NDVI (MOD13Q1 / VNP13A1)",
    "spatial_resolution": "250 m to 500 m pixel",
    "recent_mean_ndvi": 0.21,
    "historical_mean_ndvi": 0.38,
    "ndvi_anomaly": -0.17,
    "low_greenness_flag": true,
    "bare_field_likelihood": "high",
    "interpretation": "Satellite vegetation greenness is low (NDVI 0.21 < 0.25). This reflects post-harvest fallow exposed soil or sparse vegetation. Local confirmation is required."
  },
  "bare_field_windows": [
    {
      "start_date": "2024-05-01",
      "end_date": "2024-07-31",
      "duration_days": 60,
      "evidence": {
        "ndvi_mean": 0.21,
        "root_zone_soil_moisture": 19.8,
        "recent_precipitation_mm": 42.5,
        "mean_temperature_c": 31.5
      },
      "risk": "high",
      "interpretation": "Bare-field window confirmed by 4 independent satellite signals: low canopy greenness (NDVI 0.21), depleted root-zone moisture (19.8 mm/m), and precipitation deficits. Topsoil is exposed to solar desiccation and erosion. A short-cycle cover or forage pulse crop is strongly recommended.",
      "confidence": "high"
    }
  ],
  "heat_stress": {
    "source": "NASA POWER (T2M_MAX, T2M_MIN, RH2M)",
    "heat_stress_days": 38,
    "frost_risk_days": 0,
    "consecutive_hot_days": 7,
    "interpretation": "Observed 38 heat-stress days (Tmax >= 35\u00b0C) and 0 frost-risk days (Tmin <= 2\u00b0C) during the summer transition. Sensitive flowering stages require thermal protection."
  },
  "data_quality": {
    "available_sources": [
      "NASA SMAP L4 / Crop-CASMA",
      "NASA GPM IMERG",
      "NASA MODIS / VIIRS NDVI",
      "NASA POWER Daily Point API"
    ],
    "unavailable_sources": [],
    "missing_percentage_by_source": {
      "NASA SMAP L4": 5.5,
      "NASA GPM IMERG": 0.0,
      "NASA MODIS / VIIRS": 0.0,
      "NASA POWER": 0.0
    },
    "overall_confidence": "high",
    "earliest_observation_date": "2024-05-01",
    "latest_observation_date": "2024-07-31"
  },
  "provenance": [
    {
      "source_name": "NASA SMAP L4 / Crop-CASMA",
      "product_id": "SPL4SMGP.007",
      "spatial_resolution": "9 km (0.09\u00b0 grid centroid)",
      "temporal_resolution": "Daily Assimilated (3-hour GMAO Land Surface Model)",
      "measurement": "Root-Zone Soil Moisture (0-100 cm depth)",
      "retrieval_method": "L-Band Radiometer assimilation into Catchment Land Surface Model"
    },
    {
      "source_name": "NASA GPM IMERG",
      "product_id": "GPM_3IMERGDF.07",
      "spatial_resolution": "0.1\u00b0 \u00d7 0.1\u00b0 (~10 km grid)",
      "temporal_resolution": "Daily Final Run (Gauge-Calibrated)",
      "measurement": "Precipitation rate and accumulated rainfall (mm)",
      "retrieval_method": "Multi-satellite passive microwave, IR sensor constellation, and GPCC ground gauges"
    },
    {
      "source_name": "NASA MODIS / VIIRS",
      "product_id": "MOD13Q1 / VNP13A1",
      "spatial_resolution": "250 m to 500 m pixel",
      "temporal_resolution": "16-day Composite",
      "measurement": "Normalized Difference Vegetation Index (NDVI)",
      "retrieval_method": "Optical Red & Near-Infrared surface reflectance ratio"
    },
    {
      "source_name": "NASA POWER",
      "product_id": "POWER Daily Point API",
      "spatial_resolution": "0.5\u00b0 \u00d7 0.625\u00b0",
      "temporal_resolution": "Daily",
      "measurement": "T2M, T2M_MAX, T2M_MIN, PRECTOTCORR, RH2M, ALLSKY_SFC_SW_DWN",
      "retrieval_method": "GMAO MERRA-2 assimilation and GEOS FP-IT operational satellite analysis"
    }
  ],
  "limitations": [
    "Gridded satellite and reanalysis observations (9 km to 50 km) represent regional spatial averages rather than field-level sensor measurements.",
    "Optical NDVI observations are subject to cloud obscuration, atmospheric aerosol interference, and 16-day compositing intervals.",
    "Soil moisture assimilation models rely on surface radiometry and land-surface modeling; actual root-zone moisture varies by local soil compaction and texture.",
    "Ground verification of canal water rotation ('warabandi'), tube-well electric reliability, soil salinity, and pest outbreaks is mandatory before planting."
  ],
  "is_demo_data": true
};

export const MOCK_RECOMMENDATION = {
  "recommendation_id": "demo-rec-001",
  "farm_id": "demo-peshawar-001",
  "generated_at": "2026-10-01T12:05:00Z",
  "priority": "balanced",
  "is_demo_data": true,
  "climate_context": {
    "source": "NASA POWER Daily Point API (AG Community)",
    "period": "2026-05-01 to 2026-07-31",
    "mean_t2m": 33.15,
    "max_t2m": 41.5,
    "precipitation_sum": 37.8,
    "indicators": {
      "heat_stress_risk": "high_june_july",
      "monsoon_onset": "early_july",
      "evaporative_demand": "elevated"
    }
  },
  "limitations": [
    "Decision-support model only; does not provide guaranteed yield, profit, or water delivery certainty.",
    "Recommendations rely on NASA POWER gridded satellite reanalysis (~0.5\u00b0 \u00d7 0.625\u00b0 resolution) which does not capture hyper-local field microtopography or soil salinity patches.",
    "Actual performance depends on physical canal rotation schedules (warabandi) and tube-well electrical grid reliability in Peshawar Valley."
  ],
  "general_assumptions": [
    "Farm retains functional tube-well irrigation with medium seasonal reliability.",
    "Soil texture is loamy with moderate infiltration and organic matter ~0.6-0.8%.",
    "Agronomic practices follow Khyber Pakhtunkhwa Agriculture Extension standard seedbed preparation."
  ],
  "scenarios": [
    {
      "scenario_id": "baseline",
      "title": "Conventional Cereal Monoculture (Wheat \u2013 Maize)",
      "description": "Standard two-season cereal rotation prevalent across Peshawar and Charsadda districts, balancing food security with familiar local marketing channels.",
      "score": 68.5,
      "score_breakdown": {
        "water_fit": 65.0,
        "climate_suitability": 74.0,
        "soil_health_diversity": 62.0,
        "weights": {
          "water_fit": 0.35,
          "climate_suitability": 0.35,
          "soil_health_diversity": 0.3
        }
      },
      "crop_sequence": [
        "wheat",
        "maize"
      ],
      "seasonal_calendar": [
        {
          "season": "rabi",
          "crop": "Wheat (Gandum)",
          "window": "Mid-November to Mid-April",
          "water_notes": "Requires 4-5 irrigations; crown root initiation and grain fill are critical moisture stages."
        },
        {
          "season": "kharif",
          "crop": "Maize (Makai)",
          "window": "June to September",
          "water_notes": "High water requirement coinciding with peak summer temperatures (36-41\u00b0C) and monsoon."
        }
      ],
      "rationale": [
        "Aligns with Peshawar Valley's most established grain supply chains and local household consumption.",
        "Both crops have documented heat tolerance thresholds matching NASA POWER historical temperature regimes."
      ],
      "benefits": [
        "Reliable local cash and fodder markets with negligible adoption barrier for farm labor.",
        "Allows utilization of standard mechanized threshing and seed drill equipment."
      ],
      "risks": [
        "Heavy synthetic nitrogen fertilizer dependence depletes soil biological activity over time.",
        "High water demand during June-July peak temperatures stresses tube-well groundwater pumping."
      ],
      "assumptions": [
        "Assumes reliable electricity or diesel availability for tube-well during peak June heat waves."
      ],
      "evidence_status": "documented"
    },
    {
      "scenario_id": "pulse_inclusive",
      "title": "Nitrogen-Fixing Pulse Diversification (Wheat \u2013 Mung Bean)",
      "description": "Introduces short-duration mung bean in early kharif/zaid window to break continuous cereal deplete cycles, fix atmospheric nitrogen, and reduce peak summer water demand.",
      "score": 86.0,
      "score_breakdown": {
        "water_fit": 88.0,
        "climate_suitability": 84.0,
        "soil_health_diversity": 87.0,
        "weights": {
          "water_fit": 0.35,
          "climate_suitability": 0.35,
          "soil_health_diversity": 0.3
        }
      },
      "crop_sequence": [
        "wheat",
        "mung_bean"
      ],
      "seasonal_calendar": [
        {
          "season": "rabi",
          "crop": "Wheat (Gandum)",
          "window": "Mid-November to Mid-April",
          "water_notes": "Benefits from residual soil nitrogen left by preceding pulse cycle."
        },
        {
          "season": "zaid / kharif",
          "crop": "Mung Bean (Mung)",
          "window": "May to July (65-75 days)",
          "water_notes": "Low water demand; requires only 2-3 light irrigations compared to heavy maize flooding."
        }
      ],
      "rationale": [
        "Short duration (70 days) fits neatly between wheat harvest and late summer, lowering irrigation volume during peak June evaporative demand.",
        "Rhizobium biological nitrogen fixation enriches topsoil organic nitrogen, dampening synthetic urea requirements."
      ],
      "benefits": [
        "Substantial water conservation during critical June heat spells identified in NASA POWER climate data.",
        "Diversifies farm income with high-value edible pulse grain commanding premium market prices in Peshawar."
      ],
      "risks": [
        "Pods are susceptible to shattering and flower drop if unseasonal intense monsoon rains hit during early July ripening.",
        "Requires certified rhizobium inoculant and careful aphid monitoring."
      ],
      "assumptions": [
        "Assumes seedbed drainage is sufficient to prevent standing water during monsoon cloudbursts."
      ],
      "evidence_status": "documented"
    },
    {
      "scenario_id": "soil_cover",
      "title": "Soil Health & Multi-Cut Forage Cover (Berseem Clover \u2013 Maize)",
      "description": "Replaces continuous grain cereals with Berseem clover in rabi to produce high-protein livestock forage, provide continuous ground canopy cover, and aggressively regenerate depleted valley soils.",
      "score": 82.5,
      "score_breakdown": {
        "water_fit": 78.0,
        "climate_suitability": 82.0,
        "soil_health_diversity": 91.0,
        "weights": {
          "water_fit": 0.35,
          "climate_suitability": 0.35,
          "soil_health_diversity": 0.3
        }
      },
      "crop_sequence": [
        "berseem_clover",
        "maize"
      ],
      "seasonal_calendar": [
        {
          "season": "rabi",
          "crop": "Berseem Clover (Shaftal / Berseem)",
          "window": "October to April (Multi-cut)",
          "water_notes": "Requires frequent shallow irrigations; high water use efficiency due to continuous vegetative cover."
        },
        {
          "season": "kharif",
          "crop": "Maize (Makai)",
          "window": "June to September",
          "water_notes": "Grows vigorously on clover-enriched nitrogen residual, improving water retention in root zone."
        }
      ],
      "rationale": [
        "Dense legume canopy suppresses winter weed proliferation and dramatically enhances soil organic matter in loamy soils.",
        "Provides 4 to 6 cuttings of succulent green fodder for Peshawar Valley peri-urban dairy herds."
      ],
      "benefits": [
        "Exceptional soil structure, microbial biomass, and nitrogen enrichment.",
        "Steady weekly cash flow from green forage sales in Peshawar livestock markets."
      ],
      "risks": [
        "Requires access to livestock or established local green forage market routes.",
        "Frequent cutting requires sustained farm labor availability from December through April."
      ],
      "assumptions": [
        "Assumes farm labor or local peri-urban fodder buyer handles regular bi-weekly forage harvesting."
      ],
      "evidence_status": "documented"
    }
  ]
};
