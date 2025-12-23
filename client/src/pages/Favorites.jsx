// src/pages/Favorites.jsx - Premium Favorites Page
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useFavorites } from "../hooks/useFavorites";
import { useAuth } from "../hooks/useAuth";
import AnimeCard from "../components/AnimeCard";
// MangaCard removed - manga functionality disabled
import CharacterCard from "../components/CharacterCard";
import AnimatedGrid from "../components/AnimatedGrid";
import Loader from "../components/Loader";
import { usePrefersReducedMotion } from "../hooks/useAnimation";

const Favorites = () => {
  const { user } = useAuth();
  const prefersReduced = usePrefersReducedMotion();
  const {
    favorites,
    favoriteAnime,
    favoriteCharacters,
    totalFavorites,
    loading,
    error,
  } = useFavorites();

  const [activeTab, setActiveTab] = useState("all");

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4">
            <svg
              className="mx-auto h-16 w-16 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Sign in to view your favorites
          </h2>
          <p className="text-gray-600">
            You need to be logged in to access your favorite anime and
            characters.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Favorites</h1>
          </div>
          <Loader />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4">
            <svg
              className="mx-auto h-16 w-16 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-red-900 mb-4">
            Error Loading Favorites
          </h2>
          <p className="text-red-600 mb-4">{error}</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "all", label: "All", count: totalFavorites },
    { id: "anime", label: "Anime", count: favoriteAnime.length },
    { id: "characters", label: "Characters", count: favoriteCharacters.length },
  ];

  const getDisplayData = () => {
    switch (activeTab) {
      case "anime":
        return favoriteAnime;
      case "characters":
        return favoriteCharacters;
      default:
        return favorites;
    }
  };

  const displayData = getDisplayData();

  return (
    <motion.div
      className="min-h-screen bg-bg-primary text-text-primary"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: prefersReduced ? 0 : 0.6 }}
    >
      {/* Premium Header Section */}
      <div className="relative bg-gradient-to-br from-bg-secondary via-surface-dark to-bg-primary overflow-hidden -mt-16 pt-16">
        {/* Video Background */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        >
          <source src="/FavouritesBackground.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-radial from-red-500/20 via-black/30 to-bg-primary/70" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(236,72,153,0.15),transparent_50%)]" />

        <motion.div
          className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-40"
          initial={{ y: prefersReduced ? 0 : 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            duration: prefersReduced ? 0 : 0.8,
            delay: prefersReduced ? 0 : 0.2,
          }}
        >
          {/* Premium Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-pink-500 to-red-600 mb-6">
              My Favorites
            </h1>

            <p className="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
              Your curated collection of favorite anime and characters
            </p>
          </div>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Tabs */}
        <div className="flex flex-wrap justify-center mb-8">
          <div className="bg-surface-dark/80 backdrop-blur-md rounded-lg shadow-lg p-1 flex border border-white/10">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  px-6 py-3 rounded-md font-medium transition-all duration-200 flex items-center space-x-2
                  ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg"
                      : "text-gray-300 hover:text-white hover:bg-white/10"
                  }
                `}
              >
                <span>{tab.label}</span>
                <span
                  className={`
                  px-2 py-1 text-xs rounded-full
                  ${
                    activeTab === tab.id
                      ? "bg-white/20 text-white"
                      : "bg-gray-200 text-gray-600"
                  }
                `}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {displayData.length === 0 ? (
          <div className="text-center py-12">
            <div className="mb-4">
              <svg
                className="mx-auto h-16 w-16 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No {activeTab === "all" ? "favorites" : activeTab} yet
            </h3>
            <p className="text-gray-600">
              Start exploring and add some{" "}
              {activeTab === "all" ? "items" : activeTab} to your favorites!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {displayData.map((item) => {
              // Convert stored item back to component format
              const componentItem = {
                mal_id: item.itemId,
                title: item.title,
                name: item.title, // For characters
                images: {
                  jpg: {
                    image_url: item.image,
                    large_image_url: item.image,
                  },
                },
                score: item.score,
                status: item.status,
                genres: item.genres,
                episodes: item.episodes,
                chapters: item.chapters,
                volumes: item.volumes,
                type: item.type,
              };

              switch (item.type) {
                case "anime":
                  return (
                    <AnimeCard
                      key={`${item.type}-${item.itemId}`}
                      anime={componentItem}
                    />
                  );
                case "character":
                  return (
                    <CharacterCard
                      key={`${item.type}-${item.itemId}`}
                      character={componentItem}
                    />
                  );
                default:
                  return null;
              }
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Favorites;
