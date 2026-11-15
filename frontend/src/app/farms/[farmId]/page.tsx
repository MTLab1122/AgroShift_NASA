"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  CloudSun,
  Lightbulb,
  FileSpreadsheet,
  Trash2,
  Edit,
  Layers,
  Droplet,
  Plus,
} from "lucide-react";
import DemoBanner from "@/components/layout/DemoBanner";
import { getFarm, deleteFarm } from "@/lib/api/farms";
import { FarmProfile } from "@/types/farm";

const FarmLocationPicker = dynamic(
  () => import("@/components/maps/FarmLocationPicker"),
  { ssr: false }
);

export default function FarmDetailPage() {
  const params = useParams();
  const router = useRouter();
  const farmId = params.farmId as string;

  const [farm, setFarm] = useState<FarmProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await getFarm(farmId);
        setFarm(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [farmId]);

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to safely delete farm ${farm?.name}?`)) return;
    try {
      setDeleting(true);
      await deleteFarm(farmId);
      router.push("/farms");
    } catch (err: any) {
      alert("Failed to delete farm: " + err.message);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500 text-sm">Loading farm profile...</div>;
  }

  if (!farm) {
    return <div className="p-8 text-center text-red-500 text-sm">Farm profile not found.</div>;
  }

  return (
    <div className="space-y-6">
      <DemoBanner show={farm.is_demo_data} />

      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Link
            href="/farms"
            className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1 mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Farms List
          </Link>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              {farm.name}
            </h1>
            {farm.is_demo_data && (
              <span className="text-[10px] font-bold uppercase bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                Demo
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 font-mono">ID: {farm.farm_id}</p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/farms/${farm.farm_id}/edit`}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition flex items-center gap-1.5"
          >
            <Edit className="w-3.5 h-3.5" /> Edit Farm
          </Link>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 disabled:opacity-50"
          >
            <Trash2 className="w-3.5 h-3.5" /> Delete
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-medium">Area</span>
            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full capitalize">
              {farm.area_source === "map_calculated" ? "Map Calculated" : farm.area_source === "manual_entry" ? "Manual Entry" : "Recorded"}
            </span>
          </div>
          <p className="text-lg font-bold text-slate-900">{farm.area_value} {farm.area_unit}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-slate-400 font-medium">Soil Classification</span>
          <p className="text-lg font-bold text-slate-900 capitalize">{farm.soil_type}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-slate-400 font-medium">Irrigation Method</span>
          <p className="text-lg font-bold text-slate-900 capitalize">{farm.irrigation_type.replace('_', ' ')}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-slate-400 font-medium">Water Availability</span>
          <p className="text-lg font-bold text-slate-900 capitalize">{farm.water_availability}</p>
        </div>
      </div>

      {/* Map & Crop History Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Farm Map Pin & Field Boundary Preview */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-600" /> Geolocation & Field Boundary
            </h3>
            {farm.field_boundary && (
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                Boundary Saved
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 font-mono">
            {farm.latitude.toFixed(4)}° N, {farm.longitude.toFixed(4)}° E
          </p>
          <FarmLocationPicker
            latitude={farm.latitude}
            longitude={farm.longitude}
            fieldBoundary={farm.field_boundary}
            readOnly={true}
            onChange={() => {}}
            height="260px"
          />
        </div>

        {/* Quick Links Hub */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm mb-3">
              Farm Analysis Workflows
            </h3>
            <div className="space-y-2.5">
              <Link
                href="/dashboard/climate"
                className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-between transition text-xs font-semibold text-slate-800"
              >
                <div className="flex items-center gap-2.5">
                  <CloudSun className="w-4 h-4 text-amber-500" />
                  <span>NASA POWER Agroclimatology</span>
                </div>
                <span className="text-slate-400">→</span>
              </Link>

              <Link
                href="/dashboard/recommendations"
                className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-between transition text-xs font-semibold text-slate-800"
              >
                <div className="flex items-center gap-2.5">
                  <Lightbulb className="w-4 h-4 text-indigo-500" />
                  <span>Crop Rotation Recommendations</span>
                </div>
                <span className="text-slate-400">→</span>
              </Link>

              <Link
                href={`/farms/${farm.farm_id}/crop-history`}
                className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-between transition text-xs font-semibold text-slate-800"
              >
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  <span>Manage Historical Crop Cycles ({farm.crop_history?.length || 0})</span>
                </div>
                <span className="text-slate-400">→</span>
              </Link>

              <Link
                href="/dashboard/reports"
                className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-between transition text-xs font-semibold text-slate-800"
              >
                <div className="flex items-center gap-2.5">
                  <FileSpreadsheet className="w-4 h-4 text-blue-600" />
                  <span>Export Executive PDF / CSV</span>
                </div>
                <span className="text-slate-400">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
