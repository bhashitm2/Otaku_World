// src/pages/Favorites.jsx - Premium Favorites Page
import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useFavorites } from "../hooks/useFavorites";
import { useAuth } from "../hooks/useAuth";
import AnimatedGrid from "../components/AnimatedGrid";
import { usePrefersReducedMotion } from "../hooks/useAnimation";
import { Link } from "react-router-dom";

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
  const prefersReduced = usePrefersReducedMotion();

  // Determine what to show based on active tab
  const getCurrentItems = () => {
    switch (activeTab) {
      case "anime":
        return favoriteAnime || [];
      case "manga":
        return favoriteManga || [];
      case "characters":
        return favoriteCharacters || [];
      default:
        return favorites || [];
    }
  };

  const currentItems = getCurrentItems();

  // Tab configuration
  const tabs = [
    { id: "all", label: "All Favorites", count: totalFavorites, emoji: "💫" },
    {
      id: "anime",
      label: "Anime",
      count: favoriteAnime?.length || 0,
      emoji: "📺",
    },
    {
      id: "manga",
      label: "Manga",
      count: favoriteManga?.length || 0,
      emoji: "📚",
    },
    {
      id: "characters",
      label: "Characters",
      count: favoriteCharacters?.length || 0,
      emoji: "👥",
    },
  ];

  const tabVariants = {
    inactive: {
      backgroundColor: "rgba(0, 0, 0, 0.1)",
      color: "rgba(255, 255, 255, 0.6)",
    },
    active: { backgroundColor: "rgba(0, 245, 255, 0.2)", color: "#00f5ff" },
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary text-text-primary">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <AnimatedGrid loading={true} />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <motion.div
        className="min-h-screen bg-bg-primary text-text-primary flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center max-w-md">
          <div className="text-8xl mb-6">🔐</div>
          <h2 className="text-3xl font-bold mb-4">Sign In Required</h2>
          <p className="text-text-secondary mb-8">
            You need to be signed in to view your favorites collection.
          </p>
          <Link
            to="/login"
            className="bg-gradient-to-r from-accent-cyan to-accent-magenta text-bg-primary px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-accent-cyan/25 transition-all duration-300"
          >
            Sign In
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-bg-primary text-text-primary"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: prefersReduced ? 0 : 0.6 }}
    >
      {/* Premium Header Section */}
      <div className="relative bg-gradient-to-br from-bg-secondary via-surface-dark to-bg-primary overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-accent-cyan/20 via-transparent to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 py-16">
          <motion.div
            className="text-center mb-12"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: prefersReduced ? 0 : 0.8, delay: 0.2 }}
          >
            <h1 className="font-display text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-accent-cyan via-accent-magenta to-accent-cyan bg-clip-text text-transparent">
              My Favorites
            </h1>
            <p className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
              Your carefully curated collection of beloved anime, manga, and
              characters
            </p>

            {/* Stats Overview */}
            <div className="flex justify-center items-center space-x-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-accent-cyan mb-1">
                  {totalFavorites}
                </div>
                <div className="text-sm text-text-secondary">
                  Total Favorites
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent-magenta mb-1">
                  {favoriteAnime?.length || 0}
                </div>
                <div className="text-sm text-text-secondary">Anime</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent-yellow mb-1">
                  {favoriteManga?.length || 0}
                </div>
                <div className="text-sm text-text-secondary">Manga</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          className="flex flex-wrap justify-center gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center space-x-3 px-6 py-3 rounded-xl font-semibold transition-all duration-300 border border-surface-light"
              variants={tabVariants}
              animate={activeTab === tab.id ? "active" : "inactive"}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-2xl">{tab.emoji}</span>
              <span>{tab.label}</span>
              <span className="bg-surface-secondary px-2 py-1 rounded-full text-sm">
                {tab.count}
              </span>
            </motion.button>
          ))}
        </motion.div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            {error && (
              <motion.div
                className="bg-surface-secondary border border-red-500/20 rounded-xl p-8 mb-12 text-center"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-red-400 mb-6">
                  <div className="text-6xl mb-4">⚠️</div>
                  <h3 className="text-xl font-semibold mb-2">
                    Failed to load favorites
                  </h3>
                  <p className="text-text-secondary">
                    {error?.message ||
                      "There was an error loading your favorites."}
                  </p>
                </div>
              </motion.div>
            )}

            {currentItems.length === 0 && !loading && !error ? (
              <motion.div
                className="text-center py-20"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
              >
                <div className="text-8xl mb-6">💔</div>
                <h3 className="text-2xl font-semibold mb-4">
                  No {activeTab === "all" ? "favorites" : activeTab} yet
                </h3>
                <p className="text-text-secondary mb-8 max-w-md mx-auto">
                  Start building your collection by adding your favorite{" "}
                  {activeTab === "all"
                    ? "anime, manga, and characters"
                    : activeTab}{" "}
                  to your favorites.
                </p>
                <Link
                  to="/anime"
                  className="bg-gradient-to-r from-accent-cyan to-accent-magenta text-bg-primary px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-accent-cyan/25 transition-all duration-300"
                >
                  Discover{" "}
                  {activeTab === "all"
                    ? "Content"
                    : activeTab === "characters"
                    ? "Characters"
                    : activeTab}
                </Link>
              </motion.div>
            ) : (
              <AnimatedGrid
                items={currentItems}
                loading={loading}
                className="mb-12"
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Favorites;
