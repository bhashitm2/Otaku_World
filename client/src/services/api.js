// src/services/api.js
import axios from "axios";
import { auth } from "./firebaseClient";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Request interceptor to attach Firebase ID token
api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    try {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    } catch (error) {
      console.error("Error getting ID token:", error);
    }
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - could trigger logout
      console.error("Unauthorized request:", error);
    }
    return Promise.reject(error);
  }
);

export default api;
