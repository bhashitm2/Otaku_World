// Seasonal — Nova: This season / Upcoming tabs over a poster grid
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getCurrentSeason, getUpcomingSeason } from "../services/anime";
import {
  MediaCard,
  EmptyState,
  GridSkeleton,
  Button,
  Badge,
} from "../components/nova";
import { dedupeById } from "../utils/dedupe";

const getSeasonLabel = () => {
  const now = new Date();
  const month = now.getMonth() + 1;
  let season;
  if (month >= 3 && month <= 5) season = "Spring";
  else if (month >= 6 && month <= 8) season = "Summer";
  else if (month >= 9 && month <= 11) season = "Fall";
  else season = "Winter";
  return `${season} ${now.getFullYear()}`;
};

const TABS = [
  { key: "now", label: "This season" },
  { key: "upcoming", label: "Upcoming" },
];

const Seasonal = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") === "upcoming" ? "upcoming" : "now";

  const [animeList, setAnimeList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPage = (tab, page) =>
    tab === "upcoming" ? getUpcomingSeason(page) : getCurrentSeason(page);

  useEffect(() => {
    let cancelled = false;
    const loadFirst = async () => {
      setIsLoading(true);
      setError(null);
      setAnimeList([]);
      setCurrentPage(1);
      try {
        const response = await fetchPage(activeTab, 1);
        if (cancelled) return;
        setAnimeList(dedupeById(response?.data || []));
        setHasMore(response?.pagination?.has_next_page || false);
      } catch (err) {
        if (!cancelled) setError(err);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    loadFirst();
    return () => {
      cancelled = true;
    };
  }, [activeTab]);

  const switchTab = (tab) => {
    if (tab === activeTab) return;
    setSearchParams(tab === "upcoming" ? { tab: "upcoming" } : {});
  };

  const loadMore = async () => {
    if (!hasMore || isLoading) return;
    setIsLoading(true);
    try {
      const nextPage = currentPage + 1;
      const response = await fetchPage(activeTab, nextPage);
      const newItems = response?.data || [];
      setAnimeList((prev) => dedupeById([...prev, ...newItems]));
      setCurrentPage(nextPage);
      setHasMore(response?.pagination?.has_next_page || false);
    } catch (err) {
      console.error("Error loading more seasonal anime:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="px-gutter pb-20 pt-10 lg:px-gutter-lg">
      <div className="mb-2 flex flex-wrap items-center gap-3">
        <h1 className="m-0 font-display text-[28px] font-extrabold tracking-tight text-text md:text-[34px]">
          Seasonal anime
        </h1>
        {activeTab === "now" && (
          <Badge variant="outline" size="sm">
            {getSeasonLabel()}
          </Badge>
        )}
      </div>
      <p className="mb-6 text-[14.5px] text-muted">
        {activeTab === "upcoming"
          ? "What's coming next season"
          : "Airing right now, fresh from the studios"}
      </p>

      {/* Tabs */}
      <div className="mb-8 flex flex-wrap gap-2">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => switchTab(tab.key)}
            className={`rounded-pill border px-4 py-2 font-body text-[13px] font-medium transition-colors duration-fast ${
              activeTab === tab.key
                ? "border-gold bg-gold text-bg"
                : "border-line bg-surface-2 text-muted hover:border-line-strong hover:text-text"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {error ? (
        <EmptyState
          glyph="⚠"
          title="Couldn't load the season"
          sub={error?.message || "The season list is unreachable. Try again."}
          ctaLabel="Retry"
          ctaTo="/seasonal"
        />
      ) : isLoading && animeList.length === 0 ? (
        <GridSkeleton count={10} />
      ) : animeList.length === 0 ? (
        <EmptyState sub="Check back soon." />
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-[26px] sm:grid-cols-[repeat(auto-fill,minmax(180px,1fr))]">
          {animeList.map((anime) => (
            <MediaCard key={anime.mal_id} anime={anime} />
          ))}
        </div>
      )}

      {animeList.length > 0 && hasMore && (
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

export default Seasonal;
