"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Download, Filter, Search } from "lucide-react";
import DemoBanner from "@/components/layout/DemoBanner";
import { getClimateHistory } from "@/lib/api/climate";
import { ClimateHistory } from "@/types/climate";
import { downloadClimateCsv } from "@/lib/api/reports";

export default function ClimateHistoryPage() {
  const [history, setHistory] = useState<ClimateHistory | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const lat = 34.0151;
  const lon = 71.5249;

  useEffect(() => {
    async function loadHistory() {
      try {
        setLoading(true);
        const data = await getClimateHistory({
          latitude: lat,
          longitude: lon,
          use_demo_fallback: true,
        });
        setHistory(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadHistory();
  }, []);

  const filteredRecords = history?.records.filter((r) =>
    r.date.includes(search)
  ) || [];

  return (
    <div className="space-y-6">
      <DemoBanner show={history?.is_demo_data} />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <Link
            href="/dashboard/climate"
            className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1 mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Climate Observatory
          </Link>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Daily Observations Ledger
          </h1>
          <p className="text-xs text-slate-500">
            Audit-grade record of daily NASA POWER parameters with fill-value tracking
          </p>
        </div>

        <button
          onClick={() => downloadClimateCsv({ latitude: lat, longitude: lon, use_demo_fallback: true })}
          className="text-xs font-semibold px-3.5 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5" />
          Download CSV
        </button>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Filter by date (YYYY-MM)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <span className="text-xs text-slate-500">
            Showing {filteredRecords.length} records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                <th className="py-2.5 px-3">Date (ISO)</th>
                <th className="py-2.5 px-3">T2M Mean ({history?.parameter_units?.T2M || "°C"})</th>
                <th className="py-2.5 px-3">T2M Max</th>
                <th className="py-2.5 px-3">T2M Min</th>
                <th className="py-2.5 px-3">Precipitation ({history?.parameter_units?.PRECTOTCORR || "mm/d"})</th>
                <th className="py-2.5 px-3">Rel. Humidity ({history?.parameter_units?.RH2M || "%"})</th>
                <th className="py-2.5 px-3">Solar Irradiance ({history?.parameter_units?.ALLSKY_SFC_SW_DWN || "MJ/m²"})</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {filteredRecords.map((r) => (
                <tr key={r.date} className="hover:bg-slate-50">
                  <td className="py-2 px-3 font-semibold text-slate-900">{r.date}</td>
                  <td className="py-2 px-3">
                    {r.t2m !== null ? (
                      <span className="text-slate-800">{r.t2m}</span>
                    ) : (
                      <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-[10px] font-sans font-medium">
                        null (Gap)
                      </span>
                    )}
                  </td>
                  <td className="py-2 px-3 text-red-600">{r.t2m_max !== null ? r.t2m_max : "—"}</td>
                  <td className="py-2 px-3 text-sky-600">{r.t2m_min !== null ? r.t2m_min : "—"}</td>
                  <td className="py-2 px-3">
                    {r.prectotcorr !== null ? (
                      <span className={r.prectotcorr > 0 ? "text-blue-600 font-bold" : "text-slate-400"}>
                        {r.prectotcorr}
                      </span>
                    ) : (
                      <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-[10px] font-sans font-medium">
                        null (Gap)
                      </span>
                    )}
                  </td>
                  <td className="py-2 px-3 text-slate-700">{r.rh2m !== null ? `${r.rh2m}%` : "—"}</td>
                  <td className="py-2 px-3 text-amber-700">{r.allsky_sfc_sw_dwn !== null ? r.allsky_sfc_sw_dwn : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
