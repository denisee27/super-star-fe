import { apiClient } from "../../../shared/services/apiClient.js";

export async function getBrandWaConfig() {
  const response = await apiClient.get("/api/v1/settings/brand-wa");
  return response.data.data;
}

export async function updateSettings(payload) {
  const response = await apiClient.patch("/api/v1/settings", payload);
  return response.data.data;
}
