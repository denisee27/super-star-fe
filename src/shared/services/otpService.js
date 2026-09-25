import axios from "axios";
import { env } from "../../config/env.js";

const base = `${env.API_BASE_URL}/api/v1/otp`;

export async function sendOtp(email) {
  const res = await axios.post(`${base}/send`, { email });
  return res.data;
}

export async function verifyOtp(email, code) {
  const res = await axios.post(`${base}/verify`, { email, code });
  return res.data;
}
