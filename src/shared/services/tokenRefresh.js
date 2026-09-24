import axios from "axios";
import { env } from "../../config/env.js";

let isRefreshing = false;
let failedQueue = [];

function processQueue(error, token = null) {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
}

export async function silentRefresh() {
  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      failedQueue.push({ resolve, reject });
    });
  }

  isRefreshing = true;
  try {
    const response = await axios.post(
      `${env.API_BASE_URL}/api/v1/admin/refresh`,
      {},
      { withCredentials: true }
    );
    const { accessToken } = response.data.data;
    processQueue(null, accessToken);
    return accessToken;
  } catch (error) {
    processQueue(error, null);
    throw error;
  } finally {
    isRefreshing = false;
  }
}
