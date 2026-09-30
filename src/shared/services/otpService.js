import axios from "axios";
import { env } from "../../config/env.js";

const base = `${env.API_BASE_URL}/api/v1/otp`;

export async function sendOtp(phone) {
  const res = await axios.post(`${base}/send`, { phone });
  return res.data;
}

export async function verifyOtp(phone, code) {
  const res = await axios.post(`${base}/verify`, { phone, code });
  return res.data;
}
