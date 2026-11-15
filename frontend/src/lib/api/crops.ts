import { apiFetch } from "./client";
import { CropCatalogItem } from "@/types/recommendation";

export async function getCrops(): Promise<CropCatalogItem[]> {
  return apiFetch<CropCatalogItem[]>("/api/v1/crops");
}

export async function getCrop(cropId: string): Promise<CropCatalogItem> {
  return apiFetch<CropCatalogItem>(`/api/v1/crops/${cropId}`);
}
