"use client";

import React, { useState } from "react";
import { FileText, Download, FileSpreadsheet, ShieldCheck, CheckCircle2 } from "lucide-react";
import DemoBanner from "@/components/layout/DemoBanner";
import { downloadPdfReport, downloadClimateCsv } from "@/lib/api/reports";
import { generateRecommendations } from "@/lib/api/recommendations";

export default function ReportsPage() {
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [downloadingCsv, setDownloadingCsv] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const farmId = "demo-peshawar-001";

  const handlePdfExport = async () => {
    try {
      setDownloadingPdf(true);
      setStatusMessage("Synthesizing recommendation brief and compiling PDF...");
      // Generate or retrieve current recommendation
      const rec = await generateRecommendations({
        farm_id: farmId,
        priority: "balanced",
        use_demo_fallback: true,
      });
      await downloadPdfReport(rec.recommendation_id);
      setStatusMessage("PDF executive brief successfully generated and downloaded.");
    } catch (err: any) {
      alert("PDF generation failed: " + err.message);
      setStatusMessage(null);
    } finally {
      setDownloadingPdf(false);
    }
  };

  const handleCsvExport = async () => {
    try {
      setDownloadingCsv(true);
      setStatusMessage("Querying NASA POWER daily point data and formatting CSV with explicit units...");
      await downloadClimateCsv({
        farm_id: farmId,
        use_demo_fallback: true,
      });
      setStatusMessage("NASA POWER climate CSV successfully generated and downloaded.");
    } catch (err: any) {
      alert("CSV export failed: " + err.message);
      setStatusMessage(null);
    } finally {
      setDownloadingCsv(false);
    }
  };

  return (
    <div className="space-y-6">
      <DemoBanner show={true} />

      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <FileText className="w-6 h-6 text-emerald-600" />
          Export & Reporting Hub
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Generate audit-grade documentation, executive briefs, and standardized CSV datasets
        </p>
      </div>

      {statusMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm rounded-xl flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* PDF Executive Report Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center border border-red-100">
              <FileText className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              Executive Climate Adaptation Brief (PDF)
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Official judge-ready PDF summary containing farm profile metadata, NASA POWER provenance, exact dynamic units, all 3 rotation scenarios, score breakdowns, and transparent scientific limitations.
            </p>
            <ul className="text-xs text-slate-500 space-y-1 list-disc pl-4">
              <li>Includes NASA POWER AG Community source citation</li>
              <li>Detailed rationale, benefits, and risks for each scenario</li>
              <li>Includes explicit demo-data disclosures</li>
            </ul>
          </div>

          <button
            onClick={handlePdfExport}
            disabled={downloadingPdf}
            className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm rounded-xl transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            {downloadingPdf ? "Compiling PDF..." : "Export PDF Report"}
          </button>
        </div>

        {/* Climate CSV Export Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center border border-blue-100">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              Daily Climate Observations Dataset (CSV)
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Clean, comma-separated values file of daily NASA POWER parameters. Strictly formatted with ISO 8601 dates, dynamic parameter unit headers, and metadata comments.
            </p>
            <ul className="text-xs text-slate-500 space-y-1 list-disc pl-4">
              <li>ISO dates (YYYY-MM-DD)</li>
              <li>Explicit units in column headers (e.g. `t2m_mean_degC`)</li>
              <li>Missing observations preserved as explicit `NA` (never 0)</li>
            </ul>
          </div>

          <button
            onClick={handleCsvExport}
            disabled={downloadingCsv}
            className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm rounded-xl transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            {downloadingCsv ? "Preparing CSV..." : "Export Climate CSV"}
          </button>
        </div>
      </div>
    </div>
  );
}
