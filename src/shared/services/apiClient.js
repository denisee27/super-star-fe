import axios from "axios";
import { env } from "../../config/env.js";
import { silentRefresh } from "./tokenRefresh.js";

let _setAccessToken = null;

export function setTokenSetter(fn) {
  _setAccessToken = fn;
}

export const apiClient = axios.create({
  baseURL: env.API_BASE_URL,
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const token = window.__superstarAccessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newToken = await silentRefresh();
        window.__superstarAccessToken = newToken;
        if (_setAccessToken) _setAccessToken(newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch {
        window.__superstarAccessToken = null;
        if (_setAccessToken) _setAccessToken(null);
        window.location.href = "/admin/login";
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);
