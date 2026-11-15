"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, Calendar, AlertCircle } from "lucide-react";
import DemoBanner from "@/components/layout/DemoBanner";
import { getFarm, getCropHistory, createCropHistory, deleteCropHistory } from "@/lib/api/farms";
import { FarmProfile, CropHistoryEntry, Season } from "@/types/farm";

export default function FarmCropHistoryPage() {
  const params = useParams();
  const farmId = params.farmId as string;

  const [farm, setFarm] = useState<FarmProfile | null>(null);
  const [history, setHistory] = useState<CropHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [showAddForm, setShowAddForm] = useState(false);
  const [cropName, setCropName] = useState("");
  const [season, setSeason] = useState<Season>("rabi");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [farmData, histData] = await Promise.all([
        getFarm(farmId),
        getCropHistory(farmId),
      ]);
      setFarm(farmData);
      setHistory(histData);
    } catch (err: any) {
      setError(err.message || "Failed to load crop history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [farmId]);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (startDate && endDate && endDate < startDate) {
      setError("End date must be on or after start date.");
      return;
    }

    try {
      setSubmitting(true);
      await createCropHistory(farmId, {
        crop_name: cropName,
        season,
        start_date: startDate || null,
        end_date: endDate || null,
        notes: notes || null,
      });
      setShowAddForm(false);
      setCropName("");
      setStartDate("");
      setEndDate("");
      setNotes("");
      loadData();
    } catch (err: any) {
      setError(err.message || "Failed to add crop history record.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (entryId: string) => {
    if (!confirm("Are you sure you want to remove this crop history entry?")) return;
    try {
      await deleteCropHistory(farmId, entryId);
      loadData();
    } catch (err: any) {
      alert("Failed to delete record: " + err.message);
    }
  };

  return (
    <div className="space-y-6">
      <DemoBanner show={farm?.is_demo_data} />

      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Link
            href={`/farms/${farmId}`}
            className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1 mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to {farm?.name || "Farm"}
          </Link>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-600" />
            Cropping Sequence History
          </h1>
          <p className="text-xs text-slate-500">
            Multi-season rotation track record used to calibrate crop compatibility
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="text-xs font-semibold px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition flex items-center gap-1.5 shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          {showAddForm ? "Close Form" : "Log Crop Cycle"}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Add Form */}
      {showAddForm && (
        <form onSubmit={handleAddSubmit} className="bg-white p-5 rounded-2xl border border-blue-200 shadow-md space-y-4">
          <h3 className="font-bold text-slate-900 text-sm">Add Crop Cycle Record</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Crop Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Wheat (Gandum) or Maize (Makai)"
                value={cropName}
                onChange={(e) => setCropName(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Season *
              </label>
              <select
                value={season}
                onChange={(e) => setSeason(e.target.value as Season)}
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 capitalize"
              >
                <option value="rabi">Rabi (Winter)</option>
                <option value="kharif">Kharif (Summer)</option>
                <option value="zaid">Zaid (Spring/Transition)</option>
                <option value="annual">Annual</option>
                <option value="unknown">Unknown</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Start Date (Sowing)
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                End Date (Harvest)
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Agronomic Notes & Observations
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Flood irrigated 4 times; encountered moderate aphid pressure in February."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition"
            >
              {submitting ? "Saving..." : "Add Entry"}
            </button>
          </div>
        </form>
      )}

      {/* History Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <th className="py-3 px-4">Crop</th>
                <th className="py-3 px-4">Season</th>
                <th className="py-3 px-4">Sowing Period</th>
                <th className="py-3 px-4">Observations / Notes</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {history.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-slate-400">
                    No crop history records logged for this farm yet.
                  </td>
                </tr>
              ) : (
                history.map((h) => (
                  <tr key={h.entry_id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-slate-900">{h.crop_name}</td>
                    <td className="py-3 px-4 capitalize font-semibold text-blue-700">
                      {h.season}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">
                      {h.start_date || "—"} to {h.end_date || "—"}
                    </td>
                    <td className="py-3 px-4 text-slate-600 max-w-xs">{h.notes || "—"}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDelete(h.entry_id)}
                        className="text-red-500 hover:text-red-700 p-1 rounded transition"
                        title="Delete record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
