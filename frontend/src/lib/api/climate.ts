import { apiFetch } from "./client";
import { ClimateSummary, ClimateHistory } from "@/types/climate";

export interface ClimateQueryParams {
  farm_id?: string;
  latitude?: number;
  longitude?: number;
  start_date?: string;
  end_date?: string;
  use_demo_fallback?: boolean;
}

function buildQuery(params: ClimateQueryParams): string {
  const query = new URLSearchParams();
  if (params.farm_id) query.set("farm_id", params.farm_id);
  if (params.latitude !== undefined) query.set("latitude", params.latitude.toString());
  if (params.longitude !== undefined) query.set("longitude", params.longitude.toString());
  if (params.start_date) query.set("start_date", params.start_date);
  if (params.end_date) query.set("end_date", params.end_date);
  if (params.use_demo_fallback !== undefined) {
    query.set("use_demo_fallback", params.use_demo_fallback ? "true" : "false");
  }
  const qStr = query.toString();
  return qStr ? `?${qStr}` : "";
}

export async function getClimateSummary(params: ClimateQueryParams): Promise<ClimateSummary> {
  return apiFetch<ClimateSummary>(`/api/v1/climate/summary${buildQuery(params)}`);
}

export async function getClimateHistory(params: ClimateQueryParams): Promise<ClimateHistory> {
  return apiFetch<ClimateHistory>(`/api/v1/climate/history${buildQuery(params)}`);
}
