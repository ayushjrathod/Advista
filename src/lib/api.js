import axios from "axios";

// Create axios instance with base URL from environment
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token =
      typeof localStorage !== "undefined"
        ? localStorage.getItem("token") || localStorage.getItem("access_token")
        : null;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear tokens and redirect to sign-in
      if (typeof localStorage !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("access_token");
      }
      window.location.href = "/sign-in";
    }
    return Promise.reject(error);
  }
);

export default api;
