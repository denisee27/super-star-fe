import { apiClient } from "../../../shared/services/apiClient.js";

export async function getDashboardStats({ startDate, endDate } = {}) {
  const params = {};
  if (startDate) params.startDate = startDate;
  if (endDate)   params.endDate   = endDate;
  const response = await apiClient.get("/api/v1/dashboard/stats", { params });
  return response.data.data;
}
