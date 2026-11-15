export type AreaUnit = "acres" | "hectares";

export type FieldBoundarySource =
  | "map_drawn"
  | "manual_entry"
  | "unknown";

export type AreaSource =
  | "map_calculated"
  | "manual_entry"
  | "unknown";

export type GeoJSONPolygon = {
  type: "Polygon";
  coordinates: number[][][];
};

export type FarmFieldMapValue = {
  latitude: number;
  longitude: number;
  fieldBoundary: GeoJSONPolygon | null;
  fieldBoundarySource: FieldBoundarySource;
  areaValue: number | null;
  areaUnit: AreaUnit;
  areaSource: AreaSource;
};

export type SoilType = "clay" | "sandy" | "loamy" | "other" | "unknown";
export type IrrigationType = "canal" | "tube_well" | "rain_fed" | "other" | "unknown";
export type WaterAvailability = "low" | "medium" | "high" | "unknown";
export type Season = "rabi" | "kharif" | "zaid" | "annual" | "unknown";

export interface CropHistoryEntry {
  entry_id: string;
  farm_id: string;
  crop_name: string;
  season: Season;
  start_date?: string | null;
  end_date?: string | null;
  notes?: string | null;
  is_demo_data: boolean;
  created_at: string;
}

export interface FarmProfile {
  farm_id: string;
  name: string;
  latitude: number;
  longitude: number;
  area_value: number;
  area_unit: AreaUnit;
  soil_type: SoilType;
  irrigation_type: IrrigationType;
  water_availability: WaterAvailability;
  field_boundary?: GeoJSONPolygon | null;
  field_boundary_source?: FieldBoundarySource;
  area_source?: AreaSource;
  is_demo_data: boolean;
  crop_history?: CropHistoryEntry[];
  created_at: string;
  updated_at: string;
}

export interface FarmCreatePayload {
  name: string;
  latitude: number;
  longitude: number;
  area_value: number;
  area_unit: AreaUnit;
  soil_type: SoilType;
  irrigation_type: IrrigationType;
  water_availability: WaterAvailability;
  field_boundary?: GeoJSONPolygon | null;
  field_boundary_source?: FieldBoundarySource;
  area_source?: AreaSource;
}

export interface FarmUpdatePayload {
  name?: string;
  latitude?: number;
  longitude?: number;
  area_value?: number;
  area_unit?: AreaUnit;
  soil_type?: SoilType;
  irrigation_type?: IrrigationType;
  water_availability?: WaterAvailability;
  field_boundary?: GeoJSONPolygon | null;
  field_boundary_source?: FieldBoundarySource;
  area_source?: AreaSource;
}

export interface CropHistoryCreatePayload {
  crop_name: string;
  season: Season;
  start_date?: string | null;
  end_date?: string | null;
  notes?: string | null;
}
