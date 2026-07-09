// Favorites — Nova: poster grid with type tabs
import React, { useState } from "react";
import { useFavorites } from "../hooks/useFavorites";
import { useAuth } from "../hooks/useAuth";
import {
  MediaCard,
  CharacterCard,
  EmptyState,
  GridSkeleton,
} from "../components/nova";

// Rehydrate a stored favorite into the shape the cards expect
const toCardItem = (item) => ({
  mal_id: item.itemId,
  title: item.title,
  name: item.title,
  images: { jpg: { image_url: item.image, large_image_url: item.image } },
  image: item.image,
  score: item.score,
  status: item.status,
  genres: item.genres,
  episodes: item.episodes,
  chapters: item.chapters,
  type: item.type,
});

const Favorites = () => {
  const { user } = useAuth();
  const {
    favorites,
    favoriteAnime,
    favoriteManga,
    favoriteCharacters,
    totalFavorites,
    loading,
    error,
  } = useFavorites();
  const [activeTab, setActiveTab] = useState("all");

  if (!user) {
    return (
      <div className="px-gutter pb-20 pt-10 lg:px-gutter-lg">
        <EmptyState
          title="Sign in to keep favorites"
          sub="Your favorites sync across every device once you're signed in."
          ctaLabel="Sign in"
          ctaTo="/login"
        />
      </div>
    );
  }

  const tabs = [
    { id: "all", label: "All", count: totalFavorites },
    { id: "anime", label: "Anime", count: favoriteAnime.length },
    { id: "manga", label: "Manga", count: favoriteManga.length },
    { id: "characters", label: "Characters", count: favoriteCharacters.length },
  ];

  const displayData =
    activeTab === "anime"
      ? favoriteAnime
      : activeTab === "manga"
      ? favoriteManga
      : activeTab === "characters"
      ? favoriteCharacters
      : favorites;

  return (
    <div className="px-gutter pb-20 pt-10 lg:px-gutter-lg">
      <h1 className="m-0 mb-2 font-display text-[28px] font-extrabold tracking-tight text-text md:text-[34px]">
        My favorites
      </h1>
      <p className="mb-6 text-[14.5px] text-muted">
        {totalFavorites} saved — tap ♥ anywhere to add more
      </p>

      {/* Tabs */}
      <div className="mb-8 flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`inline-flex items-center gap-2 rounded-pill border px-4 py-2 font-body text-[13px] font-medium transition-colors duration-fast ${
              activeTab === tab.id
                ? "border-gold bg-gold text-bg"
                : "border-line bg-surface-2 text-muted hover:border-line-strong hover:text-text"
            }`}
          >
            {tab.label}
            <span className="font-mono text-[11px] font-bold">{tab.count}</span>
          </button>
        ))}
      </div>

      {error ? (
        <EmptyState glyph="⚠" title="Couldn't load favorites" sub={error} />
      ) : loading && favorites.length === 0 ? (
        <GridSkeleton count={10} />
      ) : displayData.length === 0 ? (
        <EmptyState
          title="No favorites yet"
          sub="Go find a series worth obsessing over."
          ctaLabel="Browse anime"
          ctaTo="/anime"
        />
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-[26px] sm:grid-cols-[repeat(auto-fill,minmax(180px,1fr))]">
          {displayData.map((item) => {
            const cardItem = toCardItem(item);
            if (item.type === "character") {
              return (
                <CharacterCard
                  key={`${item.type}-${item.itemId}`}
                  character={cardItem}
                />
              );
            }
            return (
              <MediaCard
                key={`${item.type}-${item.itemId}`}
                anime={cardItem}
                mediaType={item.type === "manga" ? "manga" : "anime"}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Favorites;
