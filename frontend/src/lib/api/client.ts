import { ApiError } from "@/types/error";
import {
  MOCK_CROPS,
  MOCK_FARMS,
  MOCK_CLIMATE_SUMMARY,
  MOCK_EARTH_OBSERVATION,
  MOCK_RECOMMENDATION,
} from "./mockData";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

function getLocalFarms(): any[] {
  if (typeof window === "undefined") return MOCK_FARMS;
  try {
    const stored = localStorage.getItem("agroshift_farms");
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return MOCK_FARMS;
}

function saveLocalFarms(farms: any[]) {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("agroshift_farms", JSON.stringify(farms));
    } catch {}
  }
}

function getFallbackResponse<T>(endpoint: string, options: RequestInit = {}): T {
  const method = (options.method || "GET").toUpperCase();
  const cleanEndpoint = endpoint.split("?")[0];

  // Crops catalog
  if (cleanEndpoint.startsWith("/api/v1/crops")) {
    const parts = cleanEndpoint.split("/").filter(Boolean);
    if (parts.length === 4) {
      const cropId = parts[3];
      const match = MOCK_CROPS.find((c: any) => c.crop_id === cropId);
      return (match || MOCK_CROPS[0]) as unknown as T;
    }
    return MOCK_CROPS as unknown as T;
  }

  // Farms
  if (cleanEndpoint.startsWith("/api/v1/farms")) {
    const parts = cleanEndpoint.split("/").filter(Boolean);
    const farms = getLocalFarms();

    // GET /api/v1/farms
    if (parts.length === 3 && method === "GET") {
      return farms as unknown as T;
    }

    // POST /api/v1/farms
    if (parts.length === 3 && method === "POST") {
      let body: any = {};
      try {
        body = typeof options.body === "string" ? JSON.parse(options.body) : {};
      } catch {}
      const newFarm = {
        farm_id: `farm-${Date.now()}`,
        name: body.name || "Peshawar Valley Parcel",
        latitude: body.latitude || 34.0151,
        longitude: body.longitude || 71.5249,
        area_value: body.area_value || 5.0,
        area_unit: body.area_unit || "acres",
        soil_type: body.soil_type || "loamy",
        irrigation_type: body.irrigation_type || "tube_well",
        water_availability: body.water_availability || "medium",
        field_boundary: body.field_boundary || null,
        is_demo_data: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        crop_history: [
          {
            entry_id: `hist-${Date.now()}`,
            crop_name: body.current_crop || "Wheat (Gandum)",
            season: "rabi",
            start_date: "2025-11-15",
            end_date: "2026-04-20",
            notes: "Initial registered crop from farmer onboarding.",
            is_demo_data: true,
            created_at: new Date().toISOString(),
          },
        ],
      };
      const updated = [newFarm, ...farms];
      saveLocalFarms(updated);
      return newFarm as unknown as T;
    }

    // /api/v1/farms/:farmId
    if (parts.length === 4) {
      const farmId = parts[3];
      const match = farms.find((f: any) => f.farm_id === farmId) || farms[0];
      if (method === "DELETE") {
        const filtered = farms.filter((f: any) => f.farm_id !== farmId);
        saveLocalFarms(filtered);
        return { status: "success", message: "Farm deleted" } as unknown as T;
      }
      return match as unknown as T;
    }

    // /api/v1/farms/:farmId/crop-history
    if (cleanEndpoint.includes("/crop-history")) {
      return (MOCK_FARMS[0].crop_history || []) as unknown as T;
    }
  }

  // Climate
  if (cleanEndpoint.startsWith("/api/v1/climate")) {
    return MOCK_CLIMATE_SUMMARY as unknown as T;
  }

  // Earth observation
  if (cleanEndpoint.startsWith("/api/v1/earth-observation")) {
    return MOCK_EARTH_OBSERVATION as unknown as T;
  }

  // Recommendations & Scenarios
  if (cleanEndpoint.startsWith("/api/v1/scenarios") || cleanEndpoint.startsWith("/api/v1/recommendations")) {
    return MOCK_RECOMMENDATION as unknown as T;
  }

  // Voice parsing
  if (cleanEndpoint.startsWith("/api/v1/voice/parse")) {
    return {
      recognized_text: "wheat save water",
      matched_crops: ["wheat"],
      matched_goals: ["water_saving"],
      matched_irrigation: ["tube_well"],
      confidence: 0.95,
      suggested_actions: ["Select Wheat as current crop", "Prioritize Water Saving goal"],
    } as unknown as T;
  }

  // Reports CSV
  if (cleanEndpoint.startsWith("/api/v1/reports/csv")) {
    const csvStr =
      "DATE,T2M_MAX,T2M_MIN,PRECTOTCORR,RH2M,ALLSKY_SFC_SW_DWN,SMAP_ROOTZONE_SM,GPM_PRECIP,MODIS_NDVI\n2026-11-01,28.4,14.2,0.0,48.2,18.4,22.1,0.0,0.24\n2026-11-02,29.1,13.8,0.0,46.1,18.9,21.4,0.0,0.23\n2026-11-03,27.8,14.0,0.0,49.5,17.8,20.8,0.0,0.22\n";
    return new Blob([csvStr], { type: "text/csv" }) as unknown as T;
  }

  // Reports PDF
  if (cleanEndpoint.startsWith("/api/v1/reports/pdf")) {
    return new Blob(["%PDF-1.4 Mock Report"], { type: "application/pdf" }) as unknown as T;
  }

  return {} as unknown as T;
}

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;

  const headers = new Headers(options.headers || {});
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    if (!res.ok) {
      // In offline/static hosting mode, provide graceful mock fallback
      try {
        return getFallbackResponse<T>(endpoint, options);
      } catch {
        let errorData: ApiError;
        try {
          errorData = await res.json();
        } catch {
          errorData = {
            error_code: `HTTP_${res.status}`,
            message: res.statusText || "An unexpected HTTP error occurred",
            details: null,
            request_id: null,
          };
        }
        throw errorData;
      }
    }

    // Check for blob or json
    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return (await res.json()) as T;
    }
    return (await res.blob()) as unknown as T;
  } catch (err: any) {
    // If network fails (e.g. static hosting on GitHub Pages), provide graceful mock fallback
    try {
      return getFallbackResponse<T>(endpoint, options);
    } catch {
      if (err.error_code) {
        throw err;
      }
      throw {
        error_code: "NETWORK_ERROR",
        message: err.message || "Unable to communicate with the AgroShift API server.",
        details: null,
        request_id: null,
      } as ApiError;
    }
  }
}

export const apiClient = {
  get: async <T>(endpoint: string, options?: RequestInit): Promise<{ data: T }> => {
    const data = await apiFetch<T>(endpoint, { method: "GET", ...options });
    return { data };
  },
  post: async <T>(endpoint: string, body?: any, options?: RequestInit): Promise<{ data: T }> => {
    const data = await apiFetch<T>(endpoint, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    });
    return { data };
  },
  put: async <T>(endpoint: string, body?: any, options?: RequestInit): Promise<{ data: T }> => {
    const data = await apiFetch<T>(endpoint, {
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    });
    return { data };
  },
  delete: async <T>(endpoint: string, options?: RequestInit): Promise<{ data: T }> => {
    const data = await apiFetch<T>(endpoint, { method: "DELETE", ...options });
    return { data };
  },
};
