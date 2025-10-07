// src/pages/Characters.jsx - Premium Characters Browse Page
import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { searchCharacters, getTopCharacters } from "../services/anime";
import CharacterCard from "../components/CharacterCard";
import SearchBar from "../components/SearchBar";
import SortingControls from "../components/SortingControls";
import AnimatedGrid from "../components/AnimatedGrid";
import Loader from "../components/Loader";
import { usePrefersReducedMotion } from "../hooks/useAnimation";

const Characters = () => {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [isSearchMode, setIsSearchMode] = useState(false);

  // Fixed sorting: always by favorites, descending (High to Low)
  const sortBy = "favorites";
  const sortOrder = "desc";

  const loadTopCharacters = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getTopCharacters();

      if (response?.data) {
        setCharacters(response.data);
        setCurrentPage(response.pagination?.current_page || 1);
        setHasNextPage(response.pagination?.has_next_page || false);
        setTotalPages(response.pagination?.last_visible_page || 1);
        setIsSearchMode(false);
      }
    } catch (err) {
      console.error("Error loading top characters:", err);
      setError("Failed to load characters. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Load initial top characters
  useEffect(() => {
    loadTopCharacters();
  }, [loadTopCharacters]);

  const handleSearch = useCallback(
    async (query) => {
      if (!query.trim()) {
        loadTopCharacters();
        return;
      }

      try {
        setSearching(true);
        setError(null);
        setSearchTerm(query);
        setIsSearchMode(true);

        const response = await searchCharacters(query, 1, 25, {
          order_by: sortBy,
          sort: sortOrder,
        });

        if (response?.data) {
          setCharacters(response.data);
          setCurrentPage(response.pagination?.current_page || 1);
          setHasNextPage(response.pagination?.has_next_page || false);
          setTotalPages(response.pagination?.last_visible_page || 1);
        } else {
          setCharacters([]);
        }
      } catch (err) {
        console.error("Error searching characters:", err);
        setError("Failed to search characters. Please try again.");
        setCharacters([]);
      } finally {
        setSearching(false);
      }
    },
    [loadTopCharacters, sortBy, sortOrder]
  );

  const loadMoreCharacters = async (page) => {
    try {
      setLoading(true);
      setError(null);

      let response;
      if (isSearchMode && searchTerm) {
        response = await searchCharacters(searchTerm, page, 25, {
          order_by: sortBy,
          sort: sortOrder,
        });
      } else {
        response = await getTopCharacters(page);
      }

      if (response?.data) {
        setCharacters((prevCharacters) => [
          ...prevCharacters,
          ...response.data,
        ]);
        setCurrentPage(response.pagination?.current_page || page);
        setHasNextPage(response.pagination?.has_next_page || false);
        setTotalPages(response.pagination?.last_visible_page || page);
      }
    } catch (err) {
      console.error("Error loading more characters:", err);
      setError("Failed to load more characters. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (hasNextPage && !loading) {
      loadMoreCharacters(currentPage + 1);
    }
  };

  const clearSearch = useCallback(() => {
    setSearchTerm("");
    setIsSearchMode(false);
    loadTopCharacters();
  }, [loadTopCharacters]);

  const prefersReduced = usePrefersReducedMotion();

  return (
    <motion.div
      className="min-h-screen bg-bg-primary text-text-primary"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: prefersReduced ? 0 : 0.6 }}
    >
      {/* Premium Header Section */}
      <div className="relative bg-gradient-to-br from-bg-secondary via-surface-dark to-bg-primary overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-accent-purple/20 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_80%,rgba(147,51,234,0.1),transparent_50%)]" />

        <motion.div
          className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
          initial={{ y: prefersReduced ? 0 : 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            duration: prefersReduced ? 0 : 0.8,
            delay: prefersReduced ? 0 : 0.2,
          }}
        >
          {/* Premium Header */}
          <div className="text-center mb-12">
            <motion.div
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-accent-purple to-accent-pink rounded-2xl mb-6 shadow-lg"
              whileHover={{
                scale: prefersReduced ? 1 : 1.05,
                rotate: prefersReduced ? 0 : 5,
              }}
              transition={{ duration: 0.2 }}
            >
              <span className="text-3xl">🎭</span>
            </motion.div>

            <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accent-purple via-accent-pink to-accent-cyan mb-6">
              Anime Characters
            </h1>

            <p className="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
              Discover your favorite anime characters, from legendary heroes to
              memorable villains.
              {isSearchMode
                ? ` Showing results for "${searchTerm}"`
                : " Browse the most popular characters from anime series."}
            </p>
          </div>

          {/* Premium Search Bar */}
          <div className="max-w-2xl mx-auto">
            <SearchBar
              onSearch={handleSearch}
              onClear={clearSearch}
              placeholder="Search for characters (e.g., Naruto, Goku, Luffy)..."
              className="w-full"
            />
          </div>
        </motion.div>
      </div>

      {/* Sorting Controls - Only show for search results */}
      {isSearchMode && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <SortingControls type="character" className="max-w-4xl mx-auto" />
        </div>
      )}

      {/* Main Content */}
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
        initial={{ y: prefersReduced ? 0 : 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: prefersReduced ? 0 : 0.6,
          delay: prefersReduced ? 0 : 0.4,
        }}
      >
        {/* Clear Search Button */}
        {isSearchMode && (
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <button
              onClick={clearSearch}
              className="inline-flex items-center px-6 py-3 bg-surface-dark/50 hover:bg-surface-dark text-text-primary rounded-xl transition-all duration-200 border border-border/30 hover:border-accent-purple/50"
            >
              <span className="mr-2">✕</span>
              Clear search and show top characters
            </button>
          </motion.div>
        )}

        {/* Error Message */}
        {error && (
          <motion.div
            className="max-w-2xl mx-auto mb-8"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-500/20 backdrop-blur-sm p-6 rounded-xl">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-2xl">⚠️</span>
                </div>
                <div className="ml-4">
                  <p className="text-red-400 font-medium">{error}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Premium Navigation Links */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: prefersReduced ? 0 : 0.5,
            delay: prefersReduced ? 0 : 0.6,
          }}
        >
          <Link
            to="/anime"
            className="group relative px-8 py-4 bg-gradient-to-r from-accent-purple/20 to-accent-pink/20 hover:from-accent-purple/30 hover:to-accent-pink/30 text-text-primary rounded-xl transition-all duration-300 font-semibold border border-accent-purple/30 hover:border-accent-purple/50 backdrop-blur-sm"
          >
            <span className="relative z-10 flex items-center">
              <span className="mr-2">🎌</span>
              Browse Anime
            </span>
          </Link>

          <Link
            to="/trending"
            className="group relative px-8 py-4 bg-gradient-to-r from-accent-cyan/20 to-accent-purple/20 hover:from-accent-cyan/30 hover:to-accent-purple/30 text-text-primary rounded-xl transition-all duration-300 font-semibold border border-accent-cyan/30 hover:border-accent-cyan/50 backdrop-blur-sm"
          >
            <span className="relative z-10 flex items-center">
              <span className="mr-2">🔥</span>
              Trending Now
            </span>
          </Link>
        </motion.div>

        {/* Results Info */}
        {characters.length > 0 && !loading && (
          <motion.div
            className="mb-8 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="inline-flex items-center px-6 py-3 bg-surface-dark/30 backdrop-blur-sm rounded-xl border border-border/30">
              {isSearchMode ? (
                <p className="text-text-secondary">
                  Found{" "}
                  <span className="text-accent-cyan font-semibold">
                    {characters.length}
                  </span>{" "}
                  character
                  {characters.length !== 1 ? "s" : ""} matching{" "}
                  <span className="text-accent-purple">"{searchTerm}"</span>
                </p>
              ) : (
                <p className="text-text-secondary">
                  Showing{" "}
                  <span className="text-accent-cyan font-semibold">
                    {characters.length}
                  </span>{" "}
                  top characters
                </p>
              )}
              {totalPages > 1 && (
                <span className="ml-3 px-3 py-1 bg-accent-purple/20 text-accent-purple text-sm rounded-lg">
                  Page {currentPage} of {totalPages}
                </span>
              )}
            </div>
          </motion.div>
        )}

        {/* Characters Grid */}
        {loading && characters.length === 0 ? (
          <div className="flex justify-center py-20">
            <Loader />
          </div>
        ) : characters.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: prefersReduced ? 0 : 0.6,
              delay: prefersReduced ? 0 : 0.8,
            }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 items-stretch">
              {characters.map((character, index) => (
                <motion.div
                  key={`${character.mal_id}-${character.name}`}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    duration: prefersReduced ? 0 : 0.4,
                    delay: prefersReduced ? 0 : index * 0.05,
                    ease: "easeOut",
                  }}
                  whileHover={{
                    y: prefersReduced ? 0 : -5,
                    scale: prefersReduced ? 1 : 1.02,
                    transition: { duration: 0.2 },
                  }}
                >
                  <CharacterCard character={character} index={index} />
                </motion.div>
              ))}
            </div>

            {/* Premium Load More Button */}
            {hasNextPage && (
              <motion.div
                className="text-center mt-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <button
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="group relative px-10 py-4 bg-gradient-to-r from-accent-purple to-accent-pink hover:from-accent-purple/80 hover:to-accent-pink/80 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <span className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></span>
                      Loading More Characters...
                    </>
                  ) : (
                    <>
                      <span className="mr-2">⭐</span>
                      Load More Characters
                    </>
                  )}
                </button>
              </motion.div>
            )}
          </motion.div>
        ) : !loading ? (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-accent-purple/20 to-accent-pink/20 rounded-2xl mb-6">
              <span className="text-4xl">🔍</span>
            </div>
            <h3 className="text-2xl font-bold text-text-primary mb-4">
              {isSearchMode ? "No characters found" : "No characters available"}
            </h3>
            <p className="text-text-secondary mb-8 max-w-md mx-auto">
              {isSearchMode
                ? `No characters match "${searchTerm}". Try a different search term.`
                : "Unable to load characters at the moment. Please try again later."}
            </p>
            {isSearchMode && (
              <button
                onClick={clearSearch}
                className="px-8 py-4 bg-gradient-to-r from-accent-cyan to-accent-purple hover:from-accent-cyan/80 hover:to-accent-purple/80 text-white rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <span className="mr-2">⭐</span>
                Show Top Characters
              </button>
            )}
          </motion.div>
        ) : null}

        {/* Premium Quick Links */}
        <motion.div
          className="mt-16 pt-8 border-t border-border/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: prefersReduced ? 0 : 0.5,
            delay: prefersReduced ? 0 : 1,
          }}
        >
          <div className="text-center">
            <h3 className="text-xl font-bold text-text-primary mb-6">
              Explore More
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/anime"
                className="text-accent-purple hover:text-accent-pink transition-colors duration-200 font-medium hover:underline"
              >
                Popular Anime Series
              </Link>
              <span className="text-border">•</span>

              <Link
                to="/trending"
                className="text-accent-cyan hover:text-accent-purple transition-colors duration-200 font-medium hover:underline"
              >
                Trending Content
              </Link>
              <span className="text-border">•</span>
              <Link
                to="/"
                className="text-accent-pink hover:text-accent-cyan transition-colors duration-200 font-medium hover:underline"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Characters;
