// src/context/WatchlistContext.jsx
import React, { createContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "../hooks/useAuth";
import {
  addToWatchlist,
  removeFromWatchlist,
  updateWatchlistItem,
  getWatchlist,
} from "../services/firestoreService";

const WatchlistContext = createContext();

export const WatchlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadWatchlist = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const result = await getWatchlist(user.uid);
      if (result.success) {
        setWatchlist(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Failed to load watchlist");
      console.error("Error loading watchlist:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Load user's watchlist when they log in
  useEffect(() => {
    if (user) {
      loadWatchlist();
    } else {
      // Clear watchlist when user logs out
      setWatchlist([]);
      setError(null);
    }
  }, [user, loadWatchlist]);

  const addToWatchList = async (item, status = "plan_to_watch") => {
    if (!user) {
      setError("You must be logged in to add to watchlist");
      return { success: false, error: "User not authenticated" };
    }

    setLoading(true);
    setError(null);

    try {
      const result = await addToWatchlist(user.uid, item, status);
      if (result.success) {
        // Add to local state immediately for better UX
        setWatchlist((prev) => [result.data, ...prev]);
        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMsg = "Failed to add to watchlist";
      setError(errorMsg);
      console.error("Error adding to watchlist:", err);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const removeFromWatchList = async (itemId, type) => {
    if (!user) {
      setError("You must be logged in to remove from watchlist");
      return { success: false, error: "User not authenticated" };
    }

    setLoading(true);
    setError(null);

    try {
      const result = await removeFromWatchlist(user.uid, itemId, type);
      if (result.success) {
        // Remove from local state immediately for better UX
        setWatchlist((prev) =>
          prev.filter((item) => !(item.itemId === itemId && item.type === type))
        );
        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMsg = "Failed to remove from watchlist";
      setError(errorMsg);
      console.error("Error removing from watchlist:", err);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const updateWatchListItem = async (itemId, type, updates) => {
    if (!user) {
      setError("You must be logged in to update watchlist");
      return { success: false, error: "User not authenticated" };
    }

    setLoading(true);
    setError(null);

    try {
      const result = await updateWatchlistItem(user.uid, itemId, type, updates);
      if (result.success) {
        // Update local state immediately for better UX
        setWatchlist((prev) =>
          prev.map((item) =>
            item.itemId === itemId && item.type === type
              ? { ...item, ...updates }
              : item
          )
        );
        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMsg = "Failed to update watchlist item";
      setError(errorMsg);
      console.error("Error updating watchlist item:", err);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const isInWatchlist = (itemId, type) => {
    return watchlist.find(
      (item) => item.itemId === itemId && item.type === type
    );
  };

  const getWatchlistByType = (type) => {
    return watchlist.filter((item) => item.type === type);
  };

  const getWatchlistByStatus = (status) => {
    return watchlist.filter((item) => item.watchStatus === status);
  };

  const toggleWatchlist = async (item, status = "plan_to_watch") => {
    const itemId = item.mal_id;
    const type = item.type;
    const watchlistItem = isInWatchlist(itemId, type);

    if (watchlistItem) {
      return await removeFromWatchList(itemId, type);
    } else {
      return await addToWatchList(item, status);
    }
  };

  const clearError = () => setError(null);

  const value = {
    watchlist,
    loading,
    error,
    addToWatchList,
    removeFromWatchList,
    updateWatchListItem,
    toggleWatchlist,
    isInWatchlist,
    getWatchlistByType,
    getWatchlistByStatus,
    loadWatchlist,
    clearError,
    // Computed values
    animeWatchlist: getWatchlistByType("anime"),
    mangaWatchlist: getWatchlistByType("manga"),
    watching: getWatchlistByStatus("watching"),
    completed: getWatchlistByStatus("completed"),
    planToWatch: getWatchlistByStatus("plan_to_watch"),
    onHold: getWatchlistByStatus("on_hold"),
    dropped: getWatchlistByStatus("dropped"),
    totalWatchlist: watchlist.length,
  };

  return (
    <WatchlistContext.Provider value={value}>
      {children}
    </WatchlistContext.Provider>
  );
};

export { WatchlistContext };
