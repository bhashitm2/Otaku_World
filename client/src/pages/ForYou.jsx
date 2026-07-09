// ForYou — Nova: personalized recommendations from your favorites
import React from "react";
import { useNavigate } from "react-router-dom";
import { useForYouRecommendations } from "../hooks/useForYouRecommendations";
import { Cover, EmptyState, GridSkeleton, Badge } from "../components/nova";
import { getDisplayTitle } from "../utils/title";

const RecCard = ({ anime, onOpen }) => (
  <div onClick={onOpen} className="ow-lift cursor-pointer">
    <div className="relative aspect-[2/3] overflow-hidden rounded-md bg-surface-2 shadow">
      <Cover
        src={anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url}
        alt={getDisplayTitle(anime)}
      />
      {anime.score && (
        <span className="absolute right-2 top-2">
          <Badge variant="score" size="sm">★ {anime.score}</Badge>
        </span>
      )}
    </div>
    <div className="mt-2.5">
      <div className="overflow-hidden text-ellipsis whitespace-nowrap font-display text-[13.5px] font-semibold leading-snug text-text">
        {getDisplayTitle(anime)}
      </div>
      {anime.becauseOf && (
        <div className="mt-1 text-xs text-muted line-clamp-1">
          Because you liked <span className="text-gold">{anime.becauseOf}</span>
        </div>
      )}
    </div>
  </div>
);

const ForYou = () => {
  const navigate = useNavigate();
  const {
    data: recommendations,
    isLoading,
    error,
    hasSeeds,
    seeds,
  } = useForYouRecommendations();

  return (
    <div className="px-gutter pb-20 pt-10 lg:px-gutter-lg">
      <h1 className="m-0 mb-2 font-display text-[28px] font-extrabold tracking-tight text-text md:text-[34px]">
        For you
      </h1>
      <p className="mb-8 text-[14.5px] text-muted">
        {hasSeeds
          ? `Handpicked from ${seeds
              .slice(0, 2)
              .map((s) => s.title)
              .join(", ")}${seeds.length > 2 ? " and more" : ""}`
          : "Recommendations tailored to your taste"}
      </p>

      {!hasSeeds && !isLoading ? (
        <EmptyState
          title="Nothing to recommend yet"
          sub="Your picks are built from your favorites. Add a few and come back."
          ctaLabel="Browse anime"
          ctaTo="/anime"
        />
      ) : isLoading ? (
        <>
          <p className="mb-6 text-sm text-faint">
            Curating your picks… this can take a few seconds on first load.
          </p>
          <GridSkeleton count={12} />
        </>
      ) : error ? (
        <EmptyState
          glyph="⚠"
          title="Couldn't build recommendations"
          sub={error?.message || "Something went wrong. Try again later."}
        />
      ) : recommendations?.length > 0 ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-[26px] sm:grid-cols-[repeat(auto-fill,minmax(180px,1fr))]">
          {recommendations.map((anime) => (
            <RecCard
              key={anime.mal_id}
              anime={anime}
              onOpen={() => navigate(`/anime/${anime.mal_id}`)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="Nothing new right now"
          sub="Try favoriting a few more anime to widen your picks."
          ctaLabel="Browse anime"
          ctaTo="/anime"
        />
      )}
    </div>
  );
};

export default ForYou;
