// src/context/FavoritesContext.jsx
import React, { createContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "../hooks/useAuth";
import {
  addToFavorites,
  removeFromFavorites,
  getFavorites,
} from "../services/firestoreService";

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadFavorites = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const result = await getFavorites(user.uid);
      if (result.success) {
        setFavorites(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Failed to load favorites");
      console.error("Error loading favorites:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Load user's favorites when they log in
  useEffect(() => {
    if (user) {
      loadFavorites();
    } else {
      // Clear favorites when user logs out
      setFavorites([]);
      setError(null);
    }
  }, [user, loadFavorites]);

  const addFavorite = async (item) => {
    if (!user) {
      setError("You must be logged in to add favorites");
      return { success: false, error: "User not authenticated" };
    }

    setLoading(true);
    setError(null);

    try {
      const result = await addToFavorites(user.uid, item);
      if (result.success) {
        // Add to local state immediately for better UX
        setFavorites((prev) => [result.data, ...prev]);
        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMsg = "Failed to add to favorites";
      setError(errorMsg);
      console.error("Error adding favorite:", err);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (itemId, type) => {
    if (!user) {
      setError("You must be logged in to remove favorites");
      return { success: false, error: "User not authenticated" };
    }

    setLoading(true);
    setError(null);

    try {
      const result = await removeFromFavorites(user.uid, itemId, type);
      if (result.success) {
        // Remove from local state immediately for better UX
        setFavorites((prev) =>
          prev.filter((fav) => !(fav.itemId === itemId && fav.type === type))
        );
        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMsg = "Failed to remove from favorites";
      setError(errorMsg);
      console.error("Error removing favorite:", err);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const isFavorite = (itemId, type) => {
    return favorites.some((fav) => fav.itemId === itemId && fav.type === type);
  };

  const getFavoritesByType = (type) => {
    return favorites.filter((fav) => fav.type === type);
  };

  const toggleFavorite = async (item) => {
    const itemId = item.mal_id;
    const type = item.type;

    if (isFavorite(itemId, type)) {
      return await removeFavorite(itemId, type);
    } else {
      return await addFavorite(item);
    }
  };

  const clearError = () => setError(null);

  const value = {
    favorites,
    loading,
    error,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    getFavoritesByType,
    loadFavorites,
    clearError,
    // Computed values
    favoriteAnime: getFavoritesByType("anime"),
    favoriteManga: getFavoritesByType("manga"),
    favoriteCharacters: getFavoritesByType("character"),
    totalFavorites: favorites.length,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

export { FavoritesContext };
