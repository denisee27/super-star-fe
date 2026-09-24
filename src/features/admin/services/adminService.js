import { apiClient } from "../../../shared/services/apiClient.js";

export async function login(email, password) {
  const response = await apiClient.post("/api/v1/admin/login", { email, password });
  return response.data.data;
}

export async function logout() {
  await apiClient.post("/api/v1/admin/logout");
}

export async function getInquiries(filters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => { if (v) params.append(k, v); });
  const response = await apiClient.get(`/api/v1/inquiry?${params}`);
  return response.data;
}

export async function getInquiryById(id) {
  const response = await apiClient.get(`/api/v1/inquiry/${id}`);
  return response.data.data;
}

export async function updateInquiryStatus(id, status, notes) {
  const response = await apiClient.patch(`/api/v1/inquiry/${id}/status`, { status, notes });
  return response.data.data;
}

export async function exportInquiries(filters = {}) {
  const params = new URLSearchParams();
  // Exclude `page` — export always fetches all matching records, not a single page
  const { page: _page, ...exportFilters } = filters;
  Object.entries(exportFilters).forEach(([k, v]) => { if (v) params.append(k, v); });
  const response = await apiClient.get(`/api/v1/export/inquiries?${params}`, { responseType: "blob" });
  const url = URL.createObjectURL(response.data);
  const a = document.createElement("a");
  a.href = url;
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  a.download = `superstar-inquiries-${date}.xlsx`;
  a.click();
  URL.revokeObjectURL(url);
}
