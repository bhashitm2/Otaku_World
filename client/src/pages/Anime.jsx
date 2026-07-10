// Browse anime — Nova browse page with search, sort, genre chips
// and advanced filters, all synced to the URL.
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getTopAnime, searchAnime } from "../services/anime";
import { useAnimeGenres } from "../hooks/useAnimeQueries";
import { MediaCard, EmptyState, GridSkeleton, Button } from "../components/nova";
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
  // order_by counts as a filter: an explicit sort must go through the search
  // endpoint (which honors order_by). Without this, picking a sort in browse
  // mode cleared the list but left the cached top-anime query untouched, so
  // the refill effect never re-fired and the cards vanished.
  const hasFilters = [
    "genres",
    "status",
    "type",
    "min_score",
    "year",
    "order_by",
  ].some((key) => filters[key]);
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
    ...(searchQuery ? [["match", "Best match"]] : []),
    ["score", "Top rated"],
    ["members", "Most popular"],
  ];

  const showEmpty =
    !isLoading && !error && displayList.length === 0 && isSearchMode;

  return (
    <div className="px-gutter pb-20 pt-10 lg:px-gutter-lg">
      {/* Title + sort */}
      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-4">
        <h1 className="m-0 font-display text-[28px] font-extrabold tracking-tight text-text md:text-[34px]">
          Browse anime
        </h1>
        <div className="flex items-center gap-4">
          {sortOptions.map(([value, label]) => (
            <button
              key={value}
              onClick={() =>
                updateParams({ order_by: value === "match" ? "" : value })
              }
              className={`font-body text-sm transition-colors duration-fast ${
                sortMode === value
                  ? "font-semibold text-gold"
                  : "text-faint hover:text-text"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <p className="mb-6 text-[14.5px] text-muted">
        {isSearchMode
          ? "Filtered results from the library"
          : "Top-rated series, updated live"}
      </p>

      {/* Search */}
      <form onSubmit={submitSearch} className="mb-4 flex items-center gap-3">
        <div className="relative min-w-0 flex-1">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[15px] text-faint">
            ⌕
          </span>
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search anime…"
            className="w-full rounded-sm border border-line bg-surface-2 py-3 pl-10 pr-4 font-body text-sm text-text outline-none transition-colors duration-fast placeholder:text-faint focus:border-line-strong"
          />
        </div>
        <Button type="submit" size="sm">
          Search
        </Button>
      </form>

      {/* Genre chips */}
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={() => updateParams({ genres: "" })}
          className={`rounded-pill border px-3.5 py-1.5 font-body text-xs font-medium transition-colors duration-fast ${
            !filters.genres
              ? "border-gold bg-gold text-bg"
              : "border-line bg-surface-2 text-muted hover:border-line-strong hover:text-text"
          }`}
        >
          All
        </button>
        {chipGenres.map((genre) => (
          <button
            key={genre.mal_id}
            onClick={() => toggleChip(genre.mal_id)}
            className={`rounded-pill border px-3.5 py-1.5 font-body text-xs font-medium transition-colors duration-fast ${
              activeChipId === genre.mal_id
                ? "border-gold bg-gold text-bg"
                : "border-line bg-surface-2 text-muted hover:border-line-strong hover:text-text"
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
        <EmptyState
          glyph="⚠"
          title="Couldn't reach the library"
          sub={error?.message || "The library is unreachable. Try again."}
          ctaLabel="Retry"
          ctaTo="/anime"
        />
      )}

      {/* Grid */}
      {isLoading && animeList.length === 0 ? (
        <GridSkeleton count={10} />
      ) : (
        !showEmpty && (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-[26px] sm:grid-cols-[repeat(auto-fill,minmax(180px,1fr))]">
            {displayList.map((anime) => (
              <MediaCard key={anime.mal_id} anime={anime} />
            ))}
          </div>
        )
      )}

      {showEmpty && (
        <EmptyState
          title="Nothing matches that search"
          sub="Try a different title or clear a filter."
        />
      )}

      {/* Load more */}
      {animeList.length > 0 && hasMore && !showEmpty && (
        <div className="mt-12 text-center">
          <Button
            variant="subtle"
            size="lg"
            onClick={loadMore}
            disabled={isLoading}
          >
            {isLoading ? "Loading…" : "Load more"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default Anime;
