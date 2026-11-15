"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Lightbulb,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ArrowRight,
  TrendingUp,
  Droplet,
  ShieldAlert,
  HelpCircle,
  FileText,
} from "lucide-react";
import DemoBanner from "@/components/layout/DemoBanner";
import { getFarms } from "@/lib/api/farms";
import { generateRecommendations } from "@/lib/api/recommendations";
import { FarmProfile } from "@/types/farm";
import { RecommendationSet, Priority, Scenario } from "@/types/recommendation";
import ScenarioScoreChart from "@/components/charts/ScenarioScoreChart";
import { downloadPdfReport } from "@/lib/api/reports";

export default function RecommendationsPage() {
  const [farms, setFarms] = useState<FarmProfile[]>([]);
  const [selectedFarmId, setSelectedFarmId] = useState<string>("demo-peshawar-001");
  const [priority, setPriority] = useState<Priority>("balanced");
  const [recommendation, setRecommendation] = useState<RecommendationSet | null>(null);
  const [loading, setLoading] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  useEffect(() => {
    async function loadFarms() {
      try {
        const list = await getFarms();
        setFarms(list);
        if (list.length > 0) {
          setSelectedFarmId(list[0].farm_id);
          triggerGenerate(list[0].farm_id, "balanced");
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadFarms();
  }, []);

  const triggerGenerate = async (farmId: string, prio: Priority) => {
    try {
      setLoading(true);
      const res = await generateRecommendations({
        farm_id: farmId,
        priority: prio,
        use_demo_fallback: true,
      });
      setRecommendation(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePdfDownload = async () => {
    if (!recommendation) return;
    try {
      setDownloadingPdf(true);
      await downloadPdfReport(recommendation.recommendation_id);
    } catch (err: any) {
      alert("Error generating PDF: " + err.message);
    } finally {
      setDownloadingPdf(false);
    }
  };

  return (
    <div className="space-y-6">
      <DemoBanner show={recommendation?.is_demo_data} />

      {/* Header & Generator Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Lightbulb className="w-6 h-6 text-amber-500" />
              Agro Intelligence & Crop Rotation Engine
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Transparent, deterministic adaptation scenarios for Peshawar Valley cropping systems
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePdfDownload}
              disabled={!recommendation || downloadingPdf}
              className="text-xs font-semibold px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition flex items-center gap-1.5 shadow-sm disabled:opacity-50"
            >
              <FileText className="w-4 h-4" />
              {downloadingPdf ? "Generating PDF..." : "Export Brief (PDF)"}
            </button>
            <Link
              href="/dashboard/scenarios"
              className="text-xs font-semibold px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition shadow-sm"
            >
              Side-by-Side Comparison
            </Link>
          </div>
        </div>

        {/* Generator Controls */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-medium">
          <div className="flex items-center gap-2">
            <label className="text-slate-600">Select Farm:</label>
            <select
              value={selectedFarmId}
              onChange={(e) => {
                setSelectedFarmId(e.target.value);
                triggerGenerate(e.target.value, priority);
              }}
              className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 font-medium text-slate-800"
            >
              {farms.map((f) => (
                <option key={f.farm_id} value={f.farm_id}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-slate-600">Optimization Priority:</label>
            <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
              {(["balanced", "water_efficiency", "crop_diversity", "soil_cover"] as Priority[]).map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    setPriority(p);
                    triggerGenerate(selectedFarmId, p);
                  }}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition capitalize ${
                    priority === p ? "bg-white text-blue-700 shadow-sm" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {p.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scenario Score Comparison */}
      {recommendation?.scenarios && (
        <ScenarioScoreChart scenarios={recommendation.scenarios} />
      )}

      {/* Three Detailed Scenarios */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {recommendation?.scenarios.map((scen) => {
          const isPulse = scen.scenario_id === "pulse_inclusive";
          const isCover = scen.scenario_id === "soil_cover";

          return (
            <div
              key={scen.scenario_id}
              className={`bg-white rounded-2xl border shadow-sm p-5 flex flex-col justify-between space-y-4 ${
                isPulse
                  ? "border-indigo-300 ring-2 ring-indigo-50"
                  : isCover
                  ? "border-emerald-300 ring-2 ring-emerald-50"
                  : "border-slate-200"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                      isPulse
                        ? "bg-indigo-100 text-indigo-800"
                        : isCover
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {scen.scenario_id.replace("_", " ")}
                  </span>
                  <span className="text-xs font-mono bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded font-semibold">
                    Score: {scen.score ?? "N/A"} / 100
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-base leading-snug">
                  {scen.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {scen.description}
                </p>

                {/* Crop Sequence */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                    Cropping Sequence
                  </span>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase">
                    {scen.crop_sequence.map((c, i) => (
                      <React.Fragment key={c}>
                        <span className="bg-white px-2 py-1 rounded border border-slate-200 shadow-2xs">
                          {c.replace("_", " ")}
                        </span>
                        {i < scen.crop_sequence.length - 1 && <span className="text-slate-400">→</span>}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                {/* Score Breakdown Table */}
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Water Fit (wt {scen.score_breakdown.weights.water_fit})</span>
                    <span className="font-semibold text-slate-900">{scen.score_breakdown.water_fit ?? "N/A"}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Climate Suitability (wt {scen.score_breakdown.weights.climate_suitability})</span>
                    <span className="font-semibold text-slate-900">{scen.score_breakdown.climate_suitability ?? "N/A"}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Soil Health & Diversity (wt {scen.score_breakdown.weights.soil_health_diversity})</span>
                    <span className="font-semibold text-slate-900">{scen.score_breakdown.soil_health_diversity ?? "N/A"}</span>
                  </div>
                </div>

                {/* Rationale & Benefits */}
                <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                  <div>
                    <span className="font-semibold text-slate-800 block text-[11px]">Key Agronomic Rationale:</span>
                    <ul className="list-disc pl-4 text-slate-600 space-y-1 mt-1">
                      {scen.rationale.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <span className="font-semibold text-emerald-800 block text-[11px]">Adaptation Benefits:</span>
                    <ul className="list-disc pl-4 text-emerald-700 space-y-1 mt-1">
                      {scen.benefits.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <span className="font-semibold text-amber-800 block text-[11px]">Residual Risks:</span>
                    <ul className="list-disc pl-4 text-amber-700 space-y-1 mt-1">
                      {scen.risks.map((rk, i) => (
                        <li key={i}>{rk}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="capitalize">Evidence: <strong>{scen.evidence_status}</strong></span>
                <span className="italic">Peshawar Valley Model</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Limitations Box */}
      {recommendation?.limitations && (
        <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-5 space-y-2 text-xs text-amber-900">
          <div className="flex items-center gap-2 font-bold text-amber-950">
            <ShieldAlert className="w-4 h-4 text-amber-700" />
            Decision-Support Boundaries & Scientific Limitations
          </div>
          <ul className="list-disc pl-5 space-y-1 text-amber-800">
            {recommendation.limitations.map((lim, i) => (
              <li key={i}>{lim}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
