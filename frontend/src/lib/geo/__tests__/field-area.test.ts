import { test, expect } from "@playwright/test";
import {
  leafletLatLngToGeoJSONPolygon,
  geoJSONPolygonToLeafletLatLngs,
  calculatePolygonAreaHectares,
  calculatePolygonAreaAcres,
  hectaresToAcres,
  acresToHectares,
  isValidGeoJSONPolygon,
  formatArea,
} from "../field-area";
import { GeoJSONPolygon } from "@/types/farm";

test.describe("Field Area & Geospatial Utilities", () => {
  const sampleLeafletCoords: [number, number][] = [
    [34.015, 71.524],
    [34.015, 71.534],
    [34.025, 71.534],
    [34.025, 71.524],
  ];

  const sampleGeoJSONPolygon: GeoJSONPolygon = {
    type: "Polygon",
    coordinates: [
      [
        [71.524, 34.015],
        [71.534, 34.015],
        [71.534, 34.025],
        [71.524, 34.025],
        [71.524, 34.015],
      ],
    ],
  };

  test("converts Leaflet LatLng to GeoJSON Polygon with proper closure", () => {
    const polygon = leafletLatLngToGeoJSONPolygon(sampleLeafletCoords);
    expect(polygon.type).toBe("Polygon");
    expect(polygon.coordinates[0].length).toBe(5);
    expect(polygon.coordinates[0][0]).toEqual(polygon.coordinates[0][4]);
    // Longitude first in GeoJSON
    expect(polygon.coordinates[0][0][0]).toBeCloseTo(71.524, 3);
    expect(polygon.coordinates[0][0][1]).toBeCloseTo(34.015, 3);
  });

  test("converts GeoJSON Polygon to Leaflet LatLngs with latitude first", () => {
    const leafletCoords = geoJSONPolygonToLeafletLatLngs(sampleGeoJSONPolygon);
    expect(leafletCoords.length).toBe(5);
    // Latitude first in Leaflet
    expect(leafletCoords[0][0]).toBe(34.015);
    expect(leafletCoords[0][1]).toBe(71.524);
  });

  test("calculates polygon area in hectares and acres correctly", () => {
    const hectares = calculatePolygonAreaHectares(sampleGeoJSONPolygon);
    expect(hectares).toBeGreaterThan(0);

    const acres = calculatePolygonAreaAcres(sampleGeoJSONPolygon);
    expect(acres).toBeGreaterThan(hectares); // 1 ha ~ 2.47 acres
    expect(acres).toBeCloseTo(hectares * 2.47105, 1);
  });

  test("converts between hectares and acres accurately", () => {
    const ha = 10;
    const ac = hectaresToAcres(ha);
    expect(ac).toBeCloseTo(24.71, 1);

    const backToHa = acresToHectares(ac);
    expect(backToHa).toBeCloseTo(10, 1);
  });

  test("detects invalid polygons", () => {
    expect(isValidGeoJSONPolygon(null)).toBe(false);
    expect(isValidGeoJSONPolygon({})).toBe(false);
    expect(isValidGeoJSONPolygon({ type: "Point", coordinates: [71.5, 34.0] })).toBe(false);
    // Unclosed polygon
    expect(
      isValidGeoJSONPolygon({
        type: "Polygon",
        coordinates: [
          [
            [71.5, 34.0],
            [71.6, 34.0],
            [71.6, 34.1],
          ],
        ],
      })
    ).toBe(false);
  });

  test("formats area correctly", () => {
    expect(formatArea(5.245, "acres")).toBe("5.25 acres");
    expect(formatArea(2.101, "hectares")).toBe("2.10 hectares");
    expect(formatArea(null, "acres")).toBe("Not calculated yet");
    expect(formatArea(0, "hectares")).toBe("Not calculated yet");
  });
});
