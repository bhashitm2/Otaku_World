// Anime Archive — "Ink & Impact" browse page with search, sort, genre chips
// and advanced filters, all synced to the URL.
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getTopAnime, searchAnime } from "../services/anime";
import { useAnimeGenres } from "../hooks/useAnimeQueries";
import InkAnimeCard from "../components/ink/InkAnimeCard";
import InkEmptyState from "../components/ink/InkEmptyState";
import { InkGridSkeleton } from "../components/ink/InkSkeleton";
import FilterPanel from "../components/FilterPanel";
import { dedupeById } from "../utils/dedupe";
import { rankByRelevance, filterByRelevance } from "../utils/relevance";

// Filters kept in the URL so filtered views are shareable/back-button-safe
const FILTER_KEYS = [
  "q",
  "genres",
  "status",
  "type",
  "min_score",
  "year",
  "order_by",
];

// The chip row shows the most popular genres; more live in the filter panel
const CHIP_GENRE_COUNT = 11;

const Anime = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [animeList, setAnimeList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState(searchParams.get("q") || "");

  const filters = {};
  for (const key of FILTER_KEYS) {
    const value = searchParams.get(key);
    if (value) filters[key] = value;
  }
  const searchQuery = filters.q || "";
  const hasFilters = ["genres", "status", "type", "min_score", "year"].some(
    (key) => filters[key]
  );
  const isSearchMode = !!searchQuery || hasFilters;

  // Sort mode: "match" = relevance (default for text searches, no order_by so
  // Jikan best-match wins + we re-rank client-side), "score", or "members".
  // Filter-only browsing has no relevance to rank by, so it defaults to score.
  const sortMode =
    filters.order_by === "score"
      ? "score"
      : filters.order_by === "members"
      ? "members"
      : searchQuery
      ? "match"
      : "score";

  const { data: genresData } = useAnimeGenres();
  const chipGenres = React.useMemo(() => {
    const seen = new Set();
    return (genresData?.data || [])
      .filter((g) => {
        if (seen.has(g.mal_id)) return false;
        seen.add(g.mal_id);
        return true;
      })
      .slice(0, CHIP_GENRE_COUNT);
  }, [genresData]);

  // single-select chip == the only genre filter value
  const activeChipId =
    filters.genres && !filters.genres.includes(",")
      ? Number(filters.genres)
      : null;

  const searchOptions = {
    // omit order_by for "best match" so Jikan returns relevance-ranked results
    ...(sortMode === "match"
      ? {}
      : { order_by: sortMode, sort: "desc" }),
    genres: filters.genres,
    status: filters.status,
    type: filters.type,
    min_score: filters.min_score,
    start_date: filters.year ? `${filters.year}-01-01` : undefined,
    end_date: filters.year ? `${filters.year}-12-31` : undefined,
  };

  const {
    data: topAnimeData,
    isLoading: topAnimeLoading,
    error: topAnimeError,
  } = useQuery({
    queryKey: ["top-anime", currentPage],
    queryFn: () => getTopAnime(currentPage, 25),
    staleTime: 5 * 60 * 1000,
    enabled: !isSearchMode,
  });

  const {
    data: searchData,
    isLoading: searchLoading,
    error: searchError,
  } = useQuery({
    queryKey: ["search-anime", filters, currentPage],
    queryFn: () => searchAnime(searchQuery, currentPage, 25, searchOptions),
    staleTime: 2 * 60 * 1000,
    enabled: isSearchMode,
  });

  const currentData = isSearchMode ? searchData : topAnimeData;
  const isLoading = isSearchMode ? searchLoading : topAnimeLoading;
  const error = isSearchMode ? searchError : topAnimeError;
  const hasMore = currentData?.pagination?.has_next_page || false;

  useEffect(() => {
    if (!currentData?.data) return;
    if (currentPage === 1) {
      setAnimeList(dedupeById(currentData.data));
    } else {
      setAnimeList((prev) => dedupeById([...prev, ...currentData.data]));
    }
  }, [currentData, currentPage]);

  const updateParams = (patch) => {
    const next = {};
    for (const key of FILTER_KEYS) {
      const value = patch[key] !== undefined ? patch[key] : filters[key];
      if (value) next[key] = value;
    }
    setSearchParams(next);
    setCurrentPage(1);
    setAnimeList([]);
  };

  const submitSearch = (e) => {
    e.preventDefault();
    updateParams({ q: searchInput.trim() });
  };

  const toggleChip = (genreId) => {
    updateParams({
      genres: activeChipId === genreId ? "" : String(genreId),
    });
  };

  const loadMore = () => {
    if (hasMore && !isLoading) setCurrentPage((prev) => prev + 1);
  };

  // When searching, drop results that don't genuinely match the query so
  // "one punch man" never shows One Piece / Mob Psycho. In "best match" mode
  // also re-rank so the closest title leads; Score/Popularity keep their order.
  const displayList = React.useMemo(() => {
    if (!searchQuery) return animeList;
    return sortMode === "match"
      ? rankByRelevance(animeList, searchQuery)
      : filterByRelevance(animeList, searchQuery);
  }, [animeList, sortMode, searchQuery]);

  const sortOptions = [
    ...(searchQuery ? [["match", "BEST MATCH"]] : []),
    ["score", "SCORE"],
    ["members", "POPULARITY"],
  ];

  const showEmpty =
    !isLoading && !error && displayList.length === 0 && isSearchMode;

  return (
    <div className="animate-popIn px-6 pb-16 pt-10 md:px-[72px]">
      {/* Title + sort */}
      <div className="mb-2 flex flex-wrap items-center justify-between gap-4">
        <h1 className="ink-display m-0 text-4xl md:text-[44px]">
          Anime <span className="text-ink-red">Archive</span>
        </h1>
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-black tracking-[1px] text-ink-mut3">
            SORT
          </span>
          {sortOptions.map(([value, label]) => (
            <button
              key={value}
              onClick={() =>
                updateParams({ order_by: value === "match" ? "" : value })
              }
              className={`ink-btn px-4 py-2 text-xs transition-all duration-150 ${
                sortMode === value
                  ? "bg-ink text-ink-paper"
                  : "bg-ink-paper text-ink hover:bg-ink-red hover:text-ink-paper"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <p className="mb-5 text-[13.5px] font-medium text-ink-mut3">
        {isSearchMode
          ? "Filtered results from the archive"
          : "Top-rated series — covers live from the Jikan API"}
      </p>

      {/* Search */}
      <form
        onSubmit={submitSearch}
        className="mb-4 flex items-center gap-3.5"
      >
        <input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="SEARCH THE ARCHIVE..."
          className="ink-shadow-sm min-w-0 flex-1 border-[3px] border-ink bg-ink-paper px-4 py-3.5 font-body text-sm font-bold tracking-[1px] text-ink outline-none placeholder:text-ink-mut4"
        />
        <button
          type="submit"
          className="ink-display ink-shadow-sm rotate-2 cursor-pointer border-[3px] border-ink bg-ink-red px-4 py-3 text-sm text-ink-paper"
        >
          検索!
        </button>
      </form>

      {/* Genre chips */}
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={() => updateParams({ genres: "" })}
          className={`ink-btn px-3.5 py-[7px] text-[11.5px] transition-all duration-150 hover:bg-ink-red hover:text-ink-paper ${
            !filters.genres ? "bg-ink text-ink-paper" : "bg-ink-paper text-ink"
          }`}
        >
          ALL
        </button>
        {chipGenres.map((genre) => (
          <button
            key={genre.mal_id}
            onClick={() => toggleChip(genre.mal_id)}
            className={`ink-btn px-3.5 py-[7px] text-[11.5px] transition-all duration-150 hover:bg-ink-red hover:text-ink-paper ${
              activeChipId === genre.mal_id
                ? "bg-ink text-ink-paper"
                : "bg-ink-paper text-ink"
            }`}
          >
            {genre.name}
          </button>
        ))}
      </div>

      {/* Advanced filters */}
      <FilterPanel
        mediaType="anime"
        filters={filters}
        onChange={(next) => updateParams(next)}
        className="mb-8"
      />

      {/* Error */}
      {error && (
        <InkEmptyState
          shout="SIGNAL LOST!!"
          sub={error?.message || "The archive is unreachable. Try again."}
          ctaLabel="Retry"
          ctaTo="/anime"
        />
      )}

      {/* Grid */}
      {isLoading && animeList.length === 0 ? (
        <InkGridSkeleton count={8} />
      ) : (
        !showEmpty && (
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {displayList.map((anime) => (
              <InkAnimeCard key={anime.mal_id} anime={anime} />
            ))}
          </div>
        )
      )}

      {showEmpty && (
        <InkEmptyState
          shout="NANI?! NOTHING FOUND..."
          sub="Try a different search or clear the genre filter."
        />
      )}

      {/* Load more */}
      {animeList.length > 0 && hasMore && !showEmpty && (
        <div className="mt-12 text-center">
          <button
            onClick={loadMore}
            disabled={isLoading}
            className="ink-btn ink-press ink-sh-red bg-ink px-10 py-4 text-sm text-ink-paper disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? "LOADING..." : "LOAD MORE →"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Anime;
