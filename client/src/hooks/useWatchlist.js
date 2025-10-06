// src/hooks/useWatchlist.js
import { useContext } from "react";
import { WatchlistContext } from "../context/WatchlistContext";

export const useWatchlist = () => {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error("useWatchlist must be used within a WatchlistProvider");
  }
  return context;
};
