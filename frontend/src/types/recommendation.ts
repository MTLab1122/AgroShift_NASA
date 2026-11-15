export type Priority = "balanced" | "water_efficiency" | "crop_diversity" | "soil_cover";

export interface ScoreWeights {
  water_fit: number;
  climate_suitability: number;
  soil_health_diversity: number;
}

export interface ScoreBreakdown {
  water_fit: number | null;
  climate_suitability: number | null;
  soil_health_diversity: number | null;
  weights: ScoreWeights;
}

export interface CalendarEntry {
  season: string;
  crop: string;
  window: string;
  water_notes: string;
}

export interface Scenario {
  scenario_id: "baseline" | "pulse_inclusive" | "soil_cover";
  title: string;
  description: string;
  score: number | null;
  score_breakdown: ScoreBreakdown;
  crop_sequence: string[];
  seasonal_calendar: CalendarEntry[];
  rationale: string[];
  benefits: string[];
  risks: string[];
  assumptions: string[];
  evidence_status: "documented" | "tentative";
}

export interface RecommendationSet {
  recommendation_id: string;
  farm_id: string;
  generated_at: string;
  priority: Priority;
  is_demo_data: boolean;
  scenarios: Scenario[];
  climate_context?: any | null;
  limitations: string[];
  general_assumptions: string[];
}

export interface CropCatalogItem {
  crop_id: string;
  name: string;
  category: "cereal" | "pulse" | "oilseed" | "cash_crop" | "forage_cover";
  is_legume: boolean;
  seasons: string[];
  duration_days: number;
  water_demand: "low" | "medium" | "high";
  suitable_soils: string[];
  incompatible_predecessors: string[];
  evidence_note: string;
  evidence_status: "documented" | "tentative";
}

export interface ScenarioComparisonResponse {
  scenarios: Scenario[];
  summary_notes: string[];
  tradeoffs: Record<string, string>;
}
