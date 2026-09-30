import { apiClient } from "./apiClient.js";

export async function getProvinces() {
  try {
    const res = await apiClient.get("/api/v1/regions/provinces");
    return res.data.data ?? [];
  } catch {
    return [];
  }
}

export async function getRegencies(provinceId) {
  try {
    const res = await apiClient.get(`/api/v1/regions/regencies?provinceId=${provinceId}`);
    return res.data.data ?? [];
  } catch {
    return [];
  }
}
