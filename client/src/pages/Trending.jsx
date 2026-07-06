// Trending — "Ink & Impact": power-ranking rows with score bars
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getTrendingAnime } from "../services/anime";
import InkCover from "../components/ink/InkCover";
import InkEmptyState from "../components/ink/InkEmptyState";
import { InkRowSkeleton } from "../components/ink/InkSkeleton";
import { dedupeById } from "../utils/dedupe";
import { getDisplayTitle } from "../utils/title";

const isoWeek = () => {
  const d = new Date();
  const firstJan = new Date(d.getFullYear(), 0, 1);
  const days = Math.floor((d - firstJan) / 86400000);
  return Math.ceil((days + firstJan.getDay() + 1) / 7);
};

const compact = (n) => {
  if (!n) return "0";
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${Math.round(n / 1000)}K`;
  return `${n}`;
};

const TrendingRow = ({ anime, rank, onOpen }) => {
  const score = anime.score;
  const barWidth = score ? `${(score / 10) * 100}%` : "0%";
  const isTop = rank === 1;

  return (
    <div
      onClick={onOpen}
      className="ink-card ink-press-redhov grid cursor-pointer grid-cols-[70px_72px_1fr_110px] items-stretch sm:grid-cols-[110px_92px_1fr_130px]"
    >
      <div
        className={`flex items-center justify-center border-r-[3px] border-ink font-display text-3xl sm:text-[44px] ${
          isTop ? "bg-ink-red text-ink-paper" : "bg-ink-paper text-ink"
        }`}
      >
        {rank}
      </div>
      <div className="border-r-[3px] border-ink">
        <InkCover
          src={
            anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url
          }
          alt={anime.title}
          className="h-full min-h-[92px] w-full"
        />
      </div>
      <div className="flex flex-col justify-center gap-2 px-4 py-3.5 sm:px-5">
        <div className="ink-display text-base leading-tight tracking-[.5px] line-clamp-1 sm:text-xl">
          {getDisplayTitle(anime)}
        </div>
        <div className="flex items-center gap-2.5">
          <div className="relative h-3 flex-1 border-2 border-ink bg-ink-bg">
            <div
              className="absolute inset-y-0 left-0 bg-ink-red"
              style={{ width: barWidth }}
            />
          </div>
          <span className="font-display text-[15px]">{score || "—"}</span>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center gap-0.5 border-l-[3px] border-ink bg-ink-bg">
        <span className="font-display text-base text-ink-red sm:text-[17px]">
          {compact(anime.members)}
        </span>
        <span className="text-[9px] font-black tracking-[1px] text-ink-mut3 sm:text-[9.5px]">
          MEMBERS
        </span>
      </div>
    </div>
  );
};

const Trending = () => {
  const navigate = useNavigate();
  const [allAnime, setAllAnime] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const {
    data: initialData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["trending-anime-initial"],
    queryFn: () => getTrendingAnime(1, 25),
    staleTime: 2 * 60 * 1000,
  });

  useEffect(() => {
    if (initialData?.data) {
      setAllAnime(dedupeById(initialData.data));
      setCurrentPage(1);
      setHasMore(initialData.pagination?.has_next_page || false);
    }
  }, [initialData]);

  const loadMore = async () => {
    if (!hasMore || loadingMore || isLoading) return;
    setLoadingMore(true);
    try {
      const nextPage = currentPage + 1;
      const response = await getTrendingAnime(nextPage, 25);
      if (response?.data) {
        setAllAnime((prev) => dedupeById([...prev, ...response.data]));
        setCurrentPage(nextPage);
        setHasMore(response.pagination?.has_next_page || false);
      }
    } catch (err) {
      console.error("Error loading more trending anime:", err);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <div className="animate-popIn px-6 pb-16 pt-10 md:px-[72px]">
      <div className="mb-2 flex flex-wrap items-center gap-4">
        <h1 className="ink-display m-0 text-4xl md:text-[44px]">
          Power <span className="text-ink-red">Rankings</span>
        </h1>
        <div className="ink-display -rotate-2 bg-ink px-3.5 py-1.5 text-[13px] tracking-[2px] text-ink-paper">
          WEEK {isoWeek()}
        </div>
      </div>
      <p className="mb-8 text-[13.5px] font-medium text-ink-mut3">
        Community score across this season. Winner takes the cover.
      </p>

      {error ? (
        <InkEmptyState
          shout="SIGNAL LOST!!"
          sub={error?.message || "Could not load the rankings."}
          ctaLabel="Retry"
          ctaTo="/trending"
        />
      ) : isLoading ? (
        <InkRowSkeleton count={6} />
      ) : (
        <div className="flex max-w-5xl flex-col gap-[18px]">
          {allAnime.map((anime, i) => (
            <TrendingRow
              key={anime.mal_id}
              anime={anime}
              rank={i + 1}
              onOpen={() => navigate(`/anime/${anime.mal_id}`)}
            />
          ))}
        </div>
      )}

      {allAnime.length > 0 && hasMore && (
        <div className="mt-12 max-w-5xl text-center">
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className="ink-btn ink-press ink-sh-red bg-ink px-10 py-4 text-sm text-ink-paper disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loadingMore ? "LOADING..." : "LOAD MORE →"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Trending;
