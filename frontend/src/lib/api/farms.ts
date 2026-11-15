import { apiFetch } from "./client";
import {
  FarmProfile,
  FarmCreatePayload,
  FarmUpdatePayload,
  CropHistoryEntry,
  CropHistoryCreatePayload,
} from "@/types/farm";

export async function getFarms(): Promise<FarmProfile[]> {
  return apiFetch<FarmProfile[]>("/api/v1/farms");
}

export async function getFarm(farmId: string): Promise<FarmProfile> {
  return apiFetch<FarmProfile>(`/api/v1/farms/${farmId}`);
}

export async function createFarm(payload: FarmCreatePayload): Promise<FarmProfile> {
  return apiFetch<FarmProfile>("/api/v1/farms", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateFarm(farmId: string, payload: FarmUpdatePayload): Promise<FarmProfile> {
  return apiFetch<FarmProfile>(`/api/v1/farms/${farmId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteFarm(farmId: string): Promise<{ status: string; message: string }> {
  return apiFetch<{ status: string; message: string }>(`/api/v1/farms/${farmId}`, {
    method: "DELETE",
  });
}

// --- Crop History ---

export async function getCropHistory(farmId: string): Promise<CropHistoryEntry[]> {
  return apiFetch<CropHistoryEntry[]>(`/api/v1/farms/${farmId}/crop-history`);
}

export async function createCropHistory(
  farmId: string,
  payload: CropHistoryCreatePayload
): Promise<CropHistoryEntry> {
  return apiFetch<CropHistoryEntry>(`/api/v1/farms/${farmId}/crop-history`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function deleteCropHistory(
  farmId: string,
  entryId: string
): Promise<{ status: string; message: string }> {
  return apiFetch<{ status: string; message: string }>(
    `/api/v1/farms/${farmId}/crop-history/${entryId}`,
    {
      method: "DELETE",
    }
  );
}
