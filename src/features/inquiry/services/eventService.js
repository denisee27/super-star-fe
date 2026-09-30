import { apiClient } from "../../../shared/services/apiClient.js";

export async function getActiveEvents() {
  try {
    const res = await apiClient.get("/api/v1/events");
    return res.data.data ?? [];
  } catch {
    return [];
  }
}
