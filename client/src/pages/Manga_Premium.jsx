// src/pages/Manga.jsx - Premium Manga Browse Page
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { getTopManga, searchManga } from "../services/anime";
import AnimatedGrid from "../components/AnimatedGrid";
import SearchBar from "../components/SearchBar";
import { usePrefersReducedMotion } from "../hooks/useAnimation";

const Manga = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const prefersReduced = usePrefersReducedMotion();

  // Query for top manga (when not searching)
  const {
    data: topMangaData,
    isLoading: topMangaLoading,
    error: topMangaError,
  } = useQuery({
    queryKey: ["top-manga", currentPage],
    queryFn: () => getTopManga(currentPage, 25),
    staleTime: 5 * 60 * 1000,
    enabled: !searchQuery,
  });

  // Query for search results
  const {
    data: searchData,
    isLoading: searchLoading,
    error: searchError,
  } = useQuery({
    queryKey: ["search-manga", searchQuery, currentPage],
    queryFn: () => searchManga(searchQuery, currentPage, 25),
    staleTime: 2 * 60 * 1000,
    enabled: !!searchQuery && searchQuery.trim().length > 0,
  });

  // Determine current data and loading state
  const currentData = searchQuery ? searchData : topMangaData;
  const isLoading = searchQuery ? searchLoading : topMangaLoading;
  const error = searchQuery ? searchError : topMangaError;
  const mangaList = currentData?.data || [];
  const hasMore = currentData?.pagination?.has_next_page || false;

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setCurrentPage(1);
  };

  const loadMoreManga = () => {
    if (hasMore && !isLoading) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const retryLoad = () => {
    setCurrentPage(1);
    // Query will automatically refetch
  };

  return (
    <motion.div
      className="min-h-screen bg-bg-primary text-text-primary"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: prefersReduced ? 0 : 0.6 }}
    >
      {/* Premium Header Section */}
      <div className="relative bg-gradient-to-br from-bg-secondary via-surface-dark to-bg-primary overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-accent-yellow/20 via-transparent to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 py-16">
          <motion.div
            className="text-center mb-12"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: prefersReduced ? 0 : 0.8, delay: 0.2 }}
          >
            <h1 className="font-display text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-accent-yellow via-accent-orange to-accent-yellow bg-clip-text text-transparent">
              Browse Manga
            </h1>
            <p className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
              Explore the finest collection of manga from every genre
            </p>

            {/* Premium Search Bar */}
            <div className="max-w-2xl mx-auto">
              <SearchBar
                onSearch={handleSearch}
                onClear={handleClearSearch}
                placeholder="Search manga titles, authors, or genres..."
                className="w-full"
              />
            </div>
          </motion.div>

          {/* Current View Indicator */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: prefersReduced ? 0 : 0.6, delay: 0.4 }}
          >
            <div className="inline-flex items-center px-4 py-2 bg-surface-secondary/80 backdrop-blur-sm rounded-full border border-accent-yellow/20">
              <span className="text-text-secondary">
                {searchQuery ? (
                  <>
                    Results for:{" "}
                    <span className="text-accent-yellow font-semibold">
                      "{searchQuery}"
                    </span>
                  </>
                ) : (
                  "Top-rated manga collection"
                )}
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Error State */}
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
                Something went wrong
              </h3>
              <p className="text-text-secondary">
                {error?.message || "Failed to load manga. Please try again."}
              </p>
            </div>
            <button
              onClick={retryLoad}
              className="bg-accent-yellow hover:bg-accent-yellow/80 text-bg-primary px-8 py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-105"
            >
              Try Again
            </button>
          </motion.div>
        )}

        {/* Premium Animated Grid */}
        <AnimatedGrid
          items={mangaList}
          loading={isLoading && currentPage === 1}
          className="mb-12"
        />

        {/* Load More Section */}
        {mangaList.length > 0 && hasMore && (
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <button
              onClick={loadMoreManga}
              disabled={isLoading}
              className="group relative bg-gradient-to-r from-accent-yellow to-accent-orange text-bg-primary px-12 py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-accent-yellow/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading && currentPage > 1 ? (
                <span className="flex items-center">
                  <div className="w-5 h-5 border-2 border-bg-primary border-t-transparent rounded-full animate-spin mr-3"></div>
                  Loading more manga...
                </span>
              ) : (
                <>
                  <span className="relative z-10">Load More Manga</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-accent-orange to-accent-yellow rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </>
              )}
            </button>
          </motion.div>
        )}

        {/* Results Count */}
        {mangaList.length > 0 && (
          <motion.div
            className="text-center mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="text-text-secondary">
              Showing{" "}
              <span className="text-accent-yellow font-semibold">
                {mangaList.length}
              </span>{" "}
              manga
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Manga;
