// src/pages/AnimeDetails.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  getAnimeDetails,
  formatAnimeData,
} from "../services/anime";
import { AnimeDetailsSkeleton } from "../components/Loader";
import FavoriteButton from "../components/FavoriteButton";
import WatchlistButton from "../components/WatchlistButton";
import {
  formatTextToParagraphs,
  estimateReadingTime,
} from "../utils/textUtils";

const AnimeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadAnimeDetails = useCallback(async (animeId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await getAnimeDetails(animeId);
      const formattedAnime = formatAnimeData(response.data);
      setAnime(formattedAnime);
    } catch (err) {
      console.error("Error fetching anime details:", err);
      setError("Failed to load anime details. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (id) {
      loadAnimeDetails(id);
    }
  }, [id, loadAnimeDetails]);

  const retryLoad = () => {
    if (id) {
      loadAnimeDetails(id);
    }
  };

  if (loading) {
    return <AnimeDetailsSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center">
        <div className="bg-white rounded-lg p-8 max-w-md mx-4 text-center">
          <div className="text-red-600 mb-4">
            <svg
              className="w-16 h-16 mx-auto mb-4"
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
            <h3 className="text-lg font-semibold mb-2">Failed to Load Anime</h3>
            <p className="text-gray-700 mb-4">{error}</p>
          </div>
          <div className="flex gap-4 justify-center">
            <button
              onClick={retryLoad}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate("/anime")}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200"
            >
              Back to Browse
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!anime) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Anime not found</h2>
          <Link
            to="/anime"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Back to Browse
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      {/* Back Button */}
      <div className="sticky top-0 z-10 bg-black bg-opacity-50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-white hover:text-blue-300 transition-colors duration-200 group"
          >
            <svg
              className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Image */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <img
                src={anime.image}
                alt={anime.title}
                className="w-full rounded-lg shadow-2xl"
                onError={(e) => {
                  e.target.src = "/placeholder-anime.jpg";
                }}
              />

              {/* Action Buttons */}
              <div className="mt-6 space-y-3">
                <div className="w-full">
                  <FavoriteButton
                    item={{ ...anime, mal_id: anime.id, type: "anime" }}
                    className="w-full h-12 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105"
                    size="lg"
                  />
                </div>
                <div className="w-full">
                  <WatchlistButton
                    item={{ ...anime, mal_id: anime.id, type: "anime" }}
                    className="w-full h-12 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105"
                    size="lg"
                  />
                </div>
                {anime.url && (
                  <a
                    href={anime.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-3 rounded-lg font-semibold text-center hover:from-green-600 hover:to-teal-600 transition-all duration-200 transform hover:scale-105"
                  >
                    🔗 View Full Details
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-2 text-white">
            {/* Title Section */}
            <div className="mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {anime.title}
              </h1>

              {anime.titleEnglish && anime.titleEnglish !== anime.title && (
                <p className="text-xl text-gray-300 mb-2">
                  {anime.titleEnglish}
                </p>
              )}

              {anime.titleJapanese && (
                <p className="text-lg text-gray-400 mb-4">
                  {anime.titleJapanese}
                </p>
              )}

              {/* Rating and Stats */}
              <div className="flex flex-wrap gap-4 mb-6">
                {anime.score && (
                  <div className="bg-yellow-500 bg-opacity-20 border border-yellow-500 rounded-lg px-4 py-2">
                    <span className="text-yellow-400 font-bold">
                      ⭐ {anime.score}/10
                    </span>
                  </div>
                )}
                {anime.rank && (
                  <div className="bg-orange-500 bg-opacity-20 border border-orange-500 rounded-lg px-4 py-2">
                    <span className="text-orange-400 font-bold">
                      🏆 Rank #{anime.rank}
                    </span>
                  </div>
                )}
                {anime.popularity && (
                  <div className="bg-purple-500 bg-opacity-20 border border-purple-500 rounded-lg px-4 py-2">
                    <span className="text-purple-400 font-bold">
                      👥 #{anime.popularity}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Basic Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                {anime.type && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-1">
                      Type
                    </h3>
                    <p className="text-white">{anime.type}</p>
                  </div>
                )}

                {anime.episodes && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-1">
                      Episodes
                    </h3>
                    <p className="text-white">{anime.episodes}</p>
                  </div>
                )}

                {anime.status && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-1">
                      Status
                    </h3>
                    <p
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        anime.status === "Finished Airing"
                          ? "bg-green-500 bg-opacity-20 text-green-400 border border-green-500"
                          : anime.status === "Currently Airing"
                          ? "bg-blue-500 bg-opacity-20 text-blue-400 border border-blue-500"
                          : "bg-yellow-500 bg-opacity-20 text-yellow-400 border border-yellow-500"
                      }`}
                    >
                      {anime.status}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {anime.year && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-1">
                      Year
                    </h3>
                    <p className="text-white">{anime.year}</p>
                  </div>
                )}

                {anime.season && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-1">
                      Season
                    </h3>
                    <p className="text-white capitalize">{anime.season}</p>
                  </div>
                )}

                {anime.rating && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-1">
                      Rating
                    </h3>
                    <p className="text-white">{anime.rating}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Genres */}
            {anime.genres && anime.genres.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
                  Genres
                </h3>
                <div className="flex flex-wrap gap-2">
                  {anime.genres.map((genre) => (
                    <span
                      key={genre.mal_id}
                      className="bg-gradient-to-r from-blue-500 to-purple-500 bg-opacity-20 border border-blue-500 text-blue-300 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Studios */}
            {anime.studios && anime.studios.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
                  Studios
                </h3>
                <div className="flex flex-wrap gap-2">
                  {anime.studios.map((studio) => (
                    <span
                      key={studio.mal_id}
                      className="bg-gray-700 bg-opacity-50 border border-gray-600 text-gray-300 px-3 py-1 rounded-lg text-sm"
                    >
                      {studio.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Synopsis */}
            {anime.synopsis && (
              <div className="mb-12">
                <div className="flex items-center mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white text-2xl">📚</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-1 gradient-text-anime">
                        Story Synopsis
                      </h3>
                      <p className="text-sm text-gray-400">
                        Discover what makes this anime special
                      </p>
                    </div>
                  </div>
                </div>

                <div className="relative bg-gradient-to-br from-gray-800 via-gray-850 to-gray-900 rounded-2xl p-8 premium-shadow-dark border border-gray-700 overflow-hidden premium-about-container">
                  {/* Decorative background elements */}
                  <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full opacity-5 translate-x-20 -translate-y-20 floating-element"></div>
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full opacity-5 -translate-x-16 translate-y-16 floating-element"></div>

                  {/* Quote decoration */}
                  <div className="absolute top-6 left-6 text-7xl text-blue-400 opacity-20 font-serif leading-none select-none floating-element">
                    "
                  </div>

                  <div className="relative z-10 pl-8">
                    {/* Reading info bar */}
                    <div className="mb-6 flex items-center space-x-4 text-sm text-blue-400">
                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
                        <span>
                          ~{estimateReadingTime(anime.synopsis)} min read
                        </span>
                      </div>
                      <div className="text-gray-500">•</div>
                      <div className="flex items-center space-x-2">
                        <span>🎌</span>
                        <span>Anime Synopsis</span>
                      </div>
                      <div className="text-gray-500">•</div>
                      <div className="text-gray-400">
                        {anime.year || "Year Unknown"}
                      </div>
                    </div>

                    <div className="prose prose-lg prose-invert max-w-none premium-text-selection">
                      <div className="text-gray-100 leading-loose text-justify space-y-6">
                        {formatTextToParagraphs(anime.synopsis).map(
                          (paragraph, index) => (
                            <p
                              key={index}
                              className={`premium-paragraph text-gray-200 leading-relaxed text-lg ${
                                index === 0 ? "drop-cap-dark" : ""
                              }`}
                            >
                              {paragraph}
                            </p>
                          )
                        )}
                      </div>
                    </div>

                    {/* Enhanced bottom accent bar */}
                    <div className="mt-8 pt-6 border-t border-gray-700">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                            <div
                              className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"
                              style={{ animationDelay: "0.4s" }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-blue-400">
                            Official Synopsis
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 flex items-center space-x-2">
                          <span>{anime.title}</span>
                          {anime.year && (
                            <>
                              <span>•</span>
                              <span>{anime.year}</span>
                            </>
                          )}
                          {anime.episodes && (
                            <>
                              <span>•</span>
                              <span>{anime.episodes} episodes</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Additional Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              {anime.duration && (
                <div>
                  <h3 className="text-gray-400 font-semibold mb-1">Duration</h3>
                  <p className="text-gray-300">{anime.duration}</p>
                </div>
              )}

              {anime.aired && anime.aired.string && (
                <div>
                  <h3 className="text-gray-400 font-semibold mb-1">Aired</h3>
                  <p className="text-gray-300">{anime.aired.string}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimeDetails;
