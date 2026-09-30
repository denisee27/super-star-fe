import { apiClient } from "../../../shared/services/apiClient.js";

export async function getAllEvents() {
  const res = await apiClient.get("/api/v1/events/all");
  return res.data.data ?? [];
}

export async function createEvent(data) {
  const res = await apiClient.post("/api/v1/events", data);
  return res.data.data;
}

export async function updateEvent(id, data) {
  const res = await apiClient.patch(`/api/v1/events/${id}`, data);
  return res.data.data;
}

export async function deleteEvent(id) {
  await apiClient.delete(`/api/v1/events/${id}`);
}
