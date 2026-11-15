"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polygon,
  Polyline,
  CircleMarker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  Search,
  Navigation,
  MapPin,
  PenTool,
  RotateCcw,
  Trash2,
  CheckCircle,
  HelpCircle,
  Maximize2,
  AlertTriangle,
} from "lucide-react";
import {
  AreaUnit,
  AreaSource,
  FieldBoundarySource,
  GeoJSONPolygon,
} from "@/types/farm";
import {
  leafletLatLngToGeoJSONPolygon,
  geoJSONPolygonToLeafletLatLngs,
  calculatePolygonAreaAcres,
  calculatePolygonAreaHectares,
  hectaresToAcres,
  acresToHectares,
  formatArea,
  isValidGeoJSONPolygon,
} from "@/lib/geo/field-area";

const PESHAWAR_VALLEY_CENTER: [number, number] = [34.0151, 71.5249];
const DEFAULT_ZOOM = 12;

const SUPPORTED_DISTRICTS = [
  { id: "peshawar", name: "Peshawar", center: [34.0151, 71.5249] as [number, number] },
  { id: "charsadda", name: "Charsadda", center: [34.1454, 71.7306] as [number, number] },
  { id: "mardan", name: "Mardan", center: [34.198, 72.0229] as [number, number] },
];

const createCustomPin = () => {
  return L.divIcon({
    className: "map-pin",
    html: `
      <div style="
        background-color: #0b3d91;
        width: 32px;
        height: 32px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid #ffffff;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
      ">
        <div style="
          width: 10px;
          height: 10px;
          background-color: #38bdf8;
          border-radius: 50%;
          transform: rotate(45deg);
        "></div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });
};

interface MapUpdaterProps {
  center: [number, number];
}

function MapUpdater({ center }: MapUpdaterProps) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, map.getZoom() < 12 ? 13 : map.getZoom());
  }, [center, map]);
  return null;
}

interface MapInteractionProps {
  activeTool: "location" | "draw" | "idle";
  onLocationClick: (lat: number, lng: number) => void;
  onAddPoint: (lat: number, lng: number) => void;
}

function MapInteraction({ activeTool, onLocationClick, onAddPoint }: MapInteractionProps) {
  useMapEvents({
    click(e) {
      const lat = Number(e.latlng.lat.toFixed(6));
      const lng = Number(e.latlng.lng.toFixed(6));
      if (activeTool === "location") {
        onLocationClick(lat, lng);
      } else if (activeTool === "draw") {
        onAddPoint(lat, lng);
      }
    },
  });
  return null;
}

export type FarmFieldMapperProps = {
  mode: "create" | "edit";

  latitude: number | null;
  longitude: number | null;

  fieldBoundary: GeoJSONPolygon | null;
  fieldBoundarySource: FieldBoundarySource;

  areaValue: number | null;
  areaUnit: AreaUnit;
  areaSource: AreaSource;

  onLocationChange: (latitude: number, longitude: number) => void;
  onBoundaryChange: (
    boundary: GeoJSONPolygon | null,
    source: FieldBoundarySource
  ) => void;
  onAreaChange: (
    areaValue: number,
    areaUnit: AreaUnit,
    areaSource: AreaSource
  ) => void;

  className?: string;
};

export default function FarmFieldMapper({
  mode,
  latitude,
  longitude,
  fieldBoundary,
  fieldBoundarySource,
  areaValue,
  areaUnit,
  areaSource,
  onLocationChange,
  onBoundaryChange,
  onAreaChange,
  className = "",
}: FarmFieldMapperProps) {
  const [mounted, setMounted] = useState(false);
  const [activeTool, setActiveTool] = useState<"location" | "draw" | "idle">("location");
  const [draftPoints, setDraftPoints] = useState<[number, number][]>([]);
  const [editingPoints, setEditingPoints] = useState<[number, number][]>([]);
  const [isEditingExisting, setIsEditingExisting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [geoError, setGeoError] = useState<string | null>(null);
  const [manualAreaInput, setManualAreaInput] = useState<string>(
    areaSource === "manual_entry" && areaValue ? String(areaValue) : ""
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  // Initialize editing points when field boundary changes
  useEffect(() => {
    if (fieldBoundary && isValidGeoJSONPolygon(fieldBoundary)) {
      const leafletPts = geoJSONPolygonToLeafletLatLngs(fieldBoundary);
      // Remove trailing closure point for vertex list editing
      const nonClosed = leafletPts.slice(0, leafletPts.length - 1);
      setEditingPoints(nonClosed);
    } else {
      setEditingPoints([]);
    }
  }, [fieldBoundary]);

  const customPin = useMemo(() => {
    if (typeof window === "undefined") return null;
    return createCustomPin();
  }, []);

  const currentCenter: [number, number] = useMemo(() => {
    if (latitude !== null && longitude !== null && !isNaN(latitude) && !isNaN(longitude)) {
      return [latitude, longitude];
    }
    return PESHAWAR_VALLEY_CENTER;
  }, [latitude, longitude]);

  // Handle location pin set
  const handleLocationSet = useCallback(
    (lat: number, lng: number) => {
      onLocationChange(lat, lng);
      // Auto-prompt to draw field boundary if none exists
      if (!fieldBoundary && draftPoints.length === 0) {
        setActiveTool("draw");
      }
    },
    [onLocationChange, fieldBoundary, draftPoints.length]
  );

  // Add vertex point in draw mode
  const handleAddPoint = useCallback((lat: number, lng: number) => {
    setDraftPoints((prev) => [...prev, [lat, lng]]);
  }, []);

  // Undo last point in draft
  const handleUndoPoint = () => {
    setDraftPoints((prev) => prev.slice(0, prev.length - 1));
  };

  // Complete and calculate polygon
  const handleCompletePolygon = () => {
    if (draftPoints.length < 3) return;

    try {
      const geojson = leafletLatLngToGeoJSONPolygon(draftPoints);
      onBoundaryChange(geojson, "map_drawn");

      const calculatedArea =
        areaUnit === "hectares"
          ? calculatePolygonAreaHectares(geojson)
          : calculatePolygonAreaAcres(geojson);

      onAreaChange(calculatedArea, areaUnit, "map_calculated");
      setDraftPoints([]);
      setActiveTool("idle");
      setIsEditingExisting(false);
    } catch (err: any) {
      alert("Failed to close polygon: " + err.message);
    }
  };

  // Clear boundary
  const handleClearBoundary = () => {
    setDraftPoints([]);
    setEditingPoints([]);
    setIsEditingExisting(false);
    onBoundaryChange(null, "unknown");
    onAreaChange(0, areaUnit, "unknown");
    setActiveTool("draw");
  };

  // Redraw boundary
  const handleRedraw = () => {
    handleClearBoundary();
    setActiveTool("draw");
  };

  // Switch Area Unit
  const handleUnitToggle = (newUnit: AreaUnit) => {
    if (newUnit === areaUnit) return;

    let convertedValue = areaValue;
    if (areaValue && areaValue > 0) {
      if (newUnit === "acres") {
        convertedValue = hectaresToAcres(areaValue);
      } else {
        convertedValue = acresToHectares(areaValue);
      }
    }
    onAreaChange(convertedValue || 0, newUnit, areaSource);
  };

  // Manual area input change
  const handleManualAreaChange = (valStr: string) => {
    setManualAreaInput(valStr);
    const parsed = parseFloat(valStr);
    if (!isNaN(parsed) && parsed > 0) {
      onAreaChange(parsed, areaUnit, "manual_entry");
    } else if (valStr.trim() === "") {
      // Revert to map calculated if polygon exists
      if (fieldBoundary && isValidGeoJSONPolygon(fieldBoundary)) {
        const calculatedArea =
          areaUnit === "hectares"
            ? calculatePolygonAreaHectares(fieldBoundary)
            : calculatePolygonAreaAcres(fieldBoundary);
        onAreaChange(calculatedArea, areaUnit, "map_calculated");
      } else {
        onAreaChange(0, areaUnit, "unknown");
      }
    }
  };

  // Quick jump to supported district
  const handleDistrictSelect = (districtId: string) => {
    const target = SUPPORTED_DISTRICTS.find((d) => d.id === districtId);
    if (target) {
      handleLocationSet(target.center[0], target.center[1]);
    }
  };

  // Device geolocation
  const handleUseMyLocation = () => {
    setGeoError(null);
    if (!navigator.geolocation) {
      setGeoError("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = Number(pos.coords.latitude.toFixed(6));
        const lng = Number(pos.coords.longitude.toFixed(6));
        handleLocationSet(lat, lng);
      },
      (err) => {
        setGeoError(`Unable to retrieve GPS location (${err.message}). Please tap the map.`);
      },
      { timeout: 8000 }
    );
  };

  // Coordinate or place search handler
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    // Check if query is "lat, lng" format
    const coordMatch = searchQuery.match(/^(-?\d+(\.\d+)?)[,\s]+(-?\d+(\.\d+)?)$/);
    if (coordMatch) {
      const lat = parseFloat(coordMatch[1]);
      const lng = parseFloat(coordMatch[3]);
      if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
        handleLocationSet(lat, lng);
        setSearchQuery("");
        return;
      }
    }

    // Name match with local districts
    const lower = searchQuery.toLowerCase();
    const match = SUPPORTED_DISTRICTS.find((d) => d.name.toLowerCase().includes(lower));
    if (match) {
      handleLocationSet(match.center[0], match.center[1]);
      setSearchQuery("");
    } else {
      setGeoError(`Location "${searchQuery}" not found in local index. Try entering "Lat, Long" coordinates.`);
    }
  };

  // Dynamic guidance message
  const guidanceMessage = useMemo(() => {
    if (latitude === null || longitude === null) {
      return "Tap the map to select your farm location.";
    }
    if (activeTool === "draw") {
      if (draftPoints.length === 0) {
        return "Tap points around your field boundary to create vertices.";
      }
      return `Tap points around your field (${draftPoints.length} added). Complete shape when done.`;
    }
    if (fieldBoundary && isValidGeoJSONPolygon(fieldBoundary)) {
      return "Field boundary saved. You can edit or redraw it anytime.";
    }
    return "Now draw your field boundary to calculate estimated area.";
  }, [latitude, longitude, activeTool, draftPoints.length, fieldBoundary]);

  if (!mounted || !customPin) {
    return (
      <div className="w-full h-80 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 text-sm border border-slate-200 animate-pulse">
        Initializing Leaflet geospatial engine...
      </div>
    );
  }

  // LatLngs for completed polygon
  const existingPolygonLatLngs =
    fieldBoundary && isValidGeoJSONPolygon(fieldBoundary)
      ? geoJSONPolygonToLeafletLatLngs(fieldBoundary)
      : [];

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search & Location Bar */}
      <div className="flex flex-col sm:flex-row gap-2 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search district or 'Lat, Lng'..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
        </form>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
          <div className="flex items-center gap-1 text-[11px] text-slate-600 font-semibold bg-slate-100 px-2 py-1 rounded-lg">
            <span>Quick Jump:</span>
            {SUPPORTED_DISTRICTS.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => handleDistrictSelect(d.id)}
                className="hover:text-blue-600 px-1 py-0.5 rounded transition"
              >
                {d.name}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleUseMyLocation}
            className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm transition"
          >
            <Navigation className="w-3.5 h-3.5 text-blue-600" />
            <span>Use My Location</span>
          </button>
        </div>
      </div>

      {geoError && (
        <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 px-3 py-2 rounded-xl flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>{geoError}</span>
        </div>
      )}

      {/* Map Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Card Header & Contextual Guidance */}
        <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-blue-600" />
              Select Farm Field & Boundary
            </h4>
            <p className="text-[11px] text-slate-500">
              Tap your farm location, then draw the field boundary to estimate its area.
            </p>
          </div>

          <div className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
            <span>{guidanceMessage}</span>
          </div>
        </div>

        {/* Leaflet Map Canvas */}
        <div className="relative w-full h-[360px] sm:h-[400px]">
          <MapContainer
            center={currentCenter}
            zoom={DEFAULT_ZOOM}
            style={{ width: "100%", height: "100%" }}
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapUpdater center={currentCenter} />
            <MapInteraction
              activeTool={activeTool}
              onLocationClick={handleLocationSet}
              onAddPoint={handleAddPoint}
            />

            {/* Farm Location Marker */}
            {latitude !== null && longitude !== null && (
              <Marker position={[latitude, longitude]} icon={customPin} />
            )}

            {/* Saved Field Boundary Polygon */}
            {existingPolygonLatLngs.length >= 4 && draftPoints.length === 0 && (
              <Polygon
                positions={existingPolygonLatLngs}
                pathOptions={{
                  color: "#166534",
                  fillColor: "#22c55e",
                  fillOpacity: 0.35,
                  weight: 2.5,
                }}
              />
            )}

            {/* In-progress Polygon Points & Line */}
            {draftPoints.length > 0 && (
              <>
                <Polyline
                  positions={draftPoints}
                  pathOptions={{
                    color: "#166534",
                    dashArray: "6, 6",
                    weight: 2,
                  }}
                />
                {draftPoints.map((pt, idx) => (
                  <CircleMarker
                    key={idx}
                    center={pt}
                    radius={5}
                    pathOptions={{
                      color: "#166534",
                      fillColor: idx === 0 ? "#eab308" : "#22c55e",
                      fillOpacity: 0.9,
                      weight: 2,
                    }}
                  />
                ))}
              </>
            )}
          </MapContainer>

          {/* Floating On-Map Toolbar */}
          <div className="absolute top-3 right-3 z-[1000] flex flex-col gap-1.5 bg-white/95 backdrop-blur-md p-1.5 rounded-xl border border-slate-200 shadow-md">
            <button
              type="button"
              onClick={() => setActiveTool("location")}
              className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                activeTool === "location"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "hover:bg-slate-100 text-slate-700"
              }`}
              title="Click map to place farm location marker"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Set Location</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTool("draw");
                setDraftPoints([]);
              }}
              className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                activeTool === "draw"
                  ? "bg-emerald-700 text-white shadow-sm"
                  : "hover:bg-slate-100 text-slate-700"
              }`}
              title="Click vertices to draw field boundary"
            >
              <PenTool className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Draw Field Boundary</span>
            </button>

            {draftPoints.length > 0 && (
              <>
                <button
                  type="button"
                  onClick={handleUndoPoint}
                  className="p-2 rounded-lg text-xs font-semibold hover:bg-slate-100 text-slate-700 flex items-center gap-1.5 transition"
                  title="Undo last added vertex"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
                  <span className="hidden sm:inline">Undo Point</span>
                </button>

                {draftPoints.length >= 3 && (
                  <button
                    type="button"
                    onClick={handleCompletePolygon}
                    className="p-2 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 shadow-sm transition"
                    title="Close polygon and calculate field area"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Complete Shape</span>
                  </button>
                )}
              </>
            )}

            {fieldBoundary && (
              <button
                type="button"
                onClick={handleRedraw}
                className="p-2 rounded-lg text-xs font-semibold hover:bg-red-50 text-red-600 flex items-center gap-1.5 transition"
                title="Clear current boundary and redraw"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clear Boundary</span>
              </button>
            )}
          </div>
        </div>

        {/* Required Scientific Map Note */}
        <div className="p-3 bg-amber-50/70 border-t border-amber-200/60 text-[11px] text-amber-800 flex items-start gap-2">
          <HelpCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <p>
            Draw your field boundary to estimate its area. This is an approximate map-based measurement, not an official land survey.
          </p>
        </div>
      </div>

      {/* Area Summary & Control Card */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Field Area
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-extrabold text-slate-900 font-mono">
                {areaValue !== null && areaValue > 0 ? areaValue.toFixed(2) : "--"}
              </span>
              <span className="text-sm font-semibold text-slate-600">{areaUnit}</span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1">
              {areaSource === "map_calculated" && (
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Calculated from drawn field boundary
                </span>
              )}
              {areaSource === "manual_entry" && (
                <span className="text-blue-700 font-semibold flex items-center gap-1">
                  <PenTool className="w-3.5 h-3.5" />
                  Manually entered area
                </span>
              )}
              {areaSource === "unknown" && "Draw your field boundary to calculate its area."}
            </p>
          </div>

          {/* Unit Switcher */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start sm:self-auto border border-slate-200">
            <button
              type="button"
              onClick={() => handleUnitToggle("acres")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                areaUnit === "acres"
                  ? "bg-white text-emerald-800 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Acres
            </button>
            <button
              type="button"
              onClick={() => handleUnitToggle("hectares")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                areaUnit === "hectares"
                  ? "bg-white text-emerald-800 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Hectares
            </button>
          </div>
        </div>

        {/* Optional Manual Area Override */}
        <div className="pt-3 border-t border-slate-100">
          <label htmlFor="manual-area-override" className="block text-xs font-semibold text-slate-700 mb-1">
            Manual area override (optional)
          </label>
          <div className="flex items-center gap-2 max-w-xs">
            <input
              id="manual-area-override"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="e.g. 5.00"
              value={manualAreaInput}
              onChange={(e) => handleManualAreaChange(e.target.value)}
              className="w-full text-xs font-mono px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-xs font-semibold text-slate-500">{areaUnit}</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Use only if your official land record differs from the map-based estimate.
          </p>
        </div>
      </div>

      <p className="text-[11px] text-slate-500 text-center font-medium">
        Selected point is a farm location marker, not a surveyed field boundary.
      </p>
    </div>
  );
}
