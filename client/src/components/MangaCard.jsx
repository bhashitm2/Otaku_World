// src/components/MangaCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import { formatMangaData } from "../services/anime";
import FavoriteButton from "./FavoriteButton";
import WatchlistButton from "./WatchlistButton";

const MangaCard = ({ manga, compact = false }) => {
  const formattedManga = formatMangaData(manga);

  if (compact) {
    return (
      <Link
        to={`/manga/${formattedManga.id}`}
        className="block bg-surface-secondary rounded-lg shadow-lg overflow-hidden hover:shadow-xl hover:shadow-accent-magenta/25 transition-all duration-300 transform hover:-translate-y-1 border border-surface-secondary/50 hover:border-accent-magenta/50"
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
            <h4 className="font-semibold text-sm text-text-primary line-clamp-2 mb-1">
              {formattedManga.title}
            </h4>
            <div className="flex items-center gap-2 text-xs text-text-secondary">
              {formattedManga.score && (
                <span className="bg-accent-yellow/20 text-accent-yellow px-2 py-1 rounded-lg">
                  ⭐ {formattedManga.score}
                </span>
              )}
              <span className="bg-accent-magenta/20 text-accent-magenta px-2 py-1 rounded-lg">
                📚 Manga
              </span>
            </div>
            {formattedManga.chapters && (
              <p className="text-xs text-text-secondary mt-1">
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
      className="group block bg-surface-secondary rounded-xl shadow-lg overflow-hidden hover:shadow-2xl hover:shadow-accent-magenta/25 transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 border border-surface-secondary/50 hover:border-accent-magenta/50"
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
          <div className="absolute top-3 right-3 bg-bg-primary/90 backdrop-blur-sm text-accent-yellow px-3 py-1 rounded-full text-sm font-bold border border-accent-yellow/20">
            ⭐ {formattedManga.score}
          </div>
        )}

        {/* Type badge */}
        <div className="absolute top-3 left-3 bg-accent-magenta/90 backdrop-blur-sm text-bg-primary px-3 py-1 rounded-full text-xs font-semibold uppercase">
          📚 {formattedManga.type || "Manga"}
        </div>

        {/* Action buttons */}
        <div className="absolute bottom-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <FavoriteButton
            item={{
              ...formattedManga,
              mal_id: formattedManga.id,
              type: "manga",
            }}
            size="sm"
          />
          <WatchlistButton
            item={{
              ...formattedManga,
              mal_id: formattedManga.id,
              type: "manga",
            }}
            size="sm"
          />
        </div>

        {/* Overlay with quick actions */}
        <div className="absolute inset-0 bg-bg-primary/0 group-hover:bg-bg-primary/60 transition-all duration-300 flex items-center justify-center backdrop-blur-0 group-hover:backdrop-blur-sm">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-text-primary text-center">
            <p className="font-semibold mb-2 text-accent-magenta">
              View Details
            </p>
            {formattedManga.chapters && (
              <p className="text-sm text-text-secondary">
                {formattedManga.chapters} chapters
              </p>
            )}
            {formattedManga.volumes && (
              <p className="text-sm text-text-secondary">
                {formattedManga.volumes} volumes
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-bold text-text-primary text-sm mb-2 line-clamp-2 group-hover:text-accent-magenta transition-colors duration-300">
          {formattedManga.title}
        </h3>

        <div className="flex items-center justify-between text-xs text-text-secondary mb-2">
          {formattedManga.year && (
            <span className="bg-surface-dark/50 text-text-secondary px-2 py-1 rounded-lg">
              {formattedManga.year}
            </span>
          )}
          {formattedManga.status && (
            <span
              className={`px-2 py-1 rounded-lg font-medium ${
                formattedManga.status === "Finished"
                  ? "bg-green-500/20 text-green-400"
                  : formattedManga.status === "Publishing"
                  ? "bg-accent-cyan/20 text-accent-cyan"
                  : "bg-accent-yellow/20 text-accent-yellow"
              }`}
            >
              {formattedManga.status}
            </span>
          )}
        </div>

        {/* Chapter/Volume info */}
        <div className="flex items-center gap-2 text-xs text-text-secondary mb-2">
          {formattedManga.chapters && (
            <span className="bg-accent-cyan/20 text-accent-cyan px-2 py-1 rounded-lg">
              📖 {formattedManga.chapters} ch
            </span>
          )}
          {formattedManga.volumes && (
            <span className="bg-accent-magenta/20 text-accent-magenta px-2 py-1 rounded-lg">
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
                className="bg-accent-magenta/20 text-accent-magenta text-xs px-2 py-1 rounded-full"
              >
                {genre.name}
              </span>
            ))}
            {formattedManga.genres.length > 2 && (
              <span className="bg-surface-dark/50 text-text-secondary text-xs px-2 py-1 rounded-full">
                +{formattedManga.genres.length - 2}
              </span>
            )}
          </div>
        )}

        {/* Authors */}
        {formattedManga.authors && formattedManga.authors.length > 0 && (
          <div className="text-xs text-text-secondary">
            <span className="font-medium text-accent-cyan">By: </span>
            {formattedManga.authors
              .slice(0, 2)
              .map((author) => author.name)
              .join(", ")}
            {formattedManga.authors.length > 2 &&
              ` +${formattedManga.authors.length - 2}`}
          </div>
        )}

        {/* Rating and Popularity */}
        <div className="flex items-center justify-between text-xs text-text-secondary mt-2">
          {formattedManga.rank && (
            <span className="flex items-center text-accent-yellow">
              🏆 #{formattedManga.rank}
            </span>
          )}
          {formattedManga.popularity && (
            <span className="flex items-center text-accent-orange">
              👥 #{formattedManga.popularity}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default MangaCard;
