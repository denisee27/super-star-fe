import { apiClient } from "../../../shared/services/apiClient.js";

export async function submitMcnInquiry(payload) {
  const response = await apiClient.post("/api/v1/inquiry/mcn", payload);
  return response.data.data;
}

export async function submitPasInquiry(payload) {
  const response = await apiClient.post("/api/v1/inquiry/pas", payload);
  return response.data.data;
}

export async function submitBrandInquiry(payload) {
  const response = await apiClient.post("/api/v1/inquiry/brand", payload);
  return response.data.data;
}
