// ForYou — "Ink & Impact": personalized recommendations from your favorites
import React from "react";
import { useNavigate } from "react-router-dom";
import { useForYouRecommendations } from "../hooks/useForYouRecommendations";
import InkCover from "../components/ink/InkCover";
import InkEmptyState from "../components/ink/InkEmptyState";
import { InkGridSkeleton } from "../components/ink/InkSkeleton";
import { getDisplayTitle } from "../utils/title";

const RecCard = ({ anime, onOpen }) => (
  <div
    onClick={onOpen}
    className="ink-card ink-press relative cursor-pointer"
  >
    {anime.score && (
      <div className="ink-display absolute -top-3 -left-2 z-[2] bg-ink px-2 py-[3px] text-[12px] text-ink-paper">
        ★ {anime.score}
      </div>
    )}
    <div className="h-60 border-b-[3px] border-ink">
      <InkCover
        src={anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url}
        alt={anime.title}
        className="h-full w-full"
      />
    </div>
    <div className="p-3 pb-4">
      <div className="ink-display text-[15px] leading-tight tracking-[.5px] line-clamp-2">
        {getDisplayTitle(anime)}
      </div>
      {anime.becauseOf && (
        <div className="mt-1.5 text-[10.5px] font-bold text-ink-mut3 line-clamp-1">
          Because you liked{" "}
          <span className="text-ink-red">{anime.becauseOf}</span>
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
    <div className="animate-popIn px-6 pb-16 pt-10 md:px-[72px]">
      <h1 className="ink-display m-0 mb-2 text-4xl md:text-[44px]">
        For <span className="text-ink-red">You</span>
      </h1>
      <p className="mb-8 text-[13.5px] font-medium text-ink-mut3">
        {hasSeeds
          ? `Handpicked from ${seeds
              .slice(0, 2)
              .map((s) => s.title)
              .join(", ")}${seeds.length > 2 ? " and more" : ""}`
          : "Recommendations tailored to your taste"}
      </p>

      {!hasSeeds && !isLoading ? (
        <InkEmptyState
          shout="FAVORITE SOMETHING FIRST!!"
          sub="Your picks are built from your favorites. Add a few and come back."
          ctaLabel="Browse Anime →"
          ctaTo="/anime"
        />
      ) : isLoading ? (
        <>
          <p className="mb-6 text-sm font-bold text-ink-mut3">
            Curating your picks… this can take a few seconds on first load.
          </p>
          <InkGridSkeleton count={12} />
        </>
      ) : error ? (
        <InkEmptyState
          shout="SIGNAL LOST!!"
          sub={error?.message || "Couldn't build recommendations."}
        />
      ) : recommendations?.length > 0 ? (
        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {recommendations.map((anime) => (
            <RecCard
              key={anime.mal_id}
              anime={anime}
              onOpen={() => navigate(`/anime/${anime.mal_id}`)}
            />
          ))}
        </div>
      ) : (
        <InkEmptyState
          shout="NOTHING NEW RIGHT NOW..."
          sub="Try favoriting a few more anime to widen your picks."
          ctaLabel="Browse Anime →"
          ctaTo="/anime"
        />
      )}
    </div>
  );
};

export default ForYou;
