// src/pages/Anime.jsx
import React, { useState, useEffect } from "react";
import { getTopAnime, searchAnime } from "../services/anime";
import AnimeCard from "../components/AnimeCard";
import SearchBar from "../components/SearchBar";
import Loader, { AnimeGridSkeleton } from "../components/Loader";

const Anime = () => {
  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Load initial top anime
  useEffect(() => {
    loadTopAnime();
  }, []);

  const loadTopAnime = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getTopAnime(page, 25);

      if (page === 1) {
        setAnimeList(response.data || []);
      } else {
        setAnimeList((prev) => [...prev, ...(response.data || [])]);
      }

      setHasMore(response.pagination?.has_next_page || false);
      setCurrentPage(page);
    } catch (err) {
      console.error("Error fetching top anime:", err);
      setError("Failed to load top anime. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    if (!query || query.trim().length === 0) {
      return;
    }

    try {
      setIsSearching(true);
      setError(null);
      setSearchQuery(query);

      const response = await searchAnime(query, 1, 25);
      setAnimeList(response.data || []);
      setHasMore(response.pagination?.has_next_page || false);
      setCurrentPage(1);
    } catch (err) {
      console.error("Error searching anime:", err);
      setError(`Failed to search for "${query}". Please try again.`);
      setAnimeList([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setIsSearching(false);
    setCurrentPage(1);
    loadTopAnime(1);
  };

  const loadMoreAnime = async () => {
    const nextPage = currentPage + 1;

    if (searchQuery) {
      try {
        setLoading(true);
        const response = await searchAnime(searchQuery, nextPage, 25);
        setAnimeList((prev) => [...prev, ...(response.data || [])]);
        setHasMore(response.pagination?.has_next_page || false);
        setCurrentPage(nextPage);
      } catch (err) {
        console.error("Error loading more search results:", err);
        setError("Failed to load more results.");
      } finally {
        setLoading(false);
      }
    } else {
      loadTopAnime(nextPage);
    }
  };

  const retryLoad = () => {
    if (searchQuery) {
      handleSearch(searchQuery);
    } else {
      loadTopAnime(1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              🎌 Otaku World
            </h1>
            <p className="text-xl text-blue-100 mb-6">
              Discover your next favorite anime
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <SearchBar
                onSearch={handleSearch}
                onClear={handleClearSearch}
                placeholder="Search for anime titles, genres, or characters..."
                className="w-full"
              />
            </div>
          </div>

          {/* Current View Indicator */}
          <div className="text-center">
            <p className="text-blue-100">
              {searchQuery ? (
                <>
                  Showing results for:{" "}
                  <span className="font-semibold">"{searchQuery}"</span>
                </>
              ) : (
                "Showing top-rated anime"
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8 text-center">
            <div className="text-red-600 mb-4">
              <svg
                className="w-12 h-12 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="text-lg font-semibold mb-2">
                Oops! Something went wrong
              </h3>
              <p className="text-red-700">{error}</p>
            </div>
            <button
              onClick={retryLoad}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && animeList.length === 0 && (
          <div>
            {isSearching ? (
              <Loader text={`Searching for "${searchQuery}"...`} size="lg" />
            ) : (
              <AnimeGridSkeleton count={20} />
            )}
          </div>
        )}

        {/* No Results */}
        {!loading && !error && animeList.length === 0 && searchQuery && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No anime found
            </h3>
            <p className="text-gray-500 mb-4">
              No results found for "{searchQuery}". Try a different search term.
            </p>
            <button
              onClick={handleClearSearch}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Browse Top Anime
            </button>
          </div>
        )}

        {/* Anime Grid */}
        {animeList.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
              {animeList.map((anime) => (
                <AnimeCard key={anime.mal_id} anime={anime} />
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="text-center">
                <button
                  onClick={loadMoreAnime}
                  disabled={loading}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Loading...
                    </span>
                  ) : (
                    "Load More Anime"
                  )}
                </button>
              </div>
            )}

            {/* Results count */}
            <div className="text-center mt-4 text-sm text-gray-500">
              Showing {animeList.length} anime
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Anime;
