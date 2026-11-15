import { apiFetch } from "./client";
import {
  RecommendationSet,
  ScenarioComparisonResponse,
  Priority,
  Scenario,
} from "@/types/recommendation";

export interface GenerateRecommendationPayload {
  farm_id: string;
  start_date?: string;
  end_date?: string;
  priority?: Priority;
  use_demo_fallback?: boolean;
}

export async function generateRecommendations(
  payload: GenerateRecommendationPayload
): Promise<RecommendationSet> {
  return apiFetch<RecommendationSet>("/api/v1/recommendations/generate", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getRecommendation(id: string): Promise<RecommendationSet> {
  return apiFetch<RecommendationSet>(`/api/v1/recommendations/${id}`);
}

export async function compareScenarios(payload: {
  recommendation_id?: string;
  scenarios?: Scenario[];
  scenario_ids?: string[];
}): Promise<ScenarioComparisonResponse> {
  return apiFetch<ScenarioComparisonResponse>("/api/v1/recommendations/compare", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
