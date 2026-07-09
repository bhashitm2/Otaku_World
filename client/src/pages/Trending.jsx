// Trending — Nova: ranked list rows, big rank numerals, gold for the top 3
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getTrendingAnime } from "../services/anime";
import { Cover, EmptyState, RowSkeleton, Button, Badge } from "../components/nova";
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
  const genres = (anime.genres || [])
    .slice(0, 3)
    .map((g) => (typeof g === "string" ? g : g.name))
    .join(" · ");

  return (
    <div
      onClick={onOpen}
      className="grid cursor-pointer grid-cols-[44px_52px_1fr_auto] items-center gap-4 rounded-lg border border-line bg-surface p-3 transition-colors duration-fast hover:bg-surface-2 sm:grid-cols-[64px_60px_1fr_auto] sm:gap-5"
    >
      <div
        className={`text-center font-display text-[26px] font-extrabold sm:text-[34px] ${
          rank <= 3 ? "text-gold" : "text-faint"
        }`}
      >
        {rank}
      </div>
      <div className="aspect-[2/3] overflow-hidden rounded-sm">
        <Cover
          src={
            anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url
          }
          alt={getDisplayTitle(anime)}
        />
      </div>
      <div className="min-w-0">
        <div className="font-display text-[15px] font-semibold text-text line-clamp-1 sm:text-base">
          {getDisplayTitle(anime)}
        </div>
        <div className="mt-1 text-[12.5px] text-muted line-clamp-1">
          {[genres, anime.year].filter(Boolean).join(" · ")}
        </div>
      </div>
      <div className="pr-1 text-right">
        <div className="font-mono text-[14.5px] font-bold text-gold">
          ★ {anime.score || "—"}
        </div>
        <div className="mt-0.5 text-[11.5px] text-faint">
          {compact(anime.members)} members
        </div>
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
    <div className="px-gutter pb-20 pt-10 lg:px-gutter-lg">
      <div className="mb-2 flex flex-wrap items-center gap-3">
        <h1 className="m-0 font-display text-[28px] font-extrabold tracking-tight text-text md:text-[34px]">
          Trending this week
        </h1>
        <Badge variant="outline" size="sm" className="font-mono">
          Week {isoWeek()}
        </Badge>
      </div>
      <p className="mb-8 text-[14.5px] text-muted">
        Ranked by the community — who's watching what right now
      </p>

      {error ? (
        <EmptyState
          glyph="⚠"
          title="Couldn't load the rankings"
          sub={error?.message || "The rankings are unreachable. Try again."}
          ctaLabel="Retry"
          ctaTo="/trending"
        />
      ) : isLoading ? (
        <RowSkeleton count={8} />
      ) : (
        <div className="flex max-w-[900px] flex-col gap-3.5">
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
        <div className="mt-12 max-w-[900px] text-center">
          <Button
            variant="subtle"
            size="lg"
            onClick={loadMore}
            disabled={loadingMore}
          >
            {loadingMore ? "Loading…" : "Load more"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default Trending;
