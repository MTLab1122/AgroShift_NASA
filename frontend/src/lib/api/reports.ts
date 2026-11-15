const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export async function downloadPdfReport(recommendationId: string, filename?: string): Promise<void> {
  const url = `${BASE_URL}/api/v1/reports/pdf`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ recommendation_id: recommendationId }),
  });

  if (!response.ok) {
    throw new Error(`Failed to generate PDF report: ${response.statusText}`);
  }

  const blob = await response.blob();
  const downloadUrl = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = downloadUrl;
  a.download = filename || `AgroShift_Report_${recommendationId.substring(0, 8)}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(downloadUrl);
}

export async function downloadClimateCsv(params: {
  farm_id?: string;
  latitude?: number;
  longitude?: number;
  start_date?: string;
  end_date?: string;
  use_demo_fallback?: boolean;
}): Promise<void> {
  const query = new URLSearchParams();
  if (params.farm_id) query.set("farm_id", params.farm_id);
  if (params.latitude !== undefined) query.set("latitude", params.latitude.toString());
  if (params.longitude !== undefined) query.set("longitude", params.longitude.toString());
  if (params.start_date) query.set("start_date", params.start_date);
  if (params.end_date) query.set("end_date", params.end_date);
  if (params.use_demo_fallback !== undefined) {
    query.set("use_demo_fallback", params.use_demo_fallback ? "true" : "false");
  }

  const url = `${BASE_URL}/api/v1/reports/climate-csv?${query.toString()}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download climate CSV: ${response.statusText}`);
  }

  const blob = await response.blob();
  const downloadUrl = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = downloadUrl;
  a.download = `AgroShift_Climate_Export.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(downloadUrl);
}
