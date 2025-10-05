// src/pages/Manga.jsx
import React, { useState, useEffect } from "react";
import { getTopManga, searchManga } from "../services/anime";
import MangaCard from "../components/MangaCard";
import SearchBar from "../components/SearchBar";
import Loader, { AnimeGridSkeleton } from "../components/Loader";

const Manga = () => {
  const [mangaList, setMangaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Load initial top manga
  useEffect(() => {
    loadTopManga();
  }, []);

  const loadTopManga = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getTopManga(page, 25);

      if (page === 1) {
        setMangaList(response.data || []);
      } else {
        setMangaList((prev) => [...prev, ...(response.data || [])]);
      }

      setHasMore(response.pagination?.has_next_page || false);
      setCurrentPage(page);
    } catch (err) {
      console.error("Error fetching top manga:", err);
      setError("Failed to load top manga. Please try again.");
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

      const response = await searchManga(query, 1, 25);
      setMangaList(response.data || []);
      setHasMore(response.pagination?.has_next_page || false);
      setCurrentPage(1);
    } catch (err) {
      console.error("Error searching manga:", err);
      setError(`Failed to search for "${query}". Please try again.`);
      setMangaList([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setIsSearching(false);
    setCurrentPage(1);
    loadTopManga(1);
  };

  const loadMoreManga = async () => {
    const nextPage = currentPage + 1;

    if (searchQuery) {
      try {
        setLoading(true);
        const response = await searchManga(searchQuery, nextPage, 25);
        setMangaList((prev) => [...prev, ...(response.data || [])]);
        setHasMore(response.pagination?.has_next_page || false);
        setCurrentPage(nextPage);
      } catch (err) {
        console.error("Error loading more search results:", err);
        setError("Failed to load more results.");
      } finally {
        setLoading(false);
      }
    } else {
      loadTopManga(nextPage);
    }
  };

  const retryLoad = () => {
    if (searchQuery) {
      handleSearch(searchQuery);
    } else {
      loadTopManga(1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              📚 Manga World
            </h1>
            <p className="text-xl text-purple-100 mb-6">
              Discover amazing manga series, manhwa, and light novels from Japan
              and beyond
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <SearchBar
                onSearch={handleSearch}
                onClear={handleClearSearch}
                placeholder="Search for manga titles, authors, or genres..."
                className="w-full"
              />
            </div>
          </div>

          {/* Current View Indicator */}
          <div className="text-center">
            <p className="text-purple-100">
              {searchQuery ? (
                <>
                  Showing results for:{" "}
                  <span className="font-semibold">"{searchQuery}"</span>
                </>
              ) : (
                "Showing top-rated manga"
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
        {loading && mangaList.length === 0 && (
          <div>
            {isSearching ? (
              <Loader text={`Searching for "${searchQuery}"...`} size="lg" />
            ) : (
              <AnimeGridSkeleton count={20} />
            )}
          </div>
        )}

        {/* No Results */}
        {!loading && !error && mangaList.length === 0 && searchQuery && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No manga found
            </h3>
            <p className="text-gray-500 mb-4">
              No results found for "{searchQuery}". Try a different search term.
            </p>
            <button
              onClick={handleClearSearch}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200"
            >
              Browse Top Manga
            </button>
          </div>
        )}

        {/* Manga Stats */}
        {mangaList.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="border-r border-gray-200 last:border-r-0">
                <div className="text-3xl font-bold text-purple-600">
                  {mangaList.length}
                </div>
                <div className="text-gray-600 font-medium">Manga Series</div>
              </div>
              <div className="border-r border-gray-200 last:border-r-0">
                <div className="text-3xl font-bold text-pink-600">
                  {Math.round(
                    (mangaList.reduce(
                      (acc, manga) => acc + (manga.score || 0),
                      0
                    ) /
                      mangaList.filter((m) => m.score).length) *
                      10
                  ) / 10 || "N/A"}
                </div>
                <div className="text-gray-600 font-medium">Average Score</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-red-600">
                  {
                    mangaList.filter((manga) => manga.status === "Publishing")
                      .length
                  }
                </div>
                <div className="text-gray-600 font-medium">
                  Currently Publishing
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Manga Grid */}
        {mangaList.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
              {mangaList.map((manga) => (
                <MangaCard key={manga.mal_id} manga={manga} />
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="text-center">
                <button
                  onClick={loadMoreManga}
                  disabled={loading}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Loading...
                    </span>
                  ) : (
                    "Load More Manga"
                  )}
                </button>
              </div>
            )}

            {/* Results count */}
            <div className="text-center mt-4 text-sm text-gray-500">
              Showing {mangaList.length} manga
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Manga;
