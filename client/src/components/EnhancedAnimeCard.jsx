// src/components/EnhancedAnimeCard.jsx - Anime card matching CharacterCard style
import React from "react";
import { Link } from "react-router-dom";
import FavoriteButton from "./FavoriteButton";
import WatchlistButton from "./WatchlistButton";

const EnhancedAnimeCard = ({ anime, index = 0 }) => {
  // Handle both raw API data and already formatted data
  if (!anime) return null;

  const id = anime.mal_id || anime.id;
  const title = anime.title || anime.title_english || "Unknown Title";
  const image = anime.images?.jpg?.large_image_url || 
                anime.images?.jpg?.image_url || 
                anime.image || 
                "/placeholder-anime.jpg";
  const score = anime.score;
  const type = anime.type;
  const year = anime.year || anime.aired?.prop?.from?.year;
  const episodes = anime.episodes;
  const status = anime.status;

  // Don't render if anime data is invalid
  if (!id) {
    return null;
  }

  return (
    <Link
      to={`/anime/${id}`}
      className="group bg-gray-900 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 h-full flex flex-col"
    >
      <div className="relative flex-shrink-0">
        <img
          src={image}
          alt={title}
          className="w-full h-64 object-cover group-hover:brightness-75 transition-all duration-300"
          loading="lazy"
          onError={(e) => {
            e.target.src = "/placeholder-anime.jpg";
          }}
        />

        {/* Score badge */}
        {score && (
          <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded-md text-sm font-bold">
            ⭐ {score}
          </div>
        )}

        {/* Type badge */}
        {type && (
          <div className="absolute top-2 left-2 bg-indigo-600 text-white px-2 py-1 rounded-md text-xs font-semibold uppercase">
            🎬 {type}
          </div>
        )}

        {/* Action buttons */}
        <div 
          className="absolute bottom-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <FavoriteButton
            item={{
              mal_id: id,
              title: title,
              image: image,
              type: "anime",
            }}
            size="lg"
          />
          <WatchlistButton
            item={{
              mal_id: id,
              title: title,
              image: image,
              type: "anime",
            }}
            size="lg"
          />
        </div>

        {/* Overlay with quick actions */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-center">
            <p className="font-semibold mb-2">View Details</p>
            {episodes && (
              <p className="text-sm">{episodes} episodes</p>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col">
        {/* Anime title - fixed height */}
        <h3 className="font-bold text-white text-sm mb-0 line-clamp-2 group-hover:text-indigo-400 transition-colors duration-300 h-10 flex items-start">
          {title}
        </h3>

        {/* Flexible spacer */}
        <div className="flex-1"></div>

        {/* Meta info - fixed at bottom */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
          {year && (
            <span className="flex items-center">
              📅 {year}
            </span>
          )}
          {episodes && (
            <span className="flex items-center">
              📺 {episodes} eps
            </span>
          )}
        </div>

        {/* Status badge */}
        {status && (
          <div className="mt-1">
            <span
              className={`text-xs px-2 py-1 rounded font-medium ${
                status === "Finished Airing"
                  ? "bg-green-900/50 text-green-400"
                  : status === "Currently Airing"
                  ? "bg-blue-900/50 text-blue-400"
                  : "bg-yellow-900/50 text-yellow-400"
              }`}
            >
              {status}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
};

export default EnhancedAnimeCard;
