// MangaDetails — Nova: cinematic backdrop, poster pulled up over it,
// quiet stat strip, synopsis, cast, and "More like this".
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useMangaDetails,
  useMangaCharacters,
  useMangaRecommendations,
} from "../hooks/useAnimeQueries";
import { formatMangaData } from "../services/anime";
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
          sub={error?.message || "This manga could not be loaded."}
          ctaLabel="Back to browse"
          ctaTo="/manga"
        />
      </div>
    );
  }

  const manga = formatMangaData(data.data);
  const cast = (charactersData?.data || []).slice(0, 8);
  const recommendations = (recsData?.data || []).slice(0, 6);

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
    <div className="pb-20">
      {/* Backdrop (manga has no trailer stills — the poster under heavy scrims) */}
      <div className="relative -mt-nav h-[460px] overflow-hidden">
        <Cover src={manga.image} alt="" imgClassName="object-top" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg via-bg/60 to-bg/20" />
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
              <Cover src={manga.image} alt={manga.title} />
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
              {[manga.type, manga.year, author].filter(Boolean).join(" · ")}
            </div>
            <h1 className="m-0 font-display text-[34px] font-extrabold leading-tight tracking-tight text-text md:text-[42px]">
              {manga.title}
            </h1>
            {manga.titleJapanese && (
              <div className="mt-2 font-body text-[15px] text-muted">
                {manga.titleJapanese}
              </div>
            )}

            {/* Meta line */}
            <div className="mt-4 flex flex-wrap items-center gap-2.5 text-[13.5px] text-muted">
              {manga.score && (
                <span className="font-mono font-bold text-gold">
                  ★ {manga.score}
                </span>
              )}
              {manga.year && <span>{manga.year}</span>}
              {manga.chapters && <span>· {manga.chapters} ch</span>}
              {manga.status && (
                <span className={isPublishing ? "font-semibold text-gold" : ""}>
                  · {manga.status}
                </span>
              )}
            </div>

            {/* Genres */}
            {manga.genres.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {manga.genres.map((genre) => (
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
              <Stat value={`★ ${manga.score || "—"}`} label="Score" />
              <Stat value={`#${manga.rank || "—"}`} label="Ranked" />
              <Stat value={manga.chapters || "—"} label="Chapters" />
              <Stat value={manga.volumes || "—"} label="Volumes" />
            </div>

            {/* Synopsis */}
            {manga.synopsis && (
              <>
                <h2 className="mb-3 mt-8 font-display text-xl font-bold tracking-tight text-text">
                  Synopsis
                </h2>
                <p className="m-0 max-w-[620px] text-[15px] leading-relaxed text-muted">
                  {manga.synopsis}
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
                        {role && (
                          <div className="mt-0.5 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-gold">
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
                <h2 className="mb-4 mt-9 font-display text-xl font-bold tracking-tight text-text">
                  More like this
                </h2>
                <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
                  {recommendations.map((rec) => (
                    <MediaCard
                      key={rec.entry.mal_id}
                      anime={rec.entry}
                      mediaType="manga"
                    />
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

export default MangaDetails;
