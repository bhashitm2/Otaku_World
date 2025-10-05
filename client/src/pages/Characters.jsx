// src/pages/Characters.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { searchCharacters, getTopCharacters } from "../services/anime";
import CharacterCard from "../components/CharacterCard";
import SearchBar from "../components/SearchBar";
import Loader from "../components/Loader";

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

  // Load initial top characters
  useEffect(() => {
    loadTopCharacters();
  }, []);

  const loadTopCharacters = async () => {
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
  };

  const handleSearch = async (query) => {
    if (!query.trim()) {
      loadTopCharacters();
      return;
    }

    try {
      setSearching(true);
      setError(null);
      setSearchTerm(query);
      setIsSearchMode(true);

      const response = await searchCharacters(query, 1);

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
  };

  const loadMoreCharacters = async (page) => {
    try {
      setLoading(true);
      setError(null);

      let response;
      if (isSearchMode && searchTerm) {
        response = await searchCharacters(searchTerm, page);
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

  const clearSearch = () => {
    setSearchTerm("");
    setIsSearchMode(false);
    loadTopCharacters();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🎭 Anime Characters
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover your favorite anime characters, from legendary heroes to
            memorable villains.
            {isSearchMode
              ? ` Showing results for "${searchTerm}"`
              : " Browse the most popular characters from anime and manga."}
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search for characters (e.g., Naruto, Goku, Luffy)..."
            loading={searching}
          />

          {isSearchMode && (
            <div className="mt-4 text-center">
              <button
                onClick={clearSearch}
                className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200"
              >
                <span className="mr-2">✕</span>
                Clear search and show top characters
              </button>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <Link
            to="/anime"
            className="px-6 py-3 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg transition-colors duration-200 font-medium"
          >
            🎌 Browse Anime
          </Link>
          <Link
            to="/manga"
            className="px-6 py-3 bg-green-100 hover:bg-green-200 text-green-800 rounded-lg transition-colors duration-200 font-medium"
          >
            📚 Browse Manga
          </Link>
          <Link
            to="/trending"
            className="px-6 py-3 bg-purple-100 hover:bg-purple-200 text-purple-800 rounded-lg transition-colors duration-200 font-medium"
          >
            🔥 Trending Now
          </Link>
        </div>

        {/* Results Info */}
        {characters.length > 0 && !loading && (
          <div className="mb-6 text-center text-gray-600">
            {isSearchMode ? (
              <p>
                Found {characters.length} character
                {characters.length !== 1 ? "s" : ""} matching "{searchTerm}"
              </p>
            ) : (
              <p>Showing {characters.length} top characters</p>
            )}
            {totalPages > 1 && (
              <p className="text-sm mt-1">
                Page {currentPage} of {totalPages}
              </p>
            )}
          </div>
        )}

        {/* Characters Grid */}
        {loading && characters.length === 0 ? (
          <Loader />
        ) : characters.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
              {characters.map((character) => (
                <CharacterCard
                  key={`${character.mal_id}-${character.name}`}
                  character={character}
                />
              ))}
            </div>

            {/* Load More Button */}
            {hasNextPage && (
              <div className="text-center">
                <button
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-lg transition-colors duration-200 font-medium"
                >
                  {loading ? (
                    <>
                      <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                      Loading...
                    </>
                  ) : (
                    "Load More Characters"
                  )}
                </button>
              </div>
            )}
          </>
        ) : !loading ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {isSearchMode ? "No characters found" : "No characters available"}
            </h3>
            <p className="text-gray-600 mb-4">
              {isSearchMode
                ? `No characters match "${searchTerm}". Try a different search term.`
                : "Unable to load characters at the moment. Please try again later."}
            </p>
            {isSearchMode && (
              <button
                onClick={clearSearch}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-200"
              >
                Show Top Characters
              </button>
            )}
          </div>
        ) : null}

        {/* Quick Links */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Explore More
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/anime"
                className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200"
              >
                Popular Anime Series
              </Link>
              <span className="text-gray-300">•</span>
              <Link
                to="/manga"
                className="text-green-600 hover:text-green-800 hover:underline transition-colors duration-200"
              >
                Top Manga Titles
              </Link>
              <span className="text-gray-300">•</span>
              <Link
                to="/trending"
                className="text-purple-600 hover:text-purple-800 hover:underline transition-colors duration-200"
              >
                Trending Content
              </Link>
              <span className="text-gray-300">•</span>
              <Link
                to="/"
                className="text-indigo-600 hover:text-indigo-800 hover:underline transition-colors duration-200"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Characters;
