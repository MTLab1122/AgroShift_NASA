"use client";

import React from "react";
import { Satellite, Layers, Database, Compass, CheckCircle2 } from "lucide-react";

export const DataProvenancePanel: React.FC = () => {
  const sources = [
    {
      name: "NASA SMAP L4 / Crop-CASMA",
      product: "SPL4SMGP (Root-Zone Soil Moisture)",
      resolution: "9 km (0.09° grid centroid)",
      measurement: "0–100 cm Model-Assimilated Soil Moisture (mm/m)",
      sensor: "L-Band Microwave Radiometer + GMAO Catchment LSM",
      latency: "Daily Assimilated (~2.5 days latency)",
      badgeColor: "bg-cyan-100 text-cyan-800 border-cyan-300",
    },
    {
      name: "NASA GPM IMERG",
      product: "GPM_3IMERGDF (Final Run Calibrated)",
      resolution: "0.1° × 0.1° (~10 km grid)",
      measurement: "Daily Accumulated Rainfall (mm) & Dry-Spell Metrics",
      sensor: "Multi-Satellite Passive Microwave/IR + GPCC Ground Gauges",
      latency: "Gauge-Calibrated (~3 months final, early run 4-hour)",
      badgeColor: "bg-blue-100 text-blue-800 border-blue-300",
    },
    {
      name: "NASA MODIS / VIIRS NDVI",
      product: "MOD13Q1 / VNP13A1 (Canopy Greenness)",
      resolution: "250 m to 500 m pixel",
      measurement: "Normalized Difference Vegetation Index (NDVI)",
      sensor: "Terra/Aqua MODIS & Suomi NPP VIIRS Optical Reflectance",
      latency: "16-day Composite",
      badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
    },
    {
      name: "NASA POWER Daily Point API",
      product: "AG Community Agroclimatology",
      resolution: "0.5° × 0.625° (~50 km grid)",
      measurement: "T2M, T2M_MAX, T2M_MIN, RH2M, Solar Irradiance (ALLSKY_SFC_SW_DWN)",
      sensor: "MERRA-2 Reanalysis & GEOS-FP-IT Operational Satellite Data",
      latency: "Daily (~2-3 days latency)",
      badgeColor: "bg-purple-100 text-purple-800 border-purple-300",
    },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-2.5">
          <Satellite className="w-5 h-5 text-indigo-600" />
          <h3 className="text-base font-bold text-slate-900">Multi-NASA Earth-Observation Data Provenance</h3>
        </div>
        <span className="text-xs bg-indigo-50 text-indigo-700 font-semibold px-2.5 py-1 rounded-full border border-indigo-200">
          Strict Scientific Provenance
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sources.map((src, i) => (
          <div key={i} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-slate-900">{src.name}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${src.badgeColor}`}>
                Active Stream
              </span>
            </div>

            <div className="text-xs text-slate-600 space-y-1">
              <p><span className="font-semibold text-slate-700">Product:</span> {src.product}</p>
              <p><span className="font-semibold text-slate-700">Spatial Resolution:</span> {src.resolution}</p>
              <p><span className="font-semibold text-slate-700">Measurement:</span> {src.measurement}</p>
              <p><span className="font-semibold text-slate-700">Sensor &amp; Model:</span> {src.sensor}</p>
              <p><span className="font-semibold text-slate-700">Latency:</span> {src.latency}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-900 space-y-1">
        <p className="font-bold flex items-center space-x-1.5">
          <span>Observation Integrity Protocol:</span>
        </p>
        <p>
          NASA fill values (e.g. -999, &lt;= -900) are converted strictly to null and never imputed with zeros.
          All earth observations are gridded estimates and require field-level verification before capital allocation.
        </p>
      </div>
    </div>
  );
};
