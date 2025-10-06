// src/components/SortingControls.jsx
import React from "react";

const SortingControls = ({
  className = "",
  type = "anime", // anime, character, manga
}) => {
  const sortOptions = {
    anime: [{ value: "score", label: "Rating", icon: "⭐" }],
    character: [{ value: "favorites", label: "Likes", icon: "❤️" }],
    manga: [{ value: "score", label: "Rating", icon: "⭐" }],
  };

  const options = sortOptions[type] || sortOptions.anime;

  return (
    <div
      className={`bg-surface-secondary/50 backdrop-blur-sm rounded-xl border border-border/30 p-4 ${className}`}
    >
      <div className="flex items-center justify-center gap-3">
        <span className="text-lg">{options[0].icon}</span>
        <span className="font-semibold text-text-primary">
          Sorted by {options[0].label}
        </span>
        <span className="px-3 py-1 bg-gradient-to-r from-accent-cyan to-accent-purple text-white text-sm rounded-lg font-medium">
          ↓ High to Low
        </span>
      </div>
    </div>
  );
};

export default SortingControls;
