// src/pages/Manga.jsx - Premium Manga Browse Page
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { getTopManga, searchManga } from "../services/anime";
import MangaCard from "../components/MangaCard";
import SearchBar from "../components/SearchBar";
import Loader from "../components/Loader";
import { usePrefersReducedMotion } from "../hooks/useAnimation";
import { Book, TrendingUp, Users, Calendar } from "lucide-react";

const Manga = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [mangaList, setMangaList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const prefersReduced = usePrefersReducedMotion();

  // Query for top manga (when not searching)
  const {
    data: topMangaData,
    isLoading: topMangaLoading,
    error: topMangaError,
    refetch: refetchTopManga,
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
    refetch: refetchSearch,
  } = useQuery({
    queryKey: ["search-manga", searchQuery, currentPage],
    queryFn: () => searchManga(searchQuery, currentPage, 25),
    staleTime: 2 * 60 * 1000,
    enabled: !!searchQuery && searchQuery.trim().length > 0,
  });

  // Update manga list when data changes
  React.useEffect(() => {
    const currentData = searchQuery ? searchData : topMangaData;
    console.log("Manga data received:", currentData); // Debug log

    if (currentData?.data?.data) {
      const newMangaData = currentData.data.data;
      if (currentPage === 1) {
        setMangaList(newMangaData);
      } else {
        setMangaList((prev) => [...prev, ...newMangaData]);
      }
    }
  }, [topMangaData, searchData, searchQuery, currentPage]);

  // Determine current data and loading state
  const currentData = searchQuery ? searchData : topMangaData;
  const isLoading = searchQuery ? searchLoading : topMangaLoading;
  const error = searchQuery ? searchError : topMangaError;
  const hasMore = currentData?.data?.pagination?.has_next_page || false;

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
    setMangaList([]);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setCurrentPage(1);
    setMangaList([]);
  };

  const loadMoreManga = () => {
    if (hasMore && !isLoading) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const retryLoad = () => {
    setCurrentPage(1);
    setMangaList([]);
    if (searchQuery) {
      refetchSearch();
    } else {
      refetchTopManga();
    }
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
        <div className="absolute inset-0 bg-gradient-radial from-accent-magenta/20 via-transparent to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 py-16">
          <motion.div
            className="text-center mb-12"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: prefersReduced ? 0 : 0.8, delay: 0.2 }}
          >
            <div className="flex items-center justify-center mb-6">
              <Book className="w-12 h-12 text-accent-magenta mr-4" />
              <h1 className="font-display text-5xl md:text-6xl font-bold bg-gradient-to-r from-accent-magenta via-accent-cyan to-accent-magenta bg-clip-text text-transparent">
                Browse Manga
              </h1>
            </div>
            <p className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
              Discover the world's greatest manga collection with premium
              reading experiences
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
            <div className="inline-flex items-center px-4 py-2 bg-surface-secondary/80 backdrop-blur-sm rounded-full border border-accent-magenta/20">
              <span className="text-text-secondary">
                {searchQuery ? (
                  <>
                    Results for:{" "}
                    <span className="text-accent-magenta font-semibold">
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
              className="bg-accent-magenta hover:bg-accent-magenta/80 text-bg-primary px-8 py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-105"
            >
              Try Again
            </button>
          </motion.div>
        )}

        {/* Loading State for Initial Load */}
        {isLoading && currentPage === 1 && mangaList.length === 0 && (
          <div className="flex justify-center items-center py-20">
            <Loader />
          </div>
        )}

        {/* No Results for Search */}
        {!isLoading && !error && mangaList.length === 0 && searchQuery && (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-6xl mb-6">🔍</div>
            <h3 className="text-2xl font-semibold text-text-primary mb-4">
              No manga found
            </h3>
            <p className="text-text-secondary mb-8 max-w-md mx-auto">
              No results found for "{searchQuery}". Try a different search term
              or browse our top manga collection.
            </p>
            <button
              onClick={handleClearSearch}
              className="bg-gradient-to-r from-accent-magenta to-accent-cyan text-bg-primary px-8 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-accent-magenta/25 transition-all duration-300"
            >
              Browse Top Manga
            </button>
          </motion.div>
        )}

        {/* Manga Stats */}
        {mangaList.length > 0 && (
          <motion.div
            className="bg-surface-secondary/50 backdrop-blur-sm rounded-2xl p-8 mb-12 border border-surface-secondary"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center w-12 h-12 bg-accent-magenta/20 rounded-full mb-3">
                  <Book className="w-6 h-6 text-accent-magenta" />
                </div>
                <div className="text-3xl font-bold text-accent-magenta">
                  {mangaList.length}
                </div>
                <div className="text-text-secondary font-medium">
                  Manga Series
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center w-12 h-12 bg-accent-cyan/20 rounded-full mb-3">
                  <TrendingUp className="w-6 h-6 text-accent-cyan" />
                </div>
                <div className="text-3xl font-bold text-accent-cyan">
                  {Math.round(
                    (mangaList.reduce(
                      (acc, manga) => acc + (manga.score || 0),
                      0
                    ) /
                      mangaList.filter((m) => m.score).length) *
                      10
                  ) / 10 || "N/A"}
                </div>
                <div className="text-text-secondary font-medium">
                  Average Score
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center w-12 h-12 bg-accent-yellow/20 rounded-full mb-3">
                  <Calendar className="w-6 h-6 text-accent-yellow" />
                </div>
                <div className="text-3xl font-bold text-accent-yellow">
                  {
                    mangaList.filter((manga) => manga.status === "Publishing")
                      .length
                  }
                </div>
                <div className="text-text-secondary font-medium">
                  Currently Publishing
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center w-12 h-12 bg-accent-orange/20 rounded-full mb-3">
                  <Users className="w-6 h-6 text-accent-orange" />
                </div>
                <div className="text-3xl font-bold text-accent-orange">
                  {Math.round(
                    mangaList.reduce(
                      (acc, manga) => acc + (manga.popularity || 0),
                      0
                    ) / mangaList.length
                  ) || "N/A"}
                </div>
                <div className="text-text-secondary font-medium">
                  Avg Popularity
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Manga Grid */}
        {mangaList.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-12">
              {mangaList.map((manga, index) => (
                <motion.div
                  key={manga.mal_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: prefersReduced ? 0 : 0.4,
                    delay: prefersReduced ? 0 : index * 0.05,
                  }}
                >
                  <MangaCard manga={manga} />
                </motion.div>
              ))}
            </div>

            {/* Load More Section */}
            {hasMore && (
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <button
                  onClick={loadMoreManga}
                  disabled={isLoading}
                  className="group relative bg-gradient-to-r from-accent-magenta to-accent-cyan text-bg-primary px-12 py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-accent-magenta/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading && currentPage > 1 ? (
                    <span className="flex items-center">
                      <div className="w-5 h-5 border-2 border-bg-primary border-t-transparent rounded-full animate-spin mr-3"></div>
                      Loading more manga...
                    </span>
                  ) : (
                    <>
                      <span className="relative z-10">Load More Manga</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-accent-cyan to-accent-magenta rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </>
                  )}
                </button>
              </motion.div>
            )}

            {/* Results Count */}
            <motion.div
              className="text-center mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <p className="text-text-secondary">
                Showing{" "}
                <span className="text-accent-magenta font-semibold">
                  {mangaList.length}
                </span>{" "}
                manga
                {searchQuery && <span> for "{searchQuery}"</span>}
              </p>
            </motion.div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Manga;
