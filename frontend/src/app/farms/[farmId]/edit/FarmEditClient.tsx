"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowLeft, Save, AlertCircle } from "lucide-react";
import { getFarm, updateFarm } from "@/lib/api/farms";
import {
  AreaUnit,
  SoilType,
  IrrigationType,
  WaterAvailability,
  FarmProfile,
  GeoJSONPolygon,
  FieldBoundarySource,
  AreaSource,
} from "@/types/farm";

const FarmFieldMapper = dynamic(
  () => import("@/components/maps/FarmFieldMapper"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-80 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 text-sm border border-slate-200 animate-pulse">
        Loading Field Mapper...
      </div>
    ),
  }
);

export default function EditFarmPage() {
  const params = useParams();
  const router = useRouter();
  const farmId = params.farmId as string;

  const [farm, setFarm] = useState<FarmProfile | null>(null);
  const [name, setName] = useState("");
  const [latitude, setLatitude] = useState<number>(34.0151);
  const [longitude, setLongitude] = useState<number>(71.5249);
  const [fieldBoundary, setFieldBoundary] = useState<GeoJSONPolygon | null>(null);
  const [fieldBoundarySource, setFieldBoundarySource] = useState<FieldBoundarySource>("unknown");
  const [areaValue, setAreaValue] = useState<number>(5.0);
  const [areaUnit, setAreaUnit] = useState<AreaUnit>("acres");
  const [areaSource, setAreaSource] = useState<AreaSource>("unknown");
  const [soilType, setSoilType] = useState<SoilType>("loamy");
  const [irrigationType, setIrrigationType] = useState<IrrigationType>("tube_well");
  const [waterAvailability, setWaterAvailability] = useState<WaterAvailability>("medium");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await getFarm(farmId);
        setFarm(data);
        setName(data.name);
        setLatitude(data.latitude);
        setLongitude(data.longitude);
        setFieldBoundary(data.field_boundary || null);
        setFieldBoundarySource(data.field_boundary_source || "unknown");
        setAreaValue(data.area_value);
        setAreaUnit(data.area_unit);
        setAreaSource(data.area_source || "unknown");
        setSoilType(data.soil_type);
        setIrrigationType(data.irrigation_type);
        setWaterAvailability(data.water_availability);
      } catch (err: any) {
        setError(err.message || "Failed to load farm.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [farmId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (areaValue <= 0) {
      setError("Area value must be greater than zero.");
      return;
    }
    if (latitude < -90 || latitude > 90) {
      setError("Latitude must be between -90 and 90 degrees.");
      return;
    }
    if (longitude < -180 || longitude > 180) {
      setError("Longitude must be between -180 and 180 degrees.");
      return;
    }

    try {
      setSaving(true);
      await updateFarm(farmId, {
        name,
        latitude,
        longitude,
        area_value: areaValue,
        area_unit: areaUnit,
        soil_type: soilType,
        irrigation_type: irrigationType,
        water_availability: waterAvailability,
        field_boundary: fieldBoundary,
        field_boundary_source: fieldBoundarySource,
        area_source: areaSource,
      });
      router.push(`/farms/${farmId}`);
    } catch (err: any) {
      setError(err.message || "Failed to update farm.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500 text-sm">Loading farm details...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <Link
          href={`/farms/${farmId}`}
          className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1 mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Farm Overview
        </Link>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Edit Farm Profile & Field Boundary
        </h1>
        <p className="text-xs text-slate-500 font-mono">ID: {farmId}</p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Farm Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-xs sm:text-sm px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Farm Field Location & Boundary *
            </label>
            <FarmFieldMapper
              mode="edit"
              latitude={latitude}
              longitude={longitude}
              fieldBoundary={fieldBoundary}
              fieldBoundarySource={fieldBoundarySource}
              areaValue={areaValue}
              areaUnit={areaUnit}
              areaSource={areaSource}
              onLocationChange={(lat, lon) => {
                setLatitude(lat);
                setLongitude(lon);
              }}
              onBoundaryChange={(boundary, source) => {
                setFieldBoundary(boundary);
                setFieldBoundarySource(source);
              }}
              onAreaChange={(val, unit, source) => {
                setAreaValue(val);
                setAreaUnit(unit);
                setAreaSource(source);
              }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Latitude (°N) *
              </label>
              <input
                type="number"
                step="0.0001"
                required
                value={latitude}
                onChange={(e) => setLatitude(parseFloat(e.target.value))}
                className="w-full text-xs font-mono px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Longitude (°E) *
              </label>
              <input
                type="number"
                step="0.0001"
                required
                value={longitude}
                onChange={(e) => setLongitude(parseFloat(e.target.value))}
                className="w-full text-xs font-mono px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Soil Texture *
              </label>
              <select
                value={soilType}
                onChange={(e) => setSoilType(e.target.value as SoilType)}
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 capitalize"
              >
                <option value="loamy">Loamy</option>
                <option value="clay">Clay</option>
                <option value="sandy">Sandy</option>
                <option value="other">Other</option>
                <option value="unknown">Unknown</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Irrigation System *
              </label>
              <select
                value={irrigationType}
                onChange={(e) => setIrrigationType(e.target.value as IrrigationType)}
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 capitalize"
              >
                <option value="tube_well">Tube-well</option>
                <option value="canal">Canal</option>
                <option value="rain_fed">Rain-fed</option>
                <option value="other">Other</option>
                <option value="unknown">Unknown</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Water Availability *
              </label>
              <select
                value={waterAvailability}
                onChange={(e) => setWaterAvailability(e.target.value as WaterAvailability)}
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 capitalize"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="unknown">Unknown</option>
              </select>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
          <Link
            href={`/farms/${farmId}`}
            className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition flex items-center gap-1.5 shadow-sm disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? "Updating..." : "Update Farm Profile"}
          </button>
        </div>
      </form>
    </div>
  );
}
