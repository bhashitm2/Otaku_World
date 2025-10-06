// src/components/AnimeCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import { formatAnimeData } from "../services/anime";
import FavoriteButton from "./FavoriteButton";
import WatchlistButton from "./WatchlistButton";

const AnimeCard = React.memo(({ anime }) => {
  const formattedAnime = formatAnimeData(anime);

  // Don't render if anime data is invalid
  if (!formattedAnime.id) {
    return null;
  }

  return (
    <Link
      to={`/anime/${formattedAnime.id}`}
      className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105"
    >
      <div className="relative">
        <img
          src={formattedAnime.image || "/placeholder-anime.jpg"}
          alt={formattedAnime.title}
          className="w-full h-64 object-cover group-hover:brightness-75 transition-all duration-300"
          loading="lazy"
          onError={(e) => {
            e.target.src = "/placeholder-anime.jpg"; // Fallback image
          }}
        />

        {/* Score badge */}
        {formattedAnime.score && (
          <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded-md text-sm font-bold">
            ⭐ {formattedAnime.score}
          </div>
        )}

        {/* Type badge */}
        {formattedAnime.type && (
          <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded-md text-xs font-semibold uppercase">
            {formattedAnime.type}
          </div>
        )}

        {/* Action buttons */}
        <div className="absolute bottom-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <FavoriteButton
            item={{
              ...formattedAnime,
              mal_id: formattedAnime.id,
              type: "anime",
            }}
            size="sm"
          />
          <WatchlistButton
            item={{
              ...formattedAnime,
              mal_id: formattedAnime.id,
              type: "anime",
            }}
            size="sm"
          />
        </div>

        {/* Overlay with quick actions */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-center">
            <p className="font-semibold mb-2">View Details</p>
            {formattedAnime.episodes && (
              <p className="text-sm">{formattedAnime.episodes} episodes</p>
            )}
          </div>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-bold text-gray-900 text-sm mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
          {formattedAnime.title}
        </h3>

        <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
          {formattedAnime.year && (
            <span className="bg-gray-100 px-2 py-1 rounded">
              {formattedAnime.year}
            </span>
          )}
          {formattedAnime.status && (
            <span
              className={`px-2 py-1 rounded font-medium ${
                formattedAnime.status === "Finished Airing"
                  ? "bg-green-100 text-green-800"
                  : formattedAnime.status === "Currently Airing"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {formattedAnime.status}
            </span>
          )}
        </div>

        {/* Genres */}
        {formattedAnime.genres && formattedAnime.genres.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {formattedAnime.genres.slice(0, 2).map((genre) => (
              <span
                key={genre.mal_id}
                className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full"
              >
                {genre.name}
              </span>
            ))}
            {formattedAnime.genres.length > 2 && (
              <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                +{formattedAnime.genres.length - 2}
              </span>
            )}
          </div>
        )}

        {/* Rating and Popularity */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          {formattedAnime.rank && (
            <span className="flex items-center">🏆 #{formattedAnime.rank}</span>
          )}
          {formattedAnime.popularity && (
            <span className="flex items-center">
              👥 #{formattedAnime.popularity}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
});

AnimeCard.displayName = "AnimeCard";

export default AnimeCard;
