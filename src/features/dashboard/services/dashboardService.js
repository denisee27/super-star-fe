import { apiClient } from "../../../shared/services/apiClient.js";

export async function getDashboardStats() {
  const response = await apiClient.get("/api/v1/dashboard/stats");
  return response.data.data;
}
