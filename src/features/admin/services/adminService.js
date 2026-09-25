import { apiClient } from "../../../shared/services/apiClient.js";

export async function login(email, password) {
  const response = await apiClient.post("/api/v1/admin/login", { email, password });
  return response.data.data;
}

export async function verifyLoginOtp(email, code) {
  const response = await apiClient.post("/api/v1/admin/login/verify", { email, code });
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

// User management (super admin only)
export async function listAdmins({ page = 1, limit = 10, search } = {}) {
  const params = new URLSearchParams({ page, limit });
  if (search) params.append("search", search);
  const response = await apiClient.get(`/api/v1/admin/users?${params}`);
  return response.data;
}

export async function createAdmin({ email, name, password }) {
  const response = await apiClient.post("/api/v1/admin/users", { email, name, password });
  return response.data.data;
}

export async function updateAdmin(id, { name, email }) {
  const response = await apiClient.patch(`/api/v1/admin/users/${id}`, { name, email });
  return response.data.data;
}

export async function resetAdminPassword(id, password) {
  await apiClient.post(`/api/v1/admin/users/${id}/reset-password`, { password });
}

export async function deleteAdmin(id) {
  await apiClient.delete(`/api/v1/admin/users/${id}`);
}

// Audit logs (super admin only)
export async function getLogs({ page = 1, limit = 20, action, resource, adminId, search } = {}) {
  const params = new URLSearchParams({ page, limit });
  if (action) params.append("action", action);
  if (resource) params.append("resource", resource);
  if (adminId) params.append("adminId", adminId);
  if (search) params.append("search", search);
  const response = await apiClient.get(`/api/v1/admin/logs?${params}`);
  return response.data;
}
