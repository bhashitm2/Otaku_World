// Browse manga — Nova browse page mirroring the Anime page
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getTopManga, searchManga, getMangaGenres } from "../services/anime";
import { MediaCard, EmptyState, GridSkeleton, Button } from "../components/nova";
import FilterPanel from "../components/FilterPanel";
import { dedupeById } from "../utils/dedupe";
import { rankByRelevance } from "../utils/relevance";

const FILTER_KEYS = ["q", "genres", "status", "type", "min_score", "year"];
const CHIP_GENRE_COUNT = 10;

const chipClass = (active) =>
  `rounded-pill border px-3.5 py-1.5 font-body text-xs font-medium transition-colors duration-fast ${
    active
      ? "border-gold bg-gold text-bg"
      : "border-line bg-surface-2 text-muted hover:border-line-strong hover:text-text"
  }`;

const Manga = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [mangaList, setMangaList] = useState([]);
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

  const { data: genresData } = useQuery({
    queryKey: ["manga", "genres"],
    queryFn: getMangaGenres,
    staleTime: 24 * 60 * 60 * 1000,
  });
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

  const activeChipId =
    filters.genres && !filters.genres.includes(",")
      ? Number(filters.genres)
      : null;

  // Text searches use relevance (no order_by) + client re-rank; filter-only
  // browsing sorts by score since there's no query to rank against.
  const searchOptions = {
    ...(searchQuery ? {} : { order_by: "score", sort: "desc" }),
    genres: filters.genres,
    status: filters.status,
    type: filters.type,
    min_score: filters.min_score,
    start_date: filters.year ? `${filters.year}-01-01` : undefined,
    end_date: filters.year ? `${filters.year}-12-31` : undefined,
  };

  const {
    data: topData,
    isLoading: topLoading,
    error: topError,
  } = useQuery({
    queryKey: ["top-manga", currentPage],
    queryFn: () => getTopManga(currentPage, 25),
    staleTime: 5 * 60 * 1000,
    enabled: !isSearchMode,
  });

  const {
    data: searchData,
    isLoading: searchLoading,
    error: searchError,
  } = useQuery({
    queryKey: ["search-manga", filters, currentPage],
    queryFn: () => searchManga(searchQuery, currentPage, 25, searchOptions),
    staleTime: 2 * 60 * 1000,
    enabled: isSearchMode,
  });

  const currentData = isSearchMode ? searchData : topData;
  const isLoading = isSearchMode ? searchLoading : topLoading;
  const error = isSearchMode ? searchError : topError;
  const hasMore = currentData?.pagination?.has_next_page || false;

  useEffect(() => {
    if (!currentData?.data) return;
    if (currentPage === 1) {
      setMangaList(dedupeById(currentData.data));
    } else {
      setMangaList((prev) => dedupeById([...prev, ...currentData.data]));
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
    setMangaList([]);
  };

  const submitSearch = (e) => {
    e.preventDefault();
    updateParams({ q: searchInput.trim() });
  };

  const toggleChip = (genreId) => {
    updateParams({ genres: activeChipId === genreId ? "" : String(genreId) });
  };

  const loadMore = () => {
    if (hasMore && !isLoading) setCurrentPage((prev) => prev + 1);
  };

  // Filter to genuine matches + re-rank so the closest title match leads
  const displayList = React.useMemo(
    () => (searchQuery ? rankByRelevance(mangaList, searchQuery) : mangaList),
    [mangaList, searchQuery]
  );

  const showEmpty =
    !isLoading && !error && displayList.length === 0 && isSearchMode;

  return (
    <div className="px-gutter pb-20 pt-10 lg:px-gutter-lg">
      <h1 className="m-0 mb-2 font-display text-[28px] font-extrabold tracking-tight text-text md:text-[34px]">
        Browse manga
      </h1>
      <p className="mb-6 text-[14.5px] text-muted">
        {isSearchMode
          ? "Filtered results from the library"
          : "Top-rated manga, updated live"}
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
            placeholder="Search manga…"
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
          className={chipClass(!filters.genres)}
        >
          All
        </button>
        {chipGenres.map((genre) => (
          <button
            key={genre.mal_id}
            onClick={() => toggleChip(genre.mal_id)}
            className={chipClass(activeChipId === genre.mal_id)}
          >
            {genre.name}
          </button>
        ))}
      </div>

      {/* Advanced filters */}
      <FilterPanel
        mediaType="manga"
        filters={filters}
        onChange={(next) => updateParams(next)}
        className="mb-8"
      />

      {error && (
        <EmptyState
          glyph="⚠"
          title="Couldn't reach the library"
          sub={error?.message || "The library is unreachable. Try again."}
          ctaLabel="Retry"
          ctaTo="/manga"
        />
      )}

      {isLoading && mangaList.length === 0 ? (
        <GridSkeleton count={10} />
      ) : (
        !showEmpty && (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-[26px] sm:grid-cols-[repeat(auto-fill,minmax(180px,1fr))]">
            {displayList.map((manga) => (
              <MediaCard key={manga.mal_id} anime={manga} mediaType="manga" />
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

      {mangaList.length > 0 && hasMore && !showEmpty && (
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

export default Manga;
