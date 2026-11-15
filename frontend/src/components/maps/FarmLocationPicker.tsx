"use client";

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Polygon, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { GeoJSONPolygon } from "@/types/farm";
import { geoJSONPolygonToLeafletLatLngs, isValidGeoJSONPolygon } from "@/lib/geo/field-area";

// Custom SVG DivIcon to prevent broken default Leaflet marker icons
const createFarmIcon = () => {
  return L.divIcon({
    className: "custom-farm-pin",
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

interface LocationEventsProps {
  onLocationSelect?: (lat: number, lon: number) => void;
  readOnly?: boolean;
}

function LocationEvents({ onLocationSelect, readOnly }: LocationEventsProps) {
  useMapEvents({
    click(e) {
      if (!readOnly && onLocationSelect) {
        onLocationSelect(Number(e.latlng.lat.toFixed(4)), Number(e.latlng.lng.toFixed(4)));
      }
    },
  });
  return null;
}

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, map.getZoom());
  }, [center, map]);
  return null;
}

interface FarmLocationPickerProps {
  latitude: number;
  longitude: number;
  fieldBoundary?: GeoJSONPolygon | null;
  onChange?: (lat: number, lon: number) => void;
  height?: string;
  readOnly?: boolean;
}

export default function FarmLocationPicker({
  latitude,
  longitude,
  fieldBoundary,
  onChange,
  height = "320px",
  readOnly = false,
}: FarmLocationPickerProps) {
  const [mounted, setMounted] = useState(false);
  const farmIcon = React.useMemo(() => (typeof window !== "undefined" ? createFarmIcon() : null), []);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !farmIcon) {
    return (
      <div
        className="w-full bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 text-sm border border-slate-200"
        style={{ height }}
      >
        Loading map environment...
      </div>
    );
  }

  const validLat = !isNaN(latitude) && latitude >= -90 && latitude <= 90 ? latitude : 34.0151;
  const validLon = !isNaN(longitude) && longitude >= -180 && longitude <= 180 ? longitude : 71.5249;
  const center: [number, number] = [validLat, validLon];

  const polygonLatLngs =
    fieldBoundary && isValidGeoJSONPolygon(fieldBoundary)
      ? geoJSONPolygonToLeafletLatLngs(fieldBoundary)
      : [];

  return (
    <div className="flex flex-col space-y-2">
      <div className="relative rounded-lg overflow-hidden border border-slate-300 shadow-sm" style={{ height }}>
        <MapContainer
          center={center}
          zoom={13}
          style={{ width: "100%", height: "100%" }}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationEvents onLocationSelect={onChange} readOnly={readOnly} />
          <MapUpdater center={center} />
          <Marker position={center} icon={farmIcon} />

          {polygonLatLngs.length >= 4 && (
            <Polygon
              positions={polygonLatLngs}
              pathOptions={{
                color: "#166534",
                fillColor: "#22c55e",
                fillOpacity: 0.35,
                weight: 2.5,
              }}
            />
          )}
        </MapContainer>
      </div>

      <p className="text-xs text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-md text-center font-medium">
        {polygonLatLngs.length >= 4
          ? "Field boundary is approximate and based on the farmer-selected map area."
          : "Selected point is a farm location marker, not a surveyed field boundary."}
      </p>
    </div>
  );
}
