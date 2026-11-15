"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, FileText, Lightbulb, ShieldAlert } from "lucide-react";
import DemoBanner from "@/components/layout/DemoBanner";
import { getRecommendation } from "@/lib/api/recommendations";
import { RecommendationSet } from "@/types/recommendation";
import ScenarioScoreChart from "@/components/charts/ScenarioScoreChart";
import { downloadPdfReport } from "@/lib/api/reports";

export default function RecommendationDetailPage() {
  const params = useParams();
  const recId = params.id as string;

  const [rec, setRec] = useState<RecommendationSet | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await getRecommendation(recId);
        setRec(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [recId]);

  const handleDownload = async () => {
    try {
      setDownloading(true);
      await downloadPdfReport(recId);
    } catch (err: any) {
      alert("Failed to download PDF: " + err.message);
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500 text-sm">Loading recommendation record...</div>;
  }

  if (!rec) {
    return <div className="p-8 text-center text-red-500 text-sm">Recommendation not found.</div>;
  }

  return (
    <div className="space-y-6">
      <DemoBanner show={rec.is_demo_data} />

      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Link
            href="/dashboard/recommendations"
            className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1 mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Recommendation Dashboard
          </Link>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Recommendation Record: {rec.recommendation_id}
          </h1>
          <p className="text-xs text-slate-500">
            Farm: {rec.farm_id} | Optimization Priority: <strong className="capitalize">{rec.priority}</strong>
          </p>
        </div>

        <button
          onClick={handleDownload}
          disabled={downloading}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl transition flex items-center gap-1.5 shadow-sm disabled:opacity-50 self-start sm:self-auto"
        >
          <FileText className="w-4 h-4" />
          {downloading ? "Compiling..." : "Export PDF Brief"}
        </button>
      </div>

      <ScenarioScoreChart scenarios={rec.scenarios} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {rec.scenarios.map((scen) => (
          <div key={scen.scenario_id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                {scen.scenario_id}
              </span>
              <span className="text-xs font-mono font-bold text-blue-700">
                {scen.score ?? "N/A"}/100
              </span>
            </div>
            <h3 className="font-bold text-slate-900 text-sm">{scen.title}</h3>
            <p className="text-xs text-slate-600">{scen.description}</p>
            <div className="p-2.5 bg-slate-50 rounded-lg text-xs font-mono uppercase font-bold text-slate-800">
              Sequence: {scen.crop_sequence.join(" → ")}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
