"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  CloudSun,
  Calendar,
  AlertTriangle,
  Download,
  Info,
  Database,
  ArrowRight,
  Filter,
} from "lucide-react";
import DemoBanner from "@/components/layout/DemoBanner";
import { getClimateSummary, getClimateHistory } from "@/lib/api/climate";
import { ClimateSummary, ClimateHistory } from "@/types/climate";
import ClimateTemperatureChart from "@/components/charts/ClimateTemperatureChart";
import ClimatePrecipitationChart from "@/components/charts/ClimatePrecipitationChart";
import { downloadClimateCsv } from "@/lib/api/reports";

export default function ClimatePage() {
  const [climateSummary, setClimateSummary] = useState<ClimateSummary | null>(null);
  const [climateHistory, setClimateHistory] = useState<ClimateHistory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useFallback, setUseFallback] = useState(true);

  // Default coordinate: Peshawar Valley
  const lat = 34.0151;
  const lon = 71.5249;

  useEffect(() => {
    async function fetchClimate() {
      try {
        setLoading(true);
        setError(null);
        const [sum, hist] = await Promise.all([
          getClimateSummary({
            latitude: lat,
            longitude: lon,
            use_demo_fallback: useFallback,
          }),
          getClimateHistory({
            latitude: lat,
            longitude: lon,
            use_demo_fallback: useFallback,
          }),
        ]);
        setClimateSummary(sum);
        setClimateHistory(hist);
      } catch (err: any) {
        console.error("Climate fetch failed:", err);
        setError(err.message || "NASA POWER climate retrieval failed.");
      } finally {
        setLoading(false);
      }
    }
    fetchClimate();
  }, [useFallback]);

  const handleExportCsv = async () => {
    try {
      await downloadClimateCsv({
        latitude: lat,
        longitude: lon,
        use_demo_fallback: useFallback,
      });
    } catch (err: any) {
      alert("Failed to download CSV: " + err.message);
    }
  };

  const isDemo = climateSummary?.is_demo_data || climateHistory?.is_demo_data;

  return (
    <div className="space-y-6">
      <DemoBanner show={isDemo} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <CloudSun className="w-6 h-6 text-amber-500" />
              NASA POWER Climate Observatory
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Daily Agroclimatology satellite reanalysis for Peshawar Valley (34.0151° N, 71.5249° E)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExportCsv}
            className="text-xs font-semibold px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            Export Climate CSV
          </button>
          <Link
            href="/dashboard/climate/history"
            className="text-xs font-semibold px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition flex items-center gap-1.5"
          >
            Daily History Table
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
          <p className="font-semibold">NASA Upstream Notice</p>
          <p>{error}</p>
        </div>
      )}

      {/* Provenance Banner */}
      <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-sm border border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <span className="bg-blue-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              {climateSummary?.source || "NASA POWER"}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Endpoint: {climateSummary?.dataset_or_endpoint}
            </span>
          </div>
          <div className="text-xs text-slate-400">
            Retrieved At: <span className="text-slate-200 font-mono">{climateSummary?.retrieved_at?.substring(0, 19) || "Recent"}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">Coordinate Center</span>
            <span className="font-mono text-slate-200 font-medium">
              {climateSummary?.latitude}° N, {climateSummary?.longitude}° E
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Query Window</span>
            <span className="font-mono text-slate-200 font-medium">
              {climateSummary?.start_date} to {climateSummary?.end_date}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Missing-Data Integrity</span>
            <span className="font-medium text-amber-400">
              {climateSummary?.missing_data?.missing_days_count} gap days ({climateSummary?.missing_data?.missing_percentage}%)
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Spatial Grid</span>
            <span className="text-slate-200">~0.5° × 0.625° Reanalysis</span>
          </div>
        </div>

        <p className="text-xs text-slate-400 italic bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/50">
          {climateSummary?.coverage_note || "Loading coverage metadata..."}
        </p>
      </div>

      {/* Temperature Time Series Chart */}
      {climateHistory?.records && (
        <ClimateTemperatureChart
          records={climateHistory.records}
          unit={climateHistory.parameter_units?.T2M || "°C"}
        />
      )}

      {/* Precipitation Bar Chart */}
      {climateHistory?.records && (
        <ClimatePrecipitationChart
          records={climateHistory.records}
          unit={climateHistory.parameter_units?.PRECTOTCORR || "mm/day"}
        />
      )}

      {/* Monthly Summary Cards */}
      {climateSummary?.monthly && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900">
            Monthly Aggregation Table
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                  <th className="py-2.5 px-3">Month</th>
                  <th className="py-2.5 px-3">Valid Days</th>
                  <th className="py-2.5 px-3">Mean T2M</th>
                  <th className="py-2.5 px-3">Max T2M</th>
                  <th className="py-2.5 px-3">Min T2M</th>
                  <th className="py-2.5 px-3">Precipitation Sum</th>
                  <th className="py-2.5 px-3">Daily Mean Precip</th>
                  <th className="py-2.5 px-3">Relative Humidity</th>
                  <th className="py-2.5 px-3">Solar Radiation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {climateSummary.monthly.map((m) => (
                  <tr key={m.month} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-mono font-medium text-slate-900">{m.month}</td>
                    <td className="py-2.5 px-3 text-slate-600">{m.valid_days} / {m.days_in_month}</td>
                    <td className="py-2.5 px-3 text-slate-800">{m.t2m_mean !== null ? `${m.t2m_mean} °C` : "null"}</td>
                    <td className="py-2.5 px-3 text-red-600 font-medium">{m.t2m_max_mean !== null ? `${m.t2m_max_mean} °C` : "null"}</td>
                    <td className="py-2.5 px-3 text-sky-600">{m.t2m_min_mean !== null ? `${m.t2m_min_mean} °C` : "null"}</td>
                    <td className="py-2.5 px-3 text-blue-700 font-medium">{m.prectotcorr_sum !== null ? `${m.prectotcorr_sum} mm` : "null"}</td>
                    <td className="py-2.5 px-3 text-slate-600">{m.prectotcorr_daily_mean !== null ? `${m.prectotcorr_daily_mean} mm/d` : "null"}</td>
                    <td className="py-2.5 px-3 text-slate-700">{m.rh2m_mean !== null ? `${m.rh2m_mean} %` : "null"}</td>
                    <td className="py-2.5 px-3 text-amber-700">{m.allsky_sfc_sw_dwn_mean !== null ? `${m.allsky_sfc_sw_dwn_mean} MJ/m²` : "null"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
