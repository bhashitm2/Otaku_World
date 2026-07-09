// CharacterDetails — Nova: backdrop portrait, pulled-up detail layout,
// bio, appearance grids and voice actors. Mirrors the AnimeDetails layout.
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getCharacterDetails } from "../services/anime";
import { useAuth } from "../hooks/useAuth";
import { useFavorites } from "../hooks/useFavorites";
import {
  Cover,
  Button,
  MediaCard,
  EmptyState,
  Badge,
} from "../components/nova";
import { dedupeById } from "../utils/dedupe";

const Stat = ({ value, label }) => (
  <div className="rounded-lg border border-line bg-surface px-4 py-3 text-center sm:px-5">
    <div className="font-mono text-lg font-bold text-gold">{value}</div>
    <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-faint">
      {label}
    </div>
  </div>
);

const compact = (n) => {
  if (!n) return "0";
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${Math.round(n / 1000)}K`;
  return `${n}`;
};

const CharacterDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [tab, setTab] = useState("anime");

  const { data, isLoading, error } = useQuery({
    queryKey: ["character", "details", id],
    queryFn: () => getCharacterDetails(id),
    staleTime: 30 * 60 * 1000,
    enabled: !!id,
  });

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
          title="Character not found"
          sub={error?.message || "This character could not be loaded."}
          ctaLabel="Back to characters"
          ctaTo="/characters"
        />
      </div>
    );
  }

  const character = data.data;
  const image =
    character.images?.jpg?.image_url || character.images?.webp?.image_url;
  const animeRoles = character.anime || [];
  const mangaRoles = character.manga || [];
  const voices = character.voices || [];
  const nicknames = character.nicknames || [];

  const saveItem = {
    mal_id: character.mal_id,
    type: "character",
    title: character.name,
    name: character.name,
    image: image || "",
  };
  const faved = user && isFavorite(character.mal_id, "character");

  const tabs = [
    { id: "anime", label: `Anime (${animeRoles.length})` },
    ...(mangaRoles.length
      ? [{ id: "manga", label: `Manga (${mangaRoles.length})` }]
      : []),
    { id: "voices", label: `Voices (${voices.length})` },
  ];

  return (
    <div className="pb-20">
      {/* Backdrop (portrait art under a heavy scrim) */}
      <div className="relative -mt-nav h-[460px] overflow-hidden">
        <Cover src={image} alt="" imgClassName="object-top" />
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
          {/* Portrait column */}
          <div className="mx-auto w-full max-w-[260px] lg:mx-0">
            <div className="aspect-[2/3] overflow-hidden rounded-lg shadow-lg">
              <Cover src={image} alt={character.name} />
            </div>
            {user && (
              <Button
                size="sm"
                variant={faved ? "solid" : "subtle"}
                block
                className="mt-6"
                onClick={() => toggleFavorite(saveItem)}
              >
                ♥ {faved ? "Favorited" : "Favorite"}
              </Button>
            )}
          </div>

          {/* Details column */}
          <div>
            <div className="mb-2 font-body text-xs font-semibold uppercase tracking-[0.12em] text-gold">
              Character
            </div>
            <h1 className="m-0 font-display text-[34px] font-extrabold leading-tight tracking-tight text-text md:text-[42px]">
              {character.name}
            </h1>
            {character.name_kanji && (
              <div className="mt-2 font-body text-[15px] text-muted">
                {character.name_kanji}
              </div>
            )}

            {/* Stat strip */}
            <div className="my-6 flex flex-wrap gap-3.5">
              <Stat value={`♥ ${compact(character.favorites)}`} label="Fans" />
              <Stat value={animeRoles.length} label="Anime" />
              <Stat value={voices.length} label="Voices" />
            </div>

            {/* Nicknames */}
            {nicknames.length > 0 && (
              <div className="mb-6 flex flex-wrap gap-2">
                {nicknames.slice(0, 6).map((nick, i) => (
                  <span
                    key={i}
                    className="rounded-pill bg-surface-2 px-3.5 py-1.5 text-[12.5px] text-text"
                  >
                    {nick}
                  </span>
                ))}
              </div>
            )}

            {/* About */}
            {character.about && (
              <>
                <h2 className="mb-3 mt-8 font-display text-xl font-bold tracking-tight text-text">
                  About
                </h2>
                <p className="m-0 max-w-[620px] whitespace-pre-line text-[15px] leading-relaxed text-muted">
                  {character.about}
                </p>
              </>
            )}

            {/* Tabs */}
            <div className="mb-6 mt-9 flex flex-wrap gap-2">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`rounded-pill border px-4 py-2 font-body text-[13px] font-medium transition-colors duration-fast ${
                    tab === t.id
                      ? "border-gold bg-gold text-bg"
                      : "border-line bg-surface-2 text-muted hover:border-line-strong hover:text-text"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Anime appearances */}
            {tab === "anime" &&
              (animeRoles.length > 0 ? (
                <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
                  {dedupeById(
                    animeRoles.map((a) => ({ ...a.anime, _role: a.role }))
                  ).map((anime) => (
                    <div key={anime.mal_id} className="relative">
                      <MediaCard anime={anime} />
                      {anime._role && (
                        <span className="absolute right-2 top-2 z-docked">
                          <Badge variant="pill" size="sm">
                            {anime._role}
                          </Badge>
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="py-8 text-center text-sm text-faint">
                  No anime appearances on record.
                </p>
              ))}

            {/* Manga appearances */}
            {tab === "manga" && (
              <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
                {dedupeById(
                  mangaRoles.map((m) => ({ ...m.manga, _role: m.role }))
                ).map((manga) => (
                  <div key={manga.mal_id} className="relative">
                    <MediaCard anime={manga} mediaType="manga" />
                    {manga._role && (
                      <span className="absolute right-2 top-2 z-docked">
                        <Badge variant="pill" size="sm">
                          {manga._role}
                        </Badge>
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Voice actors */}
            {tab === "voices" &&
              (voices.length > 0 ? (
                <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                  {voices.map((voice, i) => (
                    <div
                      key={i}
                      className="grid grid-cols-[52px_1fr] items-center gap-4 rounded-lg border border-line bg-surface p-3"
                    >
                      <div className="h-[52px] w-[52px] overflow-hidden rounded-full border-2 border-line-strong">
                        <Cover
                          src={voice.person?.images?.jpg?.image_url}
                          alt={voice.person?.name}
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="font-display text-sm font-semibold text-text line-clamp-1">
                          {voice.person?.name}
                        </div>
                        <div className="mt-0.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-gold">
                          {voice.language}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="py-8 text-center text-sm text-faint">
                  No voice actor information available.
                </p>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterDetails;
