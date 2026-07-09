// AnimeDetails — Nova: cinematic backdrop, poster pulled up over it,
// quiet stat strip, synopsis, cast, and "More like this".
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useAnimeDetails,
  useAnimeCharacters,
  useAnimeRecommendations,
} from "../hooks/useAnimeQueries";
import { formatAnimeData } from "../services/anime";
import { useAuth } from "../hooks/useAuth";
import { useFavorites } from "../hooks/useFavorites";
import { useWatchlist } from "../hooks/useWatchlist";
import { Cover, Button, MediaCard, EmptyState } from "../components/nova";

const Stat = ({ value, label }) => (
  <div className="rounded-lg border border-line bg-surface px-4 py-3 text-center sm:px-5">
    <div className="font-mono text-lg font-bold text-gold">{value}</div>
    <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-faint">
      {label}
    </div>
  </div>
);

const compact = (n) => {
  if (!n) return "—";
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${Math.round(n / 1000)}K`;
  return `${n}`;
};

const AnimeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isInWatchlist, toggleWatchlist } = useWatchlist();

  const { data, isLoading, error } = useAnimeDetails(id);
  const { data: charactersData } = useAnimeCharacters(id, !!data);
  const { data: recsData } = useAnimeRecommendations(id, !!data);

  if (isLoading) {
    return (
      <div className="pb-20">
        <div className="ow-shimmer -mt-nav h-[460px]" />
        <div className="relative z-docked -mt-[150px] px-gutter lg:px-gutter-lg">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[260px_1fr]">
            <div className="ow-shimmer mx-auto aspect-[2/3] w-full max-w-[260px] rounded-lg lg:mx-0" />
            <div className="space-y-5 pt-10">
              <div className="ow-shimmer h-10 w-3/4 rounded" />
              <div className="ow-shimmer h-5 w-1/2 rounded" />
              <div className="ow-shimmer h-28 w-full rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data?.data) {
    return (
      <div className="px-gutter pb-16 pt-9 lg:px-gutter-lg">
        <EmptyState
          glyph="⚠"
          title="Title not found"
          sub={error?.message || "This title could not be loaded."}
          ctaLabel="Back to browse"
          ctaTo="/anime"
        />
      </div>
    );
  }

  const anime = formatAnimeData(data.data);
  const raw = data.data;
  const cast = (charactersData?.data || []).slice(0, 8);
  const recommendations = (recsData?.data || []).slice(0, 6);

  const backdrop =
    raw.trailer?.images?.maximum_image_url ||
    raw.trailer?.images?.large_image_url ||
    anime.image;

  const saveItem = {
    mal_id: anime.id,
    type: "anime",
    title: anime.title,
    image: anime.image,
    genres: anime.genres,
    score: anime.score,
    status: anime.status,
    episodes: anime.episodes,
  };
  const faved = user && isFavorite(anime.id, "anime");
  const queued = user && isInWatchlist(anime.id, "anime");

  const isAiring = anime.status === "Currently Airing";
  const studio = anime.studios?.[0]?.name;

  return (
    <div className="pb-20">
      {/* Backdrop */}
      <div className="relative -mt-nav h-[460px] overflow-hidden">
        <Cover src={backdrop} alt="" imgClassName="object-top" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg via-bg/45 to-bg/10" />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="absolute left-gutter top-[84px] lg:left-gutter-lg"
        >
          ← Back
        </Button>
      </div>

      {/* Content pulled up over the backdrop */}
      <div className="relative z-docked -mt-[150px] px-gutter lg:px-gutter-lg">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[260px_1fr]">
          {/* Poster column */}
          <div className="mx-auto w-full max-w-[260px] lg:mx-0">
            <div className="aspect-[2/3] overflow-hidden rounded-lg shadow-lg">
              <Cover src={anime.image} alt={anime.title} />
            </div>
            {user && (
              <div className="mt-6 flex gap-3">
                <Button
                  size="sm"
                  variant={faved ? "solid" : "subtle"}
                  className="flex-1"
                  onClick={() => toggleFavorite(saveItem)}
                >
                  ♥ {faved ? "Favorited" : "Favorite"}
                </Button>
                <Button
                  size="sm"
                  variant="subtle"
                  className="flex-1"
                  onClick={() => toggleWatchlist(saveItem)}
                >
                  {queued ? "✓ In watchlist" : "＋ Watchlist"}
                </Button>
              </div>
            )}
          </div>

          {/* Details column */}
          <div>
            <div className="mb-2 font-body text-xs font-semibold uppercase tracking-[0.12em] text-gold">
              {[anime.type, anime.year, studio].filter(Boolean).join(" · ")}
            </div>
            <h1 className="m-0 font-display text-[34px] font-extrabold leading-tight tracking-tight text-text md:text-[42px]">
              {anime.title}
            </h1>
            {anime.titleJapanese && (
              <div className="mt-2 font-body text-[15px] text-muted">
                {anime.titleJapanese}
              </div>
            )}

            {/* Meta line */}
            <div className="mt-4 flex flex-wrap items-center gap-2.5 text-[13.5px] text-muted">
              {anime.score && (
                <span className="font-mono font-bold text-gold">
                  ★ {anime.score}
                </span>
              )}
              {anime.year && <span>{anime.year}</span>}
              {anime.episodes && <span>· {anime.episodes} ep</span>}
              {anime.status && (
                <span className={isAiring ? "font-semibold text-gold" : ""}>
                  · {anime.status}
                </span>
              )}
            </div>

            {/* Genres */}
            {anime.genres.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {anime.genres.map((genre) => (
                  <span
                    key={genre.mal_id}
                    className="rounded-pill bg-surface-2 px-3.5 py-1.5 text-[12.5px] text-text"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            {/* Stat strip */}
            <div className="my-6 flex flex-wrap gap-3.5">
              <Stat value={`★ ${anime.score || "—"}`} label="Score" />
              <Stat value={`#${anime.rank || "—"}`} label="Ranked" />
              <Stat value={compact(raw.members)} label="Members" />
              <Stat value={anime.episodes || "—"} label="Episodes" />
            </div>

            {/* Synopsis */}
            {anime.synopsis && (
              <>
                <h2 className="mb-3 mt-8 font-display text-xl font-bold tracking-tight text-text">
                  Synopsis
                </h2>
                <p className="m-0 max-w-[620px] text-[15px] leading-relaxed text-muted">
                  {anime.synopsis}
                </p>
              </>
            )}

            {/* Cast */}
            {cast.length > 0 && (
              <>
                <h2 className="mb-4 mt-9 font-display text-xl font-bold tracking-tight text-text">
                  Main cast
                </h2>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {cast.map(({ character, role }) => (
                    <div
                      key={character.mal_id}
                      onClick={() => navigate(`/characters/${character.mal_id}`)}
                      className="ow-lift cursor-pointer"
                    >
                      <div className="aspect-[3/4] overflow-hidden rounded-md bg-surface-2 shadow-sm">
                        <Cover
                          src={character.images?.jpg?.image_url}
                          alt={character.name}
                        />
                      </div>
                      <div className="mt-2">
                        <div className="font-display text-[13px] font-semibold text-text line-clamp-1">
                          {character.name}
                        </div>
                        <div className="mt-0.5 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-gold">
                          {role}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Recommendations */}
            {recommendations.length > 0 && (
              <>
                <h2 className="mb-4 mt-9 font-display text-xl font-bold tracking-tight text-text">
                  More like this
                </h2>
                <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
                  {recommendations.map((rec) => (
                    <MediaCard key={rec.entry.mal_id} anime={rec.entry} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimeDetails;
