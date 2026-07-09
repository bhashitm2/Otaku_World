// src/components/FilterPanel.jsx - Nova advanced filters (anime/manga)
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Alias so ESLint sees the JSX usage (it misses <motion.div> member syntax)
const MotionDiv = motion.div;
import { useQuery } from "@tanstack/react-query";
import { getAnimeGenres, getMangaGenres } from "../services/anime";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";

const ANIME_TYPES = ["tv", "movie", "ova", "special", "ona", "music"];
const MANGA_TYPES = ["manga", "novel", "lightnovel", "oneshot", "manhwa", "manhua"];
const ANIME_STATUSES = [
  { value: "airing", label: "Airing" },
  { value: "complete", label: "Completed" },
  { value: "upcoming", label: "Upcoming" },
];
const MANGA_STATUSES = [
  { value: "publishing", label: "Publishing" },
  { value: "complete", label: "Completed" },
  { value: "upcoming", label: "Upcoming" },
];

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from(
  { length: CURRENT_YEAR + 2 - 1960 },
  (_, i) => CURRENT_YEAR + 1 - i
);

// Short type codes read as acronyms (TV, OVA, ONA); the rest sentence case.
const typeLabel = (type) => {
  if (type.length <= 3) return type.toUpperCase();
  if (type === "lightnovel") return "Light novel";
  return type.charAt(0).toUpperCase() + type.slice(1);
};

const selectClass =
  "w-full rounded-sm border border-line bg-surface-2 px-3 py-2.5 font-body text-sm text-text outline-none transition-colors duration-fast focus:border-line-strong";

const sectionLabel =
  "mb-3 font-body text-[11px] font-semibold uppercase tracking-[0.08em] text-faint";

// filters shape: { genres: "1,2", status, type, min_score, year }
const FilterPanel = ({ mediaType = "anime", filters, onChange, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);

  const { data: genresData } = useQuery({
    queryKey: [mediaType, "genres"],
    queryFn: mediaType === "manga" ? getMangaGenres : getAnimeGenres,
    staleTime: 24 * 60 * 60 * 1000,
  });

  const genres = React.useMemo(() => {
    const seen = new Set();
    return (genresData?.data || []).filter((genre) => {
      if (seen.has(genre.mal_id)) return false;
      seen.add(genre.mal_id);
      return true;
    });
  }, [genresData]);

  const selectedGenreIds = new Set(
    (filters.genres || "").split(",").filter(Boolean).map(Number)
  );

  const types = mediaType === "manga" ? MANGA_TYPES : ANIME_TYPES;
  const statuses = mediaType === "manga" ? MANGA_STATUSES : ANIME_STATUSES;

  const update = (patch) => onChange({ ...filters, ...patch });

  const toggleGenre = (genreId) => {
    const next = new Set(selectedGenreIds);
    if (next.has(genreId)) next.delete(genreId);
    else next.add(genreId);
    update({ genres: [...next].join(",") || undefined });
  };

  const activeCount = [
    selectedGenreIds.size > 0,
    !!filters.status,
    !!filters.type,
    !!filters.min_score,
    !!filters.year,
  ].filter(Boolean).length;

  const clearAll = () =>
    onChange({
      genres: undefined,
      status: undefined,
      type: undefined,
      min_score: undefined,
      year: undefined,
    });

  return (
    <div className={className}>
      {/* Toggle button */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={() => setIsOpen((open) => !open)}
          className={`inline-flex items-center rounded border px-4 py-2.5 font-body text-[13px] font-semibold transition-colors duration-fast ${
            isOpen || activeCount > 0
              ? "border-line-strong bg-surface-2 text-text"
              : "border-line bg-surface text-muted hover:border-line-strong hover:text-text"
          }`}
        >
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          Filters
          {activeCount > 0 && (
            <span className="ml-2 flex h-5 min-w-[20px] items-center justify-center rounded-pill bg-gold px-1.5 font-mono text-[10px] font-bold text-bg">
              {activeCount}
            </span>
          )}
          <ChevronDown
            className={`ml-2 h-4 w-4 transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>
        {activeCount > 0 && (
          <button
            onClick={clearAll}
            className="flex items-center font-body text-[13px] text-faint transition-colors duration-fast hover:text-danger"
          >
            <X className="mr-1 h-4 w-4" />
            Clear all
          </button>
        )}
      </div>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <MotionDiv
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mt-4 space-y-6 rounded-lg border border-line bg-surface p-6 text-left shadow-sm">
              {/* Genres */}
              {genres.length > 0 && (
                <div>
                  <h4 className={sectionLabel}>Genres</h4>
                  <div className="flex flex-wrap gap-2">
                    {genres.map((genre) => {
                      const selected = selectedGenreIds.has(genre.mal_id);
                      return (
                        <button
                          key={genre.mal_id}
                          onClick={() => toggleGenre(genre.mal_id)}
                          className={`rounded-pill border px-3.5 py-1.5 font-body text-xs font-medium transition-colors duration-fast ${
                            selected
                              ? "border-gold bg-gold text-bg"
                              : "border-line bg-surface-2 text-muted hover:border-line-strong hover:text-text"
                          }`}
                        >
                          {genre.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {/* Status */}
                <div>
                  <h4 className={sectionLabel}>Status</h4>
                  <select
                    value={filters.status || ""}
                    onChange={(e) =>
                      update({ status: e.target.value || undefined })
                    }
                    className={selectClass}
                  >
                    <option value="">Any</option>
                    {statuses.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Type */}
                <div>
                  <h4 className={sectionLabel}>Type</h4>
                  <select
                    value={filters.type || ""}
                    onChange={(e) =>
                      update({ type: e.target.value || undefined })
                    }
                    className={selectClass}
                  >
                    <option value="">Any</option>
                    {types.map((type) => (
                      <option key={type} value={type}>
                        {typeLabel(type)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Year */}
                <div>
                  <h4 className={sectionLabel}>Year</h4>
                  <select
                    value={filters.year || ""}
                    onChange={(e) =>
                      update({ year: e.target.value || undefined })
                    }
                    className={selectClass}
                  >
                    <option value="">Any</option>
                    {YEARS.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Min score */}
                <div>
                  <h4 className={sectionLabel}>
                    Min score:{" "}
                    <span className="font-mono text-gold">
                      {filters.min_score || "Any"}
                    </span>
                  </h4>
                  <input
                    type="range"
                    min="0"
                    max="9"
                    step="1"
                    value={filters.min_score || 0}
                    onChange={(e) =>
                      update({
                        min_score:
                          e.target.value === "0" ? undefined : e.target.value,
                      })
                    }
                    className="mt-2 w-full accent-gold"
                  />
                </div>
              </div>
            </div>
          </MotionDiv>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FilterPanel;
