"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Sprout,
  CloudSun,
  Droplets,
  ArrowRight,
  TrendingUp,
  MapPin,
  Calendar,
  Layers,
  FileText,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";
import DemoBanner from "@/components/layout/DemoBanner";
import { getFarms } from "@/lib/api/farms";
import { getClimateSummary } from "@/lib/api/climate";
import { generateRecommendations } from "@/lib/api/recommendations";
import { FarmProfile } from "@/types/farm";
import { ClimateSummary } from "@/types/climate";
import { RecommendationSet, Scenario } from "@/types/recommendation";
import ClimateTemperatureChart from "@/components/charts/ClimateTemperatureChart";
import ScenarioScoreChart from "@/components/charts/ScenarioScoreChart";

export default function DashboardPage() {
  const [farms, setFarms] = useState<FarmProfile[]>([]);
  const [selectedFarm, setSelectedFarm] = useState<FarmProfile | null>(null);
  const [climate, setClimate] = useState<ClimateSummary | null>(null);
  const [recommendations, setRecommendations] = useState<RecommendationSet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        const farmsList = await getFarms();
        setFarms(farmsList);

        if (farmsList.length > 0) {
          const defaultFarm = farmsList[0];
          setSelectedFarm(defaultFarm);

          // Fetch climate summary with fallback
          const clim = await getClimateSummary({
            farm_id: defaultFarm.farm_id,
            use_demo_fallback: true,
          });
          setClimate(clim);

          // Generate or fetch recommendations
          const recs = await generateRecommendations({
            farm_id: defaultFarm.farm_id,
            priority: "balanced",
            use_demo_fallback: true,
          });
          setRecommendations(recs);
        }
      } catch (err: any) {
        console.error("Dashboard loading error:", err);
        setError(err.message || "Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleFarmChange = async (farmId: string) => {
    const farm = farms.find((f) => f.farm_id === farmId);
    if (!farm) return;
    setSelectedFarm(farm);
    try {
      setLoading(true);
      const clim = await getClimateSummary({
        farm_id: farm.farm_id,
        use_demo_fallback: true,
      });
      setClimate(clim);

      const recs = await generateRecommendations({
        farm_id: farm.farm_id,
        priority: "balanced",
        use_demo_fallback: true,
      });
      setRecommendations(recs);
    } catch (err: any) {
      setError(err.message || "Failed to update farm data.");
    } finally {
      setLoading(false);
    }
  };

  const isDemo = selectedFarm?.is_demo_data || climate?.is_demo_data || recommendations?.is_demo_data;

  return (
    <div className="space-y-6">
      <DemoBanner show={isDemo} />

      {/* Header & Farm Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Command Center
            </h1>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Verified Decision Support
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            NASA POWER satellite agroclimatology synthesized with Peshawar Valley soil and water realities.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label htmlFor="farm-select" className="text-xs font-semibold text-slate-600 whitespace-nowrap">
            Active Farm:
          </label>
          <select
            id="farm-select"
            value={selectedFarm?.farm_id || ""}
            onChange={(e) => handleFarmChange(e.target.value)}
            className="text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {farms.map((f) => (
              <option key={f.farm_id} value={f.farm_id}>
                {f.name} ({f.area_value} {f.area_unit})
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Mean Air Temp (T2M)</span>
            <CloudSun className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">
              {climate?.overall?.t2m_mean !== null && climate?.overall?.t2m_mean !== undefined
                ? `${climate.overall.t2m_mean}°C`
                : "N/A"}
            </span>
            <span className="text-xs text-slate-400">
              Peak: {climate?.overall?.t2m_max_mean ?? "N/A"}°C
            </span>
          </div>
          <span className="text-[11px] text-slate-400 mt-2 font-mono">
            NASA POWER Daily Grid (0.5°)
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Precipitation Total</span>
            <Droplets className="w-4 h-4 text-blue-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">
              {climate?.overall?.prectotcorr_sum !== null && climate?.overall?.prectotcorr_sum !== undefined
                ? `${climate.overall.prectotcorr_sum} mm`
                : "N/A"}
            </span>
            <span className="text-xs text-slate-400">
              Avg: {climate?.overall?.prectotcorr_daily_mean ?? "N/A"} mm/d
            </span>
          </div>
          <span className="text-[11px] text-slate-400 mt-2 font-mono">
            PRECTOTCORR In-Season Sum
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Soil Texture & Water</span>
            <Layers className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2">
            <span className="text-lg font-bold text-slate-900 capitalize">
              {selectedFarm?.soil_type || "Loamy"} Soil
            </span>
            <p className="text-xs text-slate-500">
              Irrigation: {selectedFarm?.irrigation_type.replace("_", " ") || "Tube-well"}
            </p>
          </div>
          <span className="text-[11px] text-slate-400 mt-2">
            Availability: {selectedFarm?.water_availability || "Medium"}
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Recommended Strategy</span>
            <TrendingUp className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="mt-2">
            <span className="text-lg font-bold text-indigo-600">
              Pulse Diversification
            </span>
            <p className="text-xs text-slate-500">
              Score: {recommendations?.scenarios[1]?.score ?? "86"}/100
            </p>
          </div>
          <Link
            href="/dashboard/recommendations"
            className="text-[11px] text-indigo-600 font-semibold hover:underline mt-2 flex items-center gap-1"
          >
            Explore 3 Scenarios <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Climate Provenance & Visual Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {climate?.monthly && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Monthly Agroclimatology Trends
                  </h2>
                  <p className="text-xs text-slate-500">
                    Peshawar Valley (Lat {selectedFarm?.latitude}, Lon {selectedFarm?.longitude})
                  </p>
                </div>
                <Link
                  href="/dashboard/climate"
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  Full Climate Page <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full text-xs text-left">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                      <th className="py-2.5 px-3 font-semibold">Month</th>
                      <th className="py-2.5 px-3 font-semibold">Valid / Total Days</th>
                      <th className="py-2.5 px-3 font-semibold">Mean Temp (°C)</th>
                      <th className="py-2.5 px-3 font-semibold">Max Temp (°C)</th>
                      <th className="py-2.5 px-3 font-semibold">Rainfall (mm)</th>
                      <th className="py-2.5 px-3 font-semibold">Solar Irradiance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {climate.monthly.map((m) => (
                      <tr key={m.month} className="hover:bg-slate-50/70">
                        <td className="py-2.5 px-3 font-mono font-medium text-slate-800">{m.month}</td>
                        <td className="py-2.5 px-3 text-slate-500">{m.valid_days} / {m.days_in_month}</td>
                        <td className="py-2.5 px-3 text-slate-700">{m.t2m_mean !== null ? `${m.t2m_mean}°C` : "N/A"}</td>
                        <td className="py-2.5 px-3 text-red-600 font-medium">{m.t2m_max_mean !== null ? `${m.t2m_max_mean}°C` : "N/A"}</td>
                        <td className="py-2.5 px-3 text-blue-600 font-medium">{m.prectotcorr_sum !== null ? `${m.prectotcorr_sum} mm` : "N/A"}</td>
                        <td className="py-2.5 px-3 text-amber-700">{m.allsky_sfc_sw_dwn_mean !== null ? `${m.allsky_sfc_sw_dwn_mean} MJ/m²` : "N/A"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Scenario Comparison Chart */}
          {recommendations?.scenarios && (
            <ScenarioScoreChart scenarios={recommendations.scenarios} />
          )}
        </div>

        {/* Right Sidebar: Farm Context & Fast Actions */}
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              NASA Provenance Metadata
            </h3>
            <div className="space-y-2.5 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Data Source</span>
                <span className="font-medium text-slate-800">{climate?.source || "NASA POWER"}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Gridded Coordinate</span>
                <span className="font-mono text-slate-700">{selectedFarm?.latitude}° N, {selectedFarm?.longitude}° E</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Spatial Resolution</span>
                <span className="text-slate-700">~0.5° × 0.625° Reanalysis Cell</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Missing Observation Policy</span>
                <span className="text-slate-700">Fill values (≤ -900) mapped to null. Gaps left unfilled.</span>
              </div>
              {climate?.missing_data && (
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="font-semibold text-slate-700 block">Missing Data Badge:</span>
                  <span className="text-amber-700 font-mono">
                    {climate.missing_data.missing_days_count} gap days ({climate.missing_data.missing_percentage}%)
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              Quick Decision Actions
            </h3>
            <div className="space-y-2">
              <Link
                href="/dashboard/recommendations"
                className="w-full text-xs font-semibold py-2.5 px-3 bg-blue-600 text-white rounded-lg flex items-center justify-between hover:bg-blue-500 transition"
              >
                <span>Generate Recommendations</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/dashboard/climate"
                className="w-full text-xs font-semibold py-2.5 px-3 bg-slate-100 text-slate-700 rounded-lg flex items-center justify-between hover:bg-slate-200 transition"
              >
                <span>Explore Daily NASA Charts</span>
                <CloudSun className="w-4 h-4 text-slate-600" />
              </Link>
              <Link
                href="/dashboard/scenarios"
                className="w-full text-xs font-semibold py-2.5 px-3 bg-slate-100 text-slate-700 rounded-lg flex items-center justify-between hover:bg-slate-200 transition"
              >
                <span>Side-by-Side Tradeoffs</span>
                <Layers className="w-4 h-4 text-slate-600" />
              </Link>
              <Link
                href="/dashboard/reports"
                className="w-full text-xs font-semibold py-2.5 px-3 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg flex items-center justify-between hover:bg-emerald-100 transition"
              >
                <span>Export PDF Executive Brief</span>
                <FileText className="w-4 h-4 text-emerald-600" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
