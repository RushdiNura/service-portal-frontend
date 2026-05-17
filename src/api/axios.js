import axios from "axios";
import toast from "react-hot-toast";

// const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const api = axios.create({
  baseURL: "https://service-portal-backend-2.onrender.com/api",
  // baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === "ECONNABORTED") {
      toast.error("Request timeout. Server might be down.");
      return Promise.reject(error);
    }

    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 400:
          // Don't show toast for login errors - handle in component
          if (!error.config.url.includes("/auth/login")) {
            toast.error(data.message || "Bad request");
          }
          break;
        case 401:
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/login";
          toast.error("Session expired");
          break;
        case 403:
          toast.error("Access denied");
          break;
        case 404:
          toast.error(data.message || "Not found");
          break;
        case 500:
          toast.error("Server error. Please try again.");
          break;
        default:
          if (!error.config.url.includes("/auth/login")) {
            toast.error(data.message || "Something went wrong");
          }
      }
    } else if (error.request) {
      toast.error("Network error. Check your connection.");
    }

    return Promise.reject(error);
  },
);

export default api;
