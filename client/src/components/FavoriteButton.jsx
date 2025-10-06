// src/components/FavoriteButton.jsx
import React, { useState } from "react";
import { useFavorites } from "../hooks/useFavorites";
import { useAuth } from "../hooks/useAuth";

const FavoriteButton = ({ item, className = "", size = "md" }) => {
  const { user } = useAuth();
  const { isFavorite, toggleFavorite, loading } = useFavorites();
  const [isProcessing, setIsProcessing] = useState(false);

  if (!user) {
    return null; // Don't show favorite button if user is not logged in
  }

  const itemId = item.mal_id;
  const type = item.type;
  const isFav = isFavorite(itemId, type);

  const handleToggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isProcessing || loading) return;

    setIsProcessing(true);
    try {
      await toggleFavorite(item);
    } catch (error) {
      console.error("Error toggling favorite:", error);
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

  return (
    <button
      onClick={handleToggleFavorite}
      disabled={isProcessing || loading}
      className={`
        ${getSizeClasses()}
        flex items-center justify-center
        rounded-full
        transition-all duration-200
        hover:scale-110
        focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50
        ${
          isFav
            ? "bg-red-500 text-white shadow-lg hover:bg-red-600"
            : "bg-white/20 text-gray-300 hover:bg-white/30 hover:text-red-400"
        }
        ${
          isProcessing || loading
            ? "opacity-50 cursor-not-allowed"
            : "cursor-pointer"
        }
        ${className}
      `}
      title={isFav ? "Remove from favorites" : "Add to favorites"}
    >
      {isProcessing || loading ? (
        <div className="animate-spin rounded-full border-2 border-current border-t-transparent w-4 h-4" />
      ) : (
        <svg
          className={`${
            size === "sm" ? "w-3 h-3" : size === "lg" ? "w-5 h-5" : "w-4 h-4"
          }`}
          fill={isFav ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth={isFav ? 0 : 2}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      )}
    </button>
  );
};

export default FavoriteButton;
