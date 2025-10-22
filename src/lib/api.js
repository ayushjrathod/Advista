import axios from "axios";

// Get API URL from environment or use default
const getApiUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) return envUrl;
};

// Create axios instance with base URL from environment
const api = axios.create({
  baseURL: getApiUrl(),
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Enable credentials for CORS
});

// No interceptors needed - cookies are handled automatically by the browser

// Logout function
export const logout = async () => {
  try {
    await api.post("/api/v1/auth/logout");
    // Redirect to sign-in page
    window.location.href = "/sign-in";
  } catch (error) {
    console.error("Logout error:", error);
    // Still redirect even if logout fails
    window.location.href = "/sign-in";
  }
};

export default api;
