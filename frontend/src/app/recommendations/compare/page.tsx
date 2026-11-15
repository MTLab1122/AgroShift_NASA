"use client";

import React, { useState, useEffect } from "react";
import { Download, FileText, ArrowLeft, RefreshCw, CheckCircle2, Droplets } from "lucide-react";
import Link from "next/link";
import { apiClient } from "@/lib/api/client";
import {
  StrategyComparisonTable,
  RotationStrategy,
} from "@/components/scenario-comparison/StrategyComparisonTable";
import { StrategyScoreChart } from "@/components/scenario-comparison/StrategyScoreChart";
import { SatelliteEvidencePanel } from "@/components/scenario-comparison/SatelliteEvidencePanel";
import { ConfidenceBadge } from "@/components/trust/ConfidenceBadge";
import { LocalCheckBadge } from "@/components/trust/LocalCheckBadge";
import { DataProvenancePanel } from "@/components/trust/DataProvenancePanel";

export default function CompareStrategiesPage() {
  const [strategies, setStrategies] = useState<RotationStrategy[]>([]);
  const [selectedStrategyId, setSelectedStrategyId] = useState<string>("water_saver_pulse_fix");
  const [farmId, setFarmId] = useState<string>("");
  const [primaryGoal, setPrimaryGoal] = useState<string>("water_efficiency");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch demo farm if farmId is empty
        const farmsRes = await apiClient.get<any[]>("/api/v1/farms");
        const farm = farmsRes.data[0];
        const fId = farm ? farm.farm_id : "demo-peshawar-001";
        setFarmId(fId);

        // Fetch the 3 benchmark strategies
        const stratRes = await apiClient.get<RotationStrategy[]>(
          `/api/v1/recommendations/strategies?farm_id=${fId}&primary_goal=${primaryGoal}`
        );
        setStrategies(stratRes.data);
      } catch (err: any) {
        console.error("Failed to load rotation strategies:", err);
        setError("Failed to load rotation strategies. Using demo fallback.");
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [primaryGoal]);

  const activeStrategy =
    strategies.find((s) => s.strategy_id === selectedStrategyId) || strategies[0];

  const handleExportPdf = async () => {
    setIsExportingPdf(true);
    try {
      // 1. Generate or fetch recommendation ID
      const genRes = await apiClient.post<any>("/api/v1/recommendations/generate", {
        farm_id: farmId || "demo-peshawar-001",
        priority: primaryGoal,
        use_demo_fallback: true,
      });
      const recId = genRes.data.recommendation_id;

      // 2. Request PDF download
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"}/api/v1/reports/pdf`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recommendation_id: recId }),
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `AgroShift_FarmPlan_${primaryGoal}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF export failed:", err);
      alert("Failed to export PDF report. Please verify backend is running.");
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleExportCsv = () => {
    const csvUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"}/api/v1/reports/climate-csv?latitude=34.0151&longitude=71.5249&use_demo_fallback=true`;
    window.open(csvUrl, "_blank");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 space-y-4">
        <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin" />
        <p className="text-sm font-semibold text-slate-700">Synthesizing Multi-NASA Satellite Data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Navigation & Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Link
                href="/dashboard/farmer"
                className="inline-flex items-center space-x-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Farmer Dashboard</span>
              </Link>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Three-Strategy Rotation Comparison
            </h1>
            <p className="text-xs text-slate-500">
              Peshawar Valley Agro-climatic Zone (34.0151° N, 71.5249° E) | Driven by NASA SMAP, IMERG, MODIS, &amp; POWER
            </p>
          </div>

          {/* Goal Selector & Export Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-slate-600 pl-2">Goal:</span>
              <select
                value={primaryGoal}
                onChange={(e) => setPrimaryGoal(e.target.value)}
                className="text-xs font-semibold bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
              >
                <option value="water_efficiency">Water Efficiency</option>
                <option value="soil_health">Soil Health</option>
                <option value="cash_yield">Cash Yield</option>
                <option value="balanced">Balanced</option>
              </select>
            </div>

            <button
              type="button"
              onClick={handleExportPdf}
              disabled={isExportingPdf}
              className="flex items-center space-x-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all disabled:opacity-50"
            >
              <FileText className="w-4 h-4" />
              <span>{isExportingPdf ? "Generating PDF..." : "Export PDF Plan"}</span>
            </button>

            <button
              type="button"
              onClick={handleExportCsv}
              className="flex items-center space-x-1.5 px-3.5 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold shadow-sm transition-all"
            >
              <Download className="w-4 h-4" />
              <span>CSV Data</span>
            </button>
          </div>
        </div>

        {/* Mandatory Local-Check Banner */}
        <LocalCheckBadge />

        {/* Confidence Level Header Badge */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Overall Model Status:</span>
            <ConfidenceBadge level={activeStrategy ? activeStrategy.confidence : "high"} showDetails />
          </div>
          <span className="text-xs text-slate-400">Deterministic NASA-Assisted Decision Engine</span>
        </div>

        {/* 3-Strategy Side-by-Side Comparison Table */}
        {strategies.length > 0 && (
          <StrategyComparisonTable
            strategies={strategies}
            selectedStrategyId={selectedStrategyId}
            onSelectStrategy={(id) => setSelectedStrategyId(id)}
          />
        )}

        {/* Score Chart Grid */}
        {strategies.length > 0 && <StrategyScoreChart strategies={strategies} />}

        {/* Satellite Evidence Panel for Selected Strategy */}
        {activeStrategy && <SatelliteEvidencePanel strategy={activeStrategy} />}

        {/* Multi-NASA Provenance Reference */}
        <DataProvenancePanel />
      </div>
    </div>
  );
}
