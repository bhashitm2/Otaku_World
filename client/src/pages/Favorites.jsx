// Favorites — "Ink & Impact": hall-of-fame grid with type tabs
import React, { useState } from "react";
import { useFavorites } from "../hooks/useFavorites";
import { useAuth } from "../hooks/useAuth";
import InkAnimeCard from "../components/ink/InkAnimeCard";
import InkCharacterCard from "../components/ink/InkCharacterCard";
import InkEmptyState from "../components/ink/InkEmptyState";
import { InkGridSkeleton } from "../components/ink/InkSkeleton";

// Rehydrate a stored favorite into the shape the ink cards expect
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
      <div className="px-6 pb-16 pt-10 md:px-[72px]">
        <InkEmptyState
          shout="SIGN IN FIRST!!"
          sub="Log in to build your hall of fame."
          ctaLabel="Login →"
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
    <div className="animate-popIn px-6 pb-16 pt-10 md:px-[72px]">
      <h1 className="ink-display m-0 mb-2 text-4xl md:text-[44px]">
        My <span className="text-ink-red">Favorites</span>
      </h1>
      <p className="mb-6 text-[13.5px] font-medium text-ink-mut3">
        {totalFavorites} in your hall of fame — tap ♥ anywhere to add more
      </p>

      {/* Tabs */}
      <div className="mb-8 flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`ink-btn gap-2 px-4 py-2 text-xs transition-all duration-150 hover:bg-ink-red hover:text-ink-paper ${
              activeTab === tab.id
                ? "bg-ink text-ink-paper"
                : "bg-ink-paper text-ink"
            }`}
          >
            {tab.label}
            <span className="border-2 border-current px-1.5 text-[10px]">
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {error ? (
        <InkEmptyState shout="SIGNAL LOST!!" sub={error} />
      ) : loading && favorites.length === 0 ? (
        <InkGridSkeleton count={8} />
      ) : displayData.length === 0 ? (
        <InkEmptyState
          shout="YOUR HALL OF FAME IS EMPTY!!"
          sub="Go find a series worth obsessing over."
          ctaLabel="Browse the archive →"
          ctaTo="/anime"
        />
      ) : (
        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {displayData.map((item) => {
            const cardItem = toCardItem(item);
            if (item.type === "character") {
              return (
                <InkCharacterCard
                  key={`${item.type}-${item.itemId}`}
                  character={cardItem}
                />
              );
            }
            return (
              <InkAnimeCard
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
