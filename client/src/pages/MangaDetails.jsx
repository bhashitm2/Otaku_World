// MangaDetails — "Ink & Impact": poster + stat blocks + story panel + cast
import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  useMangaDetails,
  useMangaCharacters,
  useMangaRecommendations,
} from "../hooks/useAnimeQueries";
import { formatMangaData } from "../services/anime";
import { useAuth } from "../hooks/useAuth";
import { useFavorites } from "../hooks/useFavorites";
import { useWatchlist } from "../hooks/useWatchlist";
import InkCover from "../components/ink/InkCover";
import InkEmptyState from "../components/ink/InkEmptyState";
import { getDisplayTitle } from "../utils/title";

const StatBlock = ({ value, label }) => (
  <div className="ink-card ink-shadow-sm px-4 py-3 text-center sm:px-5">
    <div className="font-display text-2xl sm:text-[26px]">{value}</div>
    <div className="mt-0.5 text-[10px] font-black tracking-[1px] text-ink-mut3">
      {label}
    </div>
  </div>
);

const MangaDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isInWatchlist, toggleWatchlist } = useWatchlist();

  const { data, isLoading, error } = useMangaDetails(id);
  const { data: charactersData } = useMangaCharacters(id, !!data);
  const { data: recsData } = useMangaRecommendations(id, !!data);

  if (isLoading) {
    return (
      <div className="animate-pulse px-6 pb-16 pt-9 md:px-[72px]">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[340px_1fr]">
          <div className="ink-stripes h-[460px] border-[3px] border-ink" />
          <div className="space-y-5">
            <div className="h-14 w-3/4 bg-ink-stripe2" />
            <div className="h-6 w-1/2 bg-ink-stripe2" />
            <div className="h-32 w-full bg-ink-stripe2" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !data?.data) {
    return (
      <div className="px-6 pb-16 pt-9 md:px-[72px]">
        <InkEmptyState
          shout="NANI?! NOT FOUND..."
          sub={error?.message || "This manga could not be loaded."}
          ctaLabel="Back to archive →"
          ctaTo="/manga"
        />
      </div>
    );
  }

  const manga = formatMangaData(data.data);
  const cast = (charactersData?.data || []).slice(0, 8);
  const recommendations = (recsData?.data || []).slice(0, 4);

  const saveItem = {
    mal_id: manga.id,
    type: "manga",
    title: manga.title,
    image: manga.image,
    genres: manga.genres,
    score: manga.score,
    status: manga.status,
    chapters: manga.chapters,
    volumes: manga.volumes,
  };
  const faved = user && isFavorite(manga.id, "manga");
  const queued = user && isInWatchlist(manga.id, "manga");

  const isPublishing = manga.status === "Publishing";
  const author = manga.authors?.[0]?.name;

  return (
    <div className="animate-popIn px-6 pb-16 pt-9 md:px-[72px]">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 inline-block cursor-pointer border-b-[3px] border-ink-red text-[12.5px] font-black uppercase tracking-[1px] text-ink"
      >
        ← Back
      </button>

      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[340px_1fr]">
        {/* Poster column */}
        <div className="relative mx-auto w-full max-w-[340px] lg:mx-0">
          {manga.rank && (
            <div className="ink-display absolute -top-4 -left-3 z-[2] border-[3px] border-ink bg-ink-red px-3 py-0.5 text-xl text-ink-paper">
              RANK #{manga.rank}
            </div>
          )}
          <div className="relative h-[460px] border-[3px] border-ink ink-shadow-lg">
            <InkCover
              src={manga.image}
              alt={manga.title}
              className="h-full w-full"
            />
          </div>
          {user && (
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => toggleFavorite(saveItem)}
                className={`ink-btn ink-press-sm flex-1 px-2.5 py-3.5 text-[12.5px] ${
                  faved ? "bg-ink-red text-ink-paper" : "bg-ink-paper text-ink"
                }`}
              >
                ♥ {faved ? "FAVED" : "FAVE"}
              </button>
              <button
                onClick={() => toggleWatchlist(saveItem)}
                className={`ink-btn ink-press-sm flex-1 px-2.5 py-3.5 text-[12.5px] ${
                  queued ? "bg-ink text-ink-paper" : "bg-ink-paper text-ink"
                }`}
              >
                + {queued ? "QUEUED" : "READLIST"}
              </button>
            </div>
          )}
        </div>

        {/* Details column */}
        <div>
          <div className="ink-display mb-4 inline-block -rotate-1 bg-ink px-3 py-1.5 text-xs tracking-[3px] text-ink-paper">
            {[manga.type, manga.year, author].filter(Boolean).join(" · ")}
          </div>
          <h1 className="ink-display m-0 text-4xl leading-[.98] md:text-[62px]">
            {manga.title}
          </h1>
          {manga.titleJapanese && (
            <div className="mt-2.5 font-jp text-base font-bold tracking-[4px] text-ink-mut4">
              {manga.titleJapanese}
            </div>
          )}

          {/* Stat blocks */}
          <div className="my-6 flex flex-wrap gap-3.5">
            <StatBlock value={`★ ${manga.score || "—"}`} label="SCORE" />
            <StatBlock value={`#${manga.rank || "—"}`} label="RANKED" />
            <StatBlock value={manga.chapters || "—"} label="CHAPTERS" />
            <StatBlock value={manga.volumes || "—"} label="VOLUMES" />
          </div>

          {/* Genres + status */}
          <div className="mb-6 flex flex-wrap gap-2">
            {manga.genres.map((genre) => (
              <span
                key={genre.mal_id}
                className="border-[3px] border-ink bg-ink-bg px-3 py-1.5 text-[11px] font-black uppercase tracking-[1px]"
              >
                {genre.name}
              </span>
            ))}
            {manga.status && (
              <span
                className={`border-[3px] border-ink px-3 py-1.5 text-[11px] font-black uppercase tracking-[1px] ${
                  isPublishing
                    ? "bg-ink-red text-ink-paper"
                    : "bg-ink-bg text-ink"
                }`}
              >
                {manga.status}
              </span>
            )}
          </div>

          {/* Story panel */}
          {manga.synopsis && (
            <div className="ink-card ink-shadow relative px-6 py-6">
              <div className="ink-display absolute -top-3.5 left-4 border-[3px] border-ink bg-ink-red px-3 py-0.5 text-[13px] tracking-[2px] text-ink-paper">
                THE STORY SO FAR
              </div>
              <p className="m-0 mt-1.5 text-[15px] font-medium leading-[1.8] text-ink-body">
                {manga.synopsis}
              </p>
            </div>
          )}

          {/* Cast */}
          {cast.length > 0 && (
            <>
              <h3 className="ink-display mb-4 mt-9 text-2xl">
                Main <span className="text-ink-red">cast</span>
              </h3>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {cast.map(({ character, role }) => (
                  <div
                    key={character.mal_id}
                    onClick={() => navigate(`/characters/${character.mal_id}`)}
                    className="ink-card ink-press-sm cursor-pointer"
                  >
                    <div className="h-28 border-b-[3px] border-ink">
                      <InkCover
                        src={character.images?.jpg?.image_url}
                        alt={character.name}
                        className="h-full w-full"
                      />
                    </div>
                    <div className="p-3">
                      <div className="ink-display text-[13.5px] line-clamp-1">
                        {character.name}
                      </div>
                      {role && (
                        <div className="mt-1 text-[10.5px] font-black uppercase tracking-[1px] text-ink-red">
                          {role}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <>
              <h3 className="ink-display mb-4 mt-9 text-2xl">
                You might also <span className="text-ink-red">like</span>
              </h3>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {recommendations.map((rec) => (
                  <Link
                    key={rec.entry.mal_id}
                    to={`/manga/${rec.entry.mal_id}`}
                    className="ink-card ink-press-sm block"
                  >
                    <div className="h-40 border-b-[3px] border-ink">
                      <InkCover
                        src={rec.entry.images?.jpg?.image_url}
                        alt={rec.entry.title}
                        className="h-full w-full"
                      />
                    </div>
                    <div className="p-3">
                      <div className="ink-display text-[13px] line-clamp-2">
                        {getDisplayTitle(rec.entry)}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MangaDetails;
