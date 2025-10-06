// src/services/api.js
import axios from "axios";
import { auth } from "./firebaseClient";

// Create API instance with backend URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 30000, // 30 second timeout
  headers: {
    "Content-Type": "application/json",
  },
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
    } else if (error.response?.status === 429) {
      console.warn("Rate limit exceeded:", error.response.data);
    }
    return Promise.reject(error);
  }
);

// API service methods
export const apiService = {
  // Authentication
  auth: {
    verify: () => api.post("/auth/verify"),
    sync: (userData) => api.post("/auth/sync", userData),
    getProfile: () => api.get("/auth/profile"),
    updateProfile: (data) => api.put("/auth/profile", data),
    getMe: () => api.get("/auth/me"),
    refresh: () => api.post("/auth/refresh"),
    signout: () => api.post("/auth/signout"),
    deleteAccount: () => api.delete("/auth/account"),
  },

  // Anime
  anime: {
    getTrending: (params) => api.get("/anime/trending", { params }),
    getTop: (params) => api.get("/anime/top", { params }),
    search: (params) => api.get("/anime/search", { params }),
    getDetails: (id) => api.get(`/anime/${id}`),
    getCharacters: (id) => api.get(`/anime/${id}/characters`),
    getEpisodes: (id) => api.get(`/anime/${id}/episodes`),
    getReviews: (id) => api.get(`/anime/${id}/reviews`),
    getRecommendations: (id) => api.get(`/anime/${id}/recommendations`),
    getGenres: () => api.get("/anime/genres"),
    getByGenre: (genreId, params) =>
      api.get(`/anime/genre/${genreId}`, { params }),
    getRandom: () => api.get("/anime/random"),
    getSeasonal: (params) => api.get("/anime/seasonal", { params }),
  },

  // Manga API removed - functionality temporarily disabled

  // Characters
  characters: {
    search: (params) => api.get("/characters/search", { params }),
    getTop: (params) => api.get("/characters/top", { params }),
    getDetails: (id) => api.get(`/characters/${id}`),
    getAnime: (id) => api.get(`/characters/${id}/anime`),
    getManga: (id) => api.get(`/characters/${id}/manga`),
    getPictures: (id) => api.get(`/characters/${id}/pictures`),
    getRandom: () => api.get("/characters/random"),
  },

  // Users
  users: {
    getProfile: () => api.get("/users/profile"),
    updateProfile: (data) => api.put("/users/profile", data),
    getStats: () => api.get("/users/stats"),
    getActivity: () => api.get("/users/activity"),
    getPreferences: () => api.get("/users/preferences"),
    updatePreferences: (data) => api.put("/users/preferences", data),
    deleteAccount: () => api.delete("/users/account"),
  },

  // Favorites
  favorites: {
    get: (params) => api.get("/favorites", { params }),
    add: (data) => api.post("/favorites", data),
    remove: (type, itemId) => api.delete(`/favorites/${type}/${itemId}`),
    update: (type, itemId, data) =>
      api.put(`/favorites/${type}/${itemId}`, data),
    check: (type, itemId) => api.get(`/favorites/${type}/${itemId}/check`),
  },

  // Watchlist
  watchlist: {
    get: (params) => api.get("/watchlist", { params }),
    add: (data) => api.post("/watchlist", data),
    remove: (type, itemId) => api.delete(`/watchlist/${type}/${itemId}`),
    update: (type, itemId, data) =>
      api.put(`/watchlist/${type}/${itemId}`, data),
    check: (type, itemId) => api.get(`/watchlist/${type}/${itemId}/check`),
  },

  // Utility
  cache: {
    getStats: () => api.get("/cache/stats"),
  },

  health: () =>
    api.get("/health", {
      baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
    }),
};

export default api;
