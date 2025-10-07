// src/pages/Trending.jsx - Premium Trending Page
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { getTrendingAnime } from "../services/anime";
import AnimatedGrid from "../components/AnimatedGrid";
import { usePrefersReducedMotion } from "../hooks/useAnimation";

const Trending = () => {
  const [allAnime, setAllAnime] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const prefersReduced = usePrefersReducedMotion();

  // Initial data query
  const {
    data: initialData,
    isLoading: initialLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["trending-anime-initial"],
    queryFn: () => getTrendingAnime(1, 25),
    staleTime: 2 * 60 * 1000, // 2 minutes for trending data
  });

  // Handle initial data when it loads
  useEffect(() => {
    if (initialData?.data) {
      setAllAnime(initialData.data);
      setHasMore(initialData.pagination?.has_next_page || false);
    }
  }, [initialData]);

  const loadMoreAnime = async () => {
    if (!hasMore || loadingMore || initialLoading) return;

    try {
      setLoadingMore(true);
      const nextPage = currentPage + 1;
      const response = await getTrendingAnime(nextPage, 25);

      if (response?.data) {
        setAllAnime((prev) => [...prev, ...response.data]);
        setCurrentPage(nextPage);
        setHasMore(response.pagination?.has_next_page || false);
      }
    } catch (err) {
      console.error("Error loading more trending anime:", err);
    } finally {
      setLoadingMore(false);
    }
  };

  const retryLoad = () => {
    setCurrentPage(1);
    setAllAnime([]);
    setHasMore(true);
    refetch();
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
        {/* Video Background */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/Trending Background.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-radial from-accent-magenta/20 via-black/50 to-bg-primary/80" />
        <div className="relative max-w-7xl mx-auto px-4 py-16">
          <motion.div
            className="text-center mb-12"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: prefersReduced ? 0 : 0.8, delay: 0.2 }}
          >
            <h1 className="font-display text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-accent-magenta via-accent-cyan to-accent-magenta bg-clip-text text-transparent drop-shadow-lg">
              Trending Now
            </h1>
            <p className="text-xl text-white font-semibold mb-8 max-w-2xl mx-auto drop-shadow-lg shadow-black">
              The hottest anime everyone's talking about right now
            </p>

            {/* Trending Stats */}
            <div className="flex justify-center items-center space-x-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-accent-magenta mb-1">
                  🔥
                </div>
                <div className="text-sm text-white font-medium drop-shadow-md">
                  Hot Releases
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent-cyan mb-1">
                  📈
                </div>
                <div className="text-sm text-white font-medium drop-shadow-md">
                  Rising Fast
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent-yellow mb-1">
                  ⭐
                </div>
                <div className="text-sm text-white font-medium drop-shadow-md">
                  Most Popular
                </div>
              </div>
            </div>
          </motion.div>

          {/* Live Indicator */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: prefersReduced ? 0 : 0.6, delay: 0.4 }}
          >
            <div className="inline-flex items-center px-4 py-2 bg-surface-secondary/80 backdrop-blur-sm rounded-full border border-accent-magenta/20">
              <div className="w-2 h-2 bg-accent-magenta rounded-full animate-pulse mr-2"></div>
              <span className="text-text-secondary">Live trending data</span>
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
                Failed to load trending anime
              </h3>
              <p className="text-text-secondary">
                {error?.message ||
                  "Please check your connection and try again."}
              </p>
            </div>
            <button
              onClick={retryLoad}
              className="bg-accent-magenta hover:bg-accent-magenta/80 text-bg-primary px-8 py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-105"
            >
              Retry
            </button>
          </motion.div>
        )}

        {/* Premium Animated Grid */}
        <AnimatedGrid
          items={allAnime}
          loading={initialLoading}
          className="mb-12"
        />

        {/* Load More Section */}
        {allAnime.length > 0 && hasMore && (
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <button
              onClick={loadMoreAnime}
              disabled={loadingMore}
              className="group relative bg-gradient-to-r from-accent-magenta to-accent-cyan text-bg-primary px-12 py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-accent-magenta/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingMore ? (
                <span className="flex items-center">
                  <div className="w-5 h-5 border-2 border-bg-primary border-t-transparent rounded-full animate-spin mr-3"></div>
                  Loading more trending...
                </span>
              ) : (
                <>
                  <span className="relative z-10">Load More Trending</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-accent-cyan to-accent-magenta rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </>
              )}
            </button>
          </motion.div>
        )}

        {/* Results Count */}
        {allAnime.length > 0 && (
          <motion.div
            className="text-center mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="text-text-secondary">
              Showing{" "}
              <span className="text-accent-magenta font-semibold">
                {allAnime.length}
              </span>{" "}
              trending anime
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Trending;
