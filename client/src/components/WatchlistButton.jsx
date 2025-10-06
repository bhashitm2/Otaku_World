// src/components/WatchlistButton.jsx
import React, { useState } from "react";
import { useWatchlist } from "../hooks/useWatchlist";
import { useAuth } from "../hooks/useAuth";
import { WATCH_STATUS_OPTIONS } from "../services/firestoreService";

const WatchlistButton = ({ item, className = "", size = "md" }) => {
  const { user } = useAuth();
  const { isInWatchlist, toggleWatchlist, updateWatchListItem, loading } =
    useWatchlist();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  if (!user) {
    return null; // Don't show watchlist button if user is not logged in
  }

  const itemId = item.mal_id;
  const type = item.type;
  const watchlistItem = isInWatchlist(itemId, type);

  const handleToggleWatchlist = async (e, status = "plan_to_watch") => {
    e.preventDefault();
    e.stopPropagation();

    if (isProcessing || loading) return;

    setIsProcessing(true);
    setShowStatusMenu(false);

    try {
      await toggleWatchlist(item, status);
    } catch (error) {
      console.error("Error toggling watchlist:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStatusChange = async (e, newStatus) => {
    e.preventDefault();
    e.stopPropagation();

    if (isProcessing || loading || !watchlistItem) return;

    setIsProcessing(true);
    setShowStatusMenu(false);

    try {
      await updateWatchListItem(itemId, type, { watchStatus: newStatus });
    } catch (error) {
      console.error("Error updating watchlist status:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "w-6 h-6 text-sm";
      case "lg":
        return "w-10 h-10 text-lg";
      default:
        return "w-8 h-8 text-base";
    }
  };

  const getCurrentStatus = () => {
    if (!watchlistItem) return null;
    return WATCH_STATUS_OPTIONS.find(
      (option) => option.value === watchlistItem.watchStatus
    );
  };

  const currentStatus = getCurrentStatus();

  return (
    <div className="relative">
      <button
        onClick={
          watchlistItem
            ? (e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowStatusMenu(!showStatusMenu);
              }
            : (e) => handleToggleWatchlist(e)
        }
        disabled={isProcessing || loading}
        className={`
          ${getSizeClasses()}
          flex items-center justify-center
          rounded-full
          transition-all duration-200
          hover:scale-110
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
          ${
            watchlistItem
              ? `${
                  currentStatus?.color || "bg-blue-500"
                } text-white shadow-lg hover:opacity-90`
              : "bg-white/20 text-gray-300 hover:bg-white/30 hover:text-blue-400"
          }
          ${
            isProcessing || loading
              ? "opacity-50 cursor-not-allowed"
              : "cursor-pointer"
          }
          ${className}
        `}
        title={
          watchlistItem
            ? `${
                currentStatus?.label || "In Watchlist"
              } - Click to change status`
            : "Add to watchlist"
        }
      >
        {isProcessing || loading ? (
          <div className="animate-spin rounded-full border-2 border-current border-t-transparent w-4 h-4" />
        ) : (
          <svg
            className={`${
              size === "sm" ? "w-3 h-3" : size === "lg" ? "w-5 h-5" : "w-4 h-4"
            }`}
            fill={watchlistItem ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth={watchlistItem ? 0 : 2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
            />
          </svg>
        )}
      </button>

      {/* Status Menu */}
      {showStatusMenu && watchlistItem && (
        <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 z-50 min-w-max">
          <div className="py-1">
            {WATCH_STATUS_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={(e) => handleStatusChange(e, option.value)}
                className={`
                  w-full text-left px-3 py-2 text-sm
                  hover:bg-gray-100 dark:hover:bg-gray-700
                  flex items-center space-x-2
                  ${
                    watchlistItem.watchStatus === option.value
                      ? "bg-gray-100 dark:bg-gray-700"
                      : ""
                  }
                `}
              >
                <div className={`w-3 h-3 rounded-full ${option.color}`}></div>
                <span>{option.label}</span>
              </button>
            ))}
            <hr className="my-1 border-gray-200 dark:border-gray-600" />
            <button
              onClick={(e) => handleToggleWatchlist(e)}
              className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Remove from Watchlist
            </button>
          </div>
        </div>
      )}

      {/* Backdrop to close menu */}
      {showStatusMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowStatusMenu(false)}
        />
      )}
    </div>
  );
};

export default WatchlistButton;
