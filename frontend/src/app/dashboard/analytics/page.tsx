"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { LineChart as ChartIcon, Flame, Droplets, Sun, AlertTriangle } from "lucide-react";
import DemoBanner from "@/components/layout/DemoBanner";
import { getClimateSummary, getClimateHistory } from "@/lib/api/climate";
import { ClimateSummary, ClimateHistory } from "@/types/climate";
import ClimateTemperatureChart from "@/components/charts/ClimateTemperatureChart";
import ClimatePrecipitationChart from "@/components/charts/ClimatePrecipitationChart";

export default function AnalyticsPage() {
  const [climateSummary, setClimateSummary] = useState<ClimateSummary | null>(null);
  const [climateHistory, setClimateHistory] = useState<ClimateHistory | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [sum, hist] = await Promise.all([
          getClimateSummary({ latitude: 34.0151, longitude: 71.5249, use_demo_fallback: true }),
          getClimateHistory({ latitude: 34.0151, longitude: 71.5249, use_demo_fallback: true }),
        ]);
        setClimateSummary(sum);
        setClimateHistory(hist);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const records = climateHistory?.records || [];
  const heatStressDays = records.filter((r) => r.t2m_max !== null && r.t2m_max >= 38.0).length;
  const rainyDays = records.filter((r) => r.prectotcorr !== null && r.prectotcorr >= 1.0).length;
  const missingDays = records.filter((r) => r.t2m === null).length;

  return (
    <div className="space-y-6">
      <DemoBanner show={climateSummary?.is_demo_data} />

      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <ChartIcon className="w-6 h-6 text-indigo-600" />
          Agroclimatic Stress Analytics
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Quantitative agroclimatic risk indices derived from daily NASA POWER satellite observations
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-semibold">Extreme Heat Days (T2M_MAX ≥ 38°C)</span>
            <Flame className="w-4 h-4 text-red-500" />
          </div>
          <p className="text-3xl font-bold text-red-600">{heatStressDays} Days</p>
          <p className="text-xs text-slate-500">
            Triggers pollen sterility in summer maize and terminal shriveling in late wheat.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-semibold">Significant Rain Days (≥ 1.0 mm)</span>
            <Droplets className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-blue-600">{rainyDays} Days</p>
          <p className="text-xs text-slate-500">
            Monsoon contribution to effective root zone moisture replenishment.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-semibold">Missing Observation Gaps</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-3xl font-bold text-amber-600">{missingDays} Days</p>
          <p className="text-xs text-slate-500">
            Unfilled sensor or reanalysis gaps preserved strictly as null values.
          </p>
        </div>
      </div>

      {records.length > 0 && (
        <div className="space-y-6">
          <ClimateTemperatureChart records={records} />
          <ClimatePrecipitationChart records={records} />
        </div>
      )}
    </div>
  );
}
