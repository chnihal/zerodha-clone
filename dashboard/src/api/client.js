import axios from "axios";

const defaultApiBaseUrl =
  process.env.NODE_ENV === "production"
    ? "https://zerodha-backend-s52h.onrender.com"
    : "http://localhost:3002";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || defaultApiBaseUrl,
  withCredentials: true,
});

const TOKEN_STORAGE_KEY = "zerodhaAuthToken";

const persistTokenFromUrl = () => {
  const url = new URL(window.location.href);
  const token = url.searchParams.get("authToken");

  if (!token) {
    return;
  }

  window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
  url.searchParams.delete("authToken");
  window.history.replaceState({}, document.title, `${url.pathname}${url.search}${url.hash}`);
};

persistTokenFromUrl();

api.interceptors.request.use((config) => {
  const token = window.localStorage.getItem(TOKEN_STORAGE_KEY);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
