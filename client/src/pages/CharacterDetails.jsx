// CharacterDetails — "Ink & Impact": poster + stat blocks + bio panel +
// anime appearances + voice actors. Mirrors the AnimeDetails layout.
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getCharacterDetails } from "../services/anime";
import { useAuth } from "../hooks/useAuth";
import { useFavorites } from "../hooks/useFavorites";
import InkCover from "../components/ink/InkCover";
import InkAnimeCard from "../components/ink/InkAnimeCard";
import InkEmptyState from "../components/ink/InkEmptyState";
import { dedupeById } from "../utils/dedupe";

const StatBlock = ({ value, label }) => (
  <div className="ink-card ink-shadow-sm px-4 py-3 text-center sm:px-5">
    <div className="font-display text-2xl sm:text-[26px]">{value}</div>
    <div className="mt-0.5 text-[10px] font-black tracking-[1px] text-ink-mut3">
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
          sub={error?.message || "This character could not be loaded."}
          ctaLabel="Back to files →"
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
          {character.favorites > 0 && (
            <div className="ink-display absolute -top-4 -left-3 z-[2] border-[3px] border-ink bg-ink-red px-3 py-0.5 text-lg text-ink-paper">
              ♥ {compact(character.favorites)}
            </div>
          )}
          <div className="relative h-[460px] border-[3px] border-ink ink-shadow-lg">
            <InkCover
              src={image}
              alt={character.name}
              className="h-full w-full"
            />
          </div>
          {user && (
            <button
              onClick={() => toggleFavorite(saveItem)}
              className={`ink-btn ink-press-sm mt-6 w-full px-2.5 py-3.5 text-[12.5px] ${
                faved ? "bg-ink-red text-ink-paper" : "bg-ink-paper text-ink"
              }`}
            >
              ♥ {faved ? "FAVED" : "ADD TO FAVES"}
            </button>
          )}
        </div>

        {/* Details column */}
        <div>
          <div className="ink-display mb-4 inline-block -rotate-1 bg-ink px-3 py-1.5 text-xs tracking-[3px] text-ink-paper">
            CHARACTER FILE
          </div>
          <h1 className="ink-display m-0 text-4xl leading-[.98] md:text-[62px]">
            {character.name}
          </h1>
          {character.name_kanji && (
            <div className="mt-2.5 font-jp text-base font-bold tracking-[4px] text-ink-mut4">
              {character.name_kanji}
            </div>
          )}

          {/* Stat blocks */}
          <div className="my-6 flex flex-wrap gap-3.5">
            <StatBlock value={`♥ ${compact(character.favorites)}`} label="FANS" />
            <StatBlock value={animeRoles.length} label="ANIME" />
            <StatBlock value={voices.length} label="VOICES" />
          </div>

          {/* Nicknames */}
          {nicknames.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-2">
              {nicknames.slice(0, 6).map((nick, i) => (
                <span
                  key={i}
                  className="border-[3px] border-ink bg-ink-bg px-3 py-1.5 text-[11px] font-black uppercase tracking-[1px]"
                >
                  {nick}
                </span>
              ))}
            </div>
          )}

          {/* About panel */}
          {character.about && (
            <div className="ink-card ink-shadow relative px-6 py-6">
              <div className="ink-display absolute -top-3.5 left-4 border-[3px] border-ink bg-ink-red px-3 py-0.5 text-[13px] tracking-[2px] text-ink-paper">
                THE FILE
              </div>
              <p className="m-0 mt-1.5 whitespace-pre-line text-[15px] font-medium leading-[1.8] text-ink-body">
                {character.about}
              </p>
            </div>
          )}

          {/* Tabs */}
          <div className="mb-6 mt-9 flex flex-wrap gap-2">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`ink-btn px-4 py-2 text-xs transition-all duration-150 hover:bg-ink-red hover:text-ink-paper ${
                  tab === t.id
                    ? "bg-ink text-ink-paper"
                    : "bg-ink-paper text-ink"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Anime appearances */}
          {tab === "anime" &&
            (animeRoles.length > 0 ? (
              <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
                {dedupeById(
                  animeRoles.map((a) => ({ ...a.anime, _role: a.role }))
                ).map((anime) => (
                  <div key={anime.mal_id} className="relative">
                    <InkAnimeCard anime={anime} />
                    {anime._role && (
                      <div className="ink-display absolute -bottom-2 -right-2 z-[3] border-[3px] border-ink bg-ink px-2 py-0.5 text-[10px] tracking-[1px] text-ink-paper">
                        {anime._role}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-8 text-center text-sm font-bold text-ink-mut3">
                No anime appearances on record.
              </p>
            ))}

          {/* Manga appearances */}
          {tab === "manga" && (
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
              {dedupeById(
                mangaRoles.map((m) => ({ ...m.manga, _role: m.role }))
              ).map((manga) => (
                <div key={manga.mal_id} className="relative">
                  <InkAnimeCard anime={manga} mediaType="manga" />
                  {manga._role && (
                    <div className="ink-display absolute -bottom-2 -right-2 z-[3] border-[3px] border-ink bg-ink px-2 py-0.5 text-[10px] tracking-[1px] text-ink-paper">
                      {manga._role}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Voice actors */}
          {tab === "voices" &&
            (voices.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {voices.map((voice, i) => (
                  <div
                    key={i}
                    className="ink-card ink-shadow-sm grid grid-cols-[64px_1fr] items-stretch"
                  >
                    <div className="border-r-[3px] border-ink">
                      <InkCover
                        src={voice.person?.images?.jpg?.image_url}
                        alt={voice.person?.name}
                        className="h-full min-h-[80px] w-full"
                      />
                    </div>
                    <div className="flex flex-col justify-center gap-1 p-3">
                      <div className="ink-display text-sm line-clamp-1">
                        {voice.person?.name}
                      </div>
                      <div className="text-[11px] font-black uppercase tracking-[1px] text-ink-red">
                        {voice.language}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-8 text-center text-sm font-bold text-ink-mut3">
                No voice actor information available.
              </p>
            ))}
        </div>
      </div>
    </div>
  );
};

export default CharacterDetails;
