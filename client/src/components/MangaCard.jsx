// src/components/MangaCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import { formatMangaData } from "../services/anime";

const MangaCard = ({ manga, compact = false }) => {
  const formattedManga = formatMangaData(manga);

  if (compact) {
    return (
      <Link
        to={`/manga/${formattedManga.id}`}
        className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
      >
        <div className="flex">
          <img
            src={formattedManga.image}
            alt={formattedManga.title}
            className="w-16 h-20 object-cover"
            loading="lazy"
            onError={(e) => {
              e.target.src = "/placeholder-anime.jpg";
            }}
          />
          <div className="p-3 flex-1">
            <h4 className="font-semibold text-sm text-gray-900 line-clamp-2 mb-1">
              {formattedManga.title}
            </h4>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              {formattedManga.score && (
                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                  ⭐ {formattedManga.score}
                </span>
              )}
              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                📚 Manga
              </span>
            </div>
            {formattedManga.chapters && (
              <p className="text-xs text-gray-500 mt-1">
                {formattedManga.chapters} chapters
              </p>
            )}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/manga/${formattedManga.id}`}
      className="group block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105"
    >
      <div className="relative">
        <img
          src={formattedManga.image}
          alt={formattedManga.title}
          className="w-full h-64 object-cover"
          loading="lazy"
          onError={(e) => {
            e.target.src = "/placeholder-anime.jpg";
          }}
        />

        {/* Score badge */}
        {formattedManga.score && (
          <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded-md text-sm font-bold">
            ⭐ {formattedManga.score}
          </div>
        )}

        {/* Type badge */}
        <div className="absolute top-2 left-2 bg-purple-600 text-white px-2 py-1 rounded-md text-xs font-semibold uppercase">
          📚 {formattedManga.type || "Manga"}
        </div>

        {/* Overlay with quick actions */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-center">
            <p className="font-semibold mb-2">View Details</p>
            {formattedManga.chapters && (
              <p className="text-sm">{formattedManga.chapters} chapters</p>
            )}
            {formattedManga.volumes && (
              <p className="text-sm">{formattedManga.volumes} volumes</p>
            )}
          </div>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-bold text-gray-900 text-sm mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors duration-300">
          {formattedManga.title}
        </h3>

        <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
          {formattedManga.year && (
            <span className="bg-gray-100 px-2 py-1 rounded">
              {formattedManga.year}
            </span>
          )}
          {formattedManga.status && (
            <span
              className={`px-2 py-1 rounded font-medium ${
                formattedManga.status === "Finished"
                  ? "bg-green-100 text-green-800"
                  : formattedManga.status === "Publishing"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {formattedManga.status}
            </span>
          )}
        </div>

        {/* Chapter/Volume info */}
        <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
          {formattedManga.chapters && (
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
              📖 {formattedManga.chapters} ch
            </span>
          )}
          {formattedManga.volumes && (
            <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded">
              📚 {formattedManga.volumes} vol
            </span>
          )}
        </div>

        {/* Genres */}
        {formattedManga.genres && formattedManga.genres.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {formattedManga.genres.slice(0, 2).map((genre) => (
              <span
                key={genre.mal_id}
                className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full"
              >
                {genre.name}
              </span>
            ))}
            {formattedManga.genres.length > 2 && (
              <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                +{formattedManga.genres.length - 2}
              </span>
            )}
          </div>
        )}

        {/* Authors */}
        {formattedManga.authors && formattedManga.authors.length > 0 && (
          <div className="text-xs text-gray-500">
            <span className="font-medium">By: </span>
            {formattedManga.authors
              .slice(0, 2)
              .map((author) => author.name)
              .join(", ")}
            {formattedManga.authors.length > 2 &&
              ` +${formattedManga.authors.length - 2}`}
          </div>
        )}

        {/* Rating and Popularity */}
        <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
          {formattedManga.rank && (
            <span className="flex items-center">🏆 #{formattedManga.rank}</span>
          )}
          {formattedManga.popularity && (
            <span className="flex items-center">
              👥 #{formattedManga.popularity}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default MangaCard;
