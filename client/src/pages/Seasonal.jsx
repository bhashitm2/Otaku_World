// Seasonal — "Ink & Impact": This Season / Upcoming tabs
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getCurrentSeason, getUpcomingSeason } from "../services/anime";
import InkAnimeCard from "../components/ink/InkAnimeCard";
import InkEmptyState from "../components/ink/InkEmptyState";
import { InkGridSkeleton } from "../components/ink/InkSkeleton";
import { dedupeById } from "../utils/dedupe";

const getSeasonLabel = () => {
  const now = new Date();
  const month = now.getMonth() + 1;
  let season;
  if (month >= 3 && month <= 5) season = "SPRING";
  else if (month >= 6 && month <= 8) season = "SUMMER";
  else if (month >= 9 && month <= 11) season = "FALL";
  else season = "WINTER";
  return `${season} ${now.getFullYear()}`;
};

const TABS = [
  { key: "now", label: "This Season" },
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
    <div className="animate-popIn px-6 pb-16 pt-10 md:px-[72px]">
      <div className="mb-2 flex flex-wrap items-center gap-4">
        <h1 className="ink-display m-0 text-4xl md:text-[44px]">
          Seasonal <span className="text-ink-red">Anime</span>
        </h1>
        {activeTab === "now" && (
          <div className="ink-display -rotate-2 bg-ink px-3.5 py-1.5 text-[13px] tracking-[2px] text-ink-paper">
            {getSeasonLabel()}
          </div>
        )}
      </div>
      <p className="mb-6 text-[13.5px] font-medium text-ink-mut3">
        {activeTab === "upcoming"
          ? "What's coming next season"
          : "Airing right now — fresh from the studios"}
      </p>

      {/* Tabs */}
      <div className="mb-8 flex flex-wrap gap-2">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => switchTab(tab.key)}
            className={`ink-btn px-5 py-2.5 text-xs transition-all duration-150 hover:bg-ink-red hover:text-ink-paper ${
              activeTab === tab.key
                ? "bg-ink text-ink-paper"
                : "bg-ink-paper text-ink"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {error ? (
        <InkEmptyState
          shout="SIGNAL LOST!!"
          sub={error?.message || "Could not load the season."}
          ctaLabel="Retry"
          ctaTo="/seasonal"
        />
      ) : isLoading && animeList.length === 0 ? (
        <InkGridSkeleton count={8} />
      ) : animeList.length === 0 ? (
        <InkEmptyState shout="NOTHING HERE YET..." sub="Check back soon." />
      ) : (
        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {animeList.map((anime) => (
            <InkAnimeCard key={anime.mal_id} anime={anime} />
          ))}
        </div>
      )}

      {animeList.length > 0 && hasMore && (
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

export default Seasonal;
