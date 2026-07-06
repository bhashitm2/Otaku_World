// src/components/FilterPanel.jsx - "Ink & Impact" advanced filters (anime/manga)
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

const selectClass =
  "w-full border-[3px] border-ink bg-ink-bg px-3 py-2 font-body text-sm font-bold text-ink outline-none";

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
          className={`ink-btn px-4 py-2.5 text-xs transition-all duration-150 ${
            isOpen || activeCount > 0
              ? "bg-ink text-ink-paper"
              : "bg-ink-paper text-ink hover:bg-ink-red hover:text-ink-paper"
          }`}
        >
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          FILTERS
          {activeCount > 0 && (
            <span className="ml-2 flex h-5 w-5 items-center justify-center border-2 border-current text-[10px]">
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
            className="flex items-center text-xs font-black uppercase tracking-[1px] text-ink-mut3 hover:text-ink-red"
          >
            <X className="mr-1 h-4 w-4" />
            Clear all
          </button>
        )}
      </div>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="ink-card ink-shadow mt-4 space-y-6 p-6 text-left">
              {/* Genres */}
              {genres.length > 0 && (
                <div>
                  <h4 className="mb-3 text-xs font-black uppercase tracking-[1px] text-ink">
                    Genres
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {genres.map((genre) => {
                      const selected = selectedGenreIds.has(genre.mal_id);
                      return (
                        <button
                          key={genre.mal_id}
                          onClick={() => toggleGenre(genre.mal_id)}
                          className={`border-[3px] border-ink px-3 py-1.5 text-[11px] font-black uppercase tracking-[.5px] transition-all duration-150 ${
                            selected
                              ? "bg-ink-red text-ink-paper"
                              : "bg-ink-bg text-ink hover:bg-ink hover:text-ink-paper"
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
                  <h4 className="mb-3 text-xs font-black uppercase tracking-[1px] text-ink">
                    Status
                  </h4>
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
                  <h4 className="mb-3 text-xs font-black uppercase tracking-[1px] text-ink">
                    Type
                  </h4>
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
                        {type.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Year */}
                <div>
                  <h4 className="mb-3 text-xs font-black uppercase tracking-[1px] text-ink">
                    Year
                  </h4>
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

                {/* Min Score */}
                <div>
                  <h4 className="mb-3 text-xs font-black uppercase tracking-[1px] text-ink">
                    Min Score:{" "}
                    <span className="text-ink-red">
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
                    className="mt-2 w-full accent-ink-red"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FilterPanel;
