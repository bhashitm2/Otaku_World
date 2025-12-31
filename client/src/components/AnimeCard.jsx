// src/components/AnimeCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import FavoriteButton from "./FavoriteButton";
import WatchlistButton from "./WatchlistButton";

const AnimeCard = React.memo(({ anime }) => {
  // Handle both raw API data, formatted data, and watchlist/favorites data
  if (!anime) return null;

  const id = anime.mal_id || anime.itemId || anime.id;
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
  const genres = anime.genres || [];
  const rank = anime.rank;
  const popularity = anime.popularity;

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
            {type}
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
            size="sm"
          />
          <WatchlistButton
            item={{
              mal_id: id,
              title: title,
              image: image,
              type: "anime",
            }}
            size="sm"
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
        <h3 className="font-bold text-white text-sm mb-2 line-clamp-2 group-hover:text-indigo-400 transition-colors duration-300">
          {title}
        </h3>

        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
          {year && (
            <span className="bg-gray-800 px-2 py-1 rounded">
              {year}
            </span>
          )}
          {status && (
            <span
              className={`px-2 py-1 rounded font-medium ${
                status === "Finished Airing"
                  ? "bg-green-900/50 text-green-400"
                  : status === "Currently Airing"
                  ? "bg-blue-900/50 text-blue-400"
                  : "bg-yellow-900/50 text-yellow-400"
              }`}
            >
              {status}
            </span>
          )}
        </div>

        {/* Genres */}
        {genres && genres.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {genres.slice(0, 2).map((genre, index) => (
              <span
                key={genre.mal_id || index}
                className="bg-purple-900/50 text-purple-400 text-xs px-2 py-1 rounded-full"
              >
                {genre.name}
              </span>
            ))}
            {genres.length > 2 && (
              <span className="bg-gray-800 text-gray-400 text-xs px-2 py-1 rounded-full">
                +{genres.length - 2}
              </span>
            )}
          </div>
        )}

        {/* Flexible spacer */}
        <div className="flex-1"></div>

        {/* Rating and Popularity */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          {rank && (
            <span className="flex items-center">🏆 #{rank}</span>
          )}
          {popularity && (
            <span className="flex items-center">
              👥 #{popularity}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
});

AnimeCard.displayName = "AnimeCard";

export default AnimeCard;
