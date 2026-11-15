import area from "@turf/area";
import { AreaUnit, GeoJSONPolygon } from "@/types/farm";

/**
 * 1 hectare = 2.47105 acres
 * 1 acre = 0.404686 hectares
 */
export const HECTARES_TO_ACRES_RATIO = 2.47105;
export const ACRES_TO_HECTARES_RATIO = 0.404686;

export function hectaresToAcres(hectares: number): number {
  if (isNaN(hectares) || hectares < 0) return 0;
  return Number((hectares * HECTARES_TO_ACRES_RATIO).toFixed(4));
}

export function acresToHectares(acres: number): number {
  if (isNaN(acres) || acres < 0) return 0;
  return Number((acres * ACRES_TO_HECTARES_RATIO).toFixed(4));
}

/**
 * Converts Leaflet LatLng coordinates [latitude, longitude] to GeoJSON Polygon [longitude, latitude].
 * Automatically closes the linear ring if needed.
 */
export function leafletLatLngToGeoJSONPolygon(
  latlngs: Array<{ lat: number; lng: number } | [number, number]>
): GeoJSONPolygon {
  if (!latlngs || latlngs.length < 3) {
    throw new Error("A polygon requires at least 3 distinct vertices.");
  }

  const coords: [number, number][] = latlngs.map((pt) => {
    if (Array.isArray(pt)) {
      return [Number(pt[1].toFixed(6)), Number(pt[0].toFixed(6))];
    }
    return [Number(pt.lng.toFixed(6)), Number(pt.lat.toFixed(6))];
  });

  // Ensure closure: first coordinate matches last coordinate
  const first = coords[0];
  const last = coords[coords.length - 1];
  if (first[0] !== last[0] || first[1] !== last[1]) {
    coords.push([first[0], first[1]]);
  }

  return {
    type: "Polygon",
    coordinates: [coords],
  };
}

/**
 * Converts GeoJSON Polygon [longitude, latitude] to Leaflet coordinates [latitude, longitude].
 */
export function geoJSONPolygonToLeafletLatLngs(
  polygon: GeoJSONPolygon
): [number, number][] {
  if (!isValidGeoJSONPolygon(polygon)) {
    return [];
  }
  const outerRing = polygon.coordinates[0];
  return outerRing.map((coord) => [coord[1], coord[0]]);
}

/**
 * Validates whether an object is a structurally valid GeoJSON Polygon.
 */
export function isValidGeoJSONPolygon(polygon: unknown): polygon is GeoJSONPolygon {
  if (!polygon || typeof polygon !== "object") return false;
  const poly = polygon as GeoJSONPolygon;
  if (poly.type !== "Polygon") return false;
  if (!Array.isArray(poly.coordinates) || poly.coordinates.length === 0) return false;

  const outerRing = poly.coordinates[0];
  if (!Array.isArray(outerRing) || outerRing.length < 4) return false;

  for (const pt of outerRing) {
    if (!Array.isArray(pt) || pt.length < 2) return false;
    const [lon, lat] = pt;
    if (typeof lon !== "number" || typeof lat !== "number" || isNaN(lon) || isNaN(lat)) return false;
    if (lon < -180 || lon > 180 || lat < -90 || lat > 90) return false;
  }

  // First and last coordinates must match
  const first = outerRing[0];
  const last = outerRing[outerRing.length - 1];
  const tolerance = 0.000001;
  if (
    Math.abs(first[0] - last[0]) > tolerance ||
    Math.abs(first[1] - last[1]) > tolerance
  ) {
    return false;
  }

  return true;
}

/**
 * Calculates polygon area in hectares using Turf area.
 */
export function calculatePolygonAreaHectares(polygon: GeoJSONPolygon): number {
  if (!isValidGeoJSONPolygon(polygon)) return 0;
  try {
    const sqMeters = area(polygon as any);
    if (isNaN(sqMeters) || sqMeters <= 0) return 0;
    const hectares = sqMeters / 10000;
    return Number(hectares.toFixed(4));
  } catch {
    return 0;
  }
}

/**
 * Calculates polygon area in acres using Turf area.
 */
export function calculatePolygonAreaAcres(polygon: GeoJSONPolygon): number {
  const hectares = calculatePolygonAreaHectares(polygon);
  return Number((hectares * HECTARES_TO_ACRES_RATIO).toFixed(4));
}

/**
 * Formats an area value into a judge-friendly display string.
 */
export function formatArea(areaValue: number | null, unit: AreaUnit): string {
  if (areaValue === null || areaValue === undefined || isNaN(areaValue) || areaValue <= 0) {
    return "Not calculated yet";
  }
  return `${areaValue.toFixed(2)} ${unit}`;
}
