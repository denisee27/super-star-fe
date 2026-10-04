import axios from "axios";

const base = `${import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080"}/api/v1/otp`;

export async function sendOtp(phone) {
  const res = await axios.post(`${base}/send`, { phone });
  return res.data;
}

export async function verifyOtp(phone, code) {
  const res = await axios.post(`${base}/verify`, { phone, code });
  return res.data;
}
