import axios from "axios";

const defaultApiBaseUrl =
  process.env.NODE_ENV === "production"
    ? "https://zerodha-backend-s52h.onrender.com"
    : "http://localhost:3002";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || defaultApiBaseUrl,
  withCredentials: true,
});

export default api;
