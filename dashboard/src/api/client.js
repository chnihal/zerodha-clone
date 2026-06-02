import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "https://zerodha-backend-s52h.onrender.com",
  withCredentials: true,
});

export default api;
