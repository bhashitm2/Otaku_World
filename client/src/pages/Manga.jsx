// Manga — "Ink & Impact": archive browse mirroring the Anime page
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getTopManga, searchManga, getMangaGenres } from "../services/anime";
import InkAnimeCard from "../components/ink/InkAnimeCard";
import InkEmptyState from "../components/ink/InkEmptyState";
import { InkGridSkeleton } from "../components/ink/InkSkeleton";
import FilterPanel from "../components/FilterPanel";
import { dedupeById } from "../utils/dedupe";
import { rankByRelevance } from "../utils/relevance";

const FILTER_KEYS = ["q", "genres", "status", "type", "min_score", "year"];
const CHIP_GENRE_COUNT = 10;

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

  // Re-rank text-search results so the closest title match leads
  const displayList = React.useMemo(
    () => (searchQuery ? rankByRelevance(mangaList, searchQuery) : mangaList),
    [mangaList, searchQuery]
  );

  const showEmpty =
    !isLoading && !error && mangaList.length === 0 && isSearchMode;

  return (
    <div className="animate-popIn px-6 pb-16 pt-10 md:px-[72px]">
      <h1 className="ink-display m-0 mb-2 text-4xl md:text-[44px]">
        Manga <span className="text-ink-red">Archive</span>
      </h1>
      <p className="mb-5 text-[13.5px] font-medium text-ink-mut3">
        {isSearchMode
          ? "Filtered results from the archive"
          : "Top-rated manga — covers live from the Jikan API"}
      </p>

      {/* Search */}
      <form onSubmit={submitSearch} className="mb-4 flex items-center gap-3.5">
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
        mediaType="manga"
        filters={filters}
        onChange={(next) => updateParams(next)}
        className="mb-8"
      />

      {error && (
        <InkEmptyState
          shout="SIGNAL LOST!!"
          sub={error?.message || "The archive is unreachable. Try again."}
          ctaLabel="Retry"
          ctaTo="/manga"
        />
      )}

      {isLoading && mangaList.length === 0 ? (
        <InkGridSkeleton count={8} />
      ) : (
        !showEmpty && (
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {displayList.map((manga) => (
              <InkAnimeCard
                key={manga.mal_id}
                anime={manga}
                mediaType="manga"
              />
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

      {mangaList.length > 0 && hasMore && !showEmpty && (
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

export default Manga;
