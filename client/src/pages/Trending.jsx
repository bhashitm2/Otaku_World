// src/pages/Trending.jsx
import React, { useState, useEffect } from "react";
import { getTrendingAnime } from "../services/anime";
import AnimeCard from "../components/AnimeCard";
import Loader, { AnimeGridSkeleton } from "../components/Loader";

const Trending = () => {
  const [trendingAnime, setTrendingAnime] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadTrendingAnime();
  }, []);

  const loadTrendingAnime = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);

      const response = await getTrendingAnime(page);

      if (page === 1) {
        setTrendingAnime(response.data || []);
      } else {
        setTrendingAnime((prev) => [...prev, ...(response.data || [])]);
      }

      setHasMore(response.pagination?.has_next_page || false);
      setCurrentPage(page);
    } catch (err) {
      console.error("Error fetching trending anime:", err);
      setError("Failed to load trending anime. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const loadMoreAnime = async () => {
    const nextPage = currentPage + 1;
    loadTrendingAnime(nextPage);
  };

  const retryLoad = () => {
    loadTrendingAnime(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            <div className="text-6xl mb-4">🔥</div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Trending Anime
            </h1>
            <p className="text-xl text-orange-100 mb-6 max-w-3xl mx-auto">
              Discover the hottest anime that everyone's watching this season.
              Stay up-to-date with the latest releases and popular series.
            </p>
            <div className="bg-white bg-opacity-20 rounded-lg p-4 inline-block">
              <p className="text-orange-100">
                📺 Currently airing and most popular anime series
              </p>
            </div>
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
        {loading && trendingAnime.length === 0 && (
          <AnimeGridSkeleton count={20} />
        )}

        {/* No Results */}
        {!loading && !error && trendingAnime.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📺</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No trending anime found
            </h3>
            <p className="text-gray-500 mb-4">
              We couldn't load the trending anime at the moment.
            </p>
            <button
              onClick={retryLoad}
              className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors duration-200"
            >
              Retry
            </button>
          </div>
        )}

        {/* Trending Stats */}
        {trendingAnime.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="border-r border-gray-200 last:border-r-0">
                <div className="text-3xl font-bold text-orange-600">
                  {trendingAnime.length}
                </div>
                <div className="text-gray-600 font-medium">Trending Series</div>
              </div>
              <div className="border-r border-gray-200 last:border-r-0">
                <div className="text-3xl font-bold text-red-600">
                  {Math.round(
                    (trendingAnime.reduce(
                      (acc, anime) => acc + (anime.score || 0),
                      0
                    ) /
                      trendingAnime.length) *
                      10
                  ) / 10}
                </div>
                <div className="text-gray-600 font-medium">Average Score</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-pink-600">
                  {new Date().toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </div>
                <div className="text-gray-600 font-medium">Current Season</div>
              </div>
            </div>
          </div>
        )}

        {/* Anime Grid */}
        {trendingAnime.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
              {trendingAnime.map((anime) => (
                <AnimeCard key={anime.mal_id} anime={anime} />
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="text-center">
                <button
                  onClick={loadMoreAnime}
                  disabled={loading}
                  className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Loading...
                    </span>
                  ) : (
                    "Load More Trending"
                  )}
                </button>
              </div>
            )}

            {/* Results count */}
            <div className="text-center mt-4 text-sm text-gray-500">
              Showing {trendingAnime.length} trending anime
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Trending;
