"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { GitCompare, ArrowLeft, Check, AlertCircle } from "lucide-react";
import DemoBanner from "@/components/layout/DemoBanner";
import { generateRecommendations, compareScenarios } from "@/lib/api/recommendations";
import { Scenario, ScenarioComparisonResponse } from "@/types/recommendation";
import ScenarioScoreChart from "@/components/charts/ScenarioScoreChart";

export default function ScenariosComparisonPage() {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [comparison, setComparison] = useState<ScenarioComparisonResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const rec = await generateRecommendations({
          farm_id: "demo-peshawar-001",
          priority: "balanced",
          use_demo_fallback: true,
        });
        setScenarios(rec.scenarios);

        const comp = await compareScenarios({
          recommendation_id: rec.recommendation_id,
        });
        setComparison(comp);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      <DemoBanner show={true} />

      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Link
            href="/dashboard/recommendations"
            className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1 mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Recommendations
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <GitCompare className="w-6 h-6 text-blue-600" />
            Side-by-Side Scenario Trade-Off Matrix
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Auditable multi-criteria evaluation of rotation options for Peshawar Valley smallholders
          </p>
        </div>
      </div>

      {scenarios.length > 0 && <ScenarioScoreChart scenarios={scenarios} />}

      {/* Side-by-Side Comparison Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50">
          <h3 className="font-bold text-slate-900 text-sm">
            Agronomic & Environmental Metrics Comparison
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                <th className="py-3 px-4 w-1/4">Evaluation Dimension</th>
                {scenarios.map((s) => (
                  <th key={s.scenario_id} className="py-3 px-4 w-1/4">
                    <span className="block font-bold text-slate-900 text-sm">{s.title}</span>
                    <span className="text-[11px] font-mono text-blue-700">
                      Score: {s.score}/100
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-700 bg-slate-50">
                  Cropping Sequence
                </td>
                {scenarios.map((s) => (
                  <td key={s.scenario_id} className="py-3 px-4 font-mono uppercase font-bold text-slate-800">
                    {s.crop_sequence.join(" → ")}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="py-3 px-4 font-semibold text-slate-700 bg-slate-50">
                  Water Fit Index (wt: 0.35)
                </td>
                {scenarios.map((s) => (
                  <td key={s.scenario_id} className="py-3 px-4 font-semibold text-blue-600">
                    {s.score_breakdown.water_fit} / 100
                  </td>
                ))}
              </tr>

              <tr>
                <td className="py-3 px-4 font-semibold text-slate-700 bg-slate-50">
                  Climate Suitability (wt: 0.35)
                </td>
                {scenarios.map((s) => (
                  <td key={s.scenario_id} className="py-3 px-4 font-semibold text-amber-600">
                    {s.score_breakdown.climate_suitability} / 100
                  </td>
                ))}
              </tr>

              <tr>
                <td className="py-3 px-4 font-semibold text-slate-700 bg-slate-50">
                  Soil Health & Diversity (wt: 0.30)
                </td>
                {scenarios.map((s) => (
                  <td key={s.scenario_id} className="py-3 px-4 font-semibold text-emerald-600">
                    {s.score_breakdown.soil_health_diversity} / 100
                  </td>
                ))}
              </tr>

              <tr>
                <td className="py-3 px-4 font-semibold text-slate-700 bg-slate-50">
                  Biological N Fixation
                </td>
                {scenarios.map((s) => (
                  <td key={s.scenario_id} className="py-3 px-4">
                    {s.scenario_id === "baseline" ? (
                      <span className="text-slate-400">None (Cereal only)</span>
                    ) : (
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Symbiotic Rhizobia
                      </span>
                    )}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="py-3 px-4 font-semibold text-slate-700 bg-slate-50">
                  Primary Risk
                </td>
                {scenarios.map((s) => (
                  <td key={s.scenario_id} className="py-3 px-4 text-slate-600">
                    {s.risks[0]}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Trade-Off Synthesis */}
      {comparison?.tradeoffs && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <h3 className="font-bold text-slate-900 text-sm">
            Strategic Decision Trade-Offs
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl space-y-1">
              <span className="font-bold text-blue-900 block">Water Savings Impact</span>
              <p className="text-blue-800">{comparison.tradeoffs.water_savings}</p>
            </div>
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
              <span className="font-bold text-emerald-900 block">Soil Regeneration</span>
              <p className="text-emerald-800">{comparison.tradeoffs.soil_regeneration}</p>
            </div>
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
              <span className="font-bold text-amber-900 block">Market Channels</span>
              <p className="text-amber-800">{comparison.tradeoffs.market_familiarity}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
