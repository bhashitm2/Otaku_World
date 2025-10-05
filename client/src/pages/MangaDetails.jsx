// src/pages/MangaDetails.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getMangaDetails, formatMangaData } from "../services/anime";
import Loader, { MangaDetailsSkeleton } from "../components/Loader";
import {
  formatTextToParagraphs,
  estimateReadingTime,
} from "../utils/textUtils";

const MangaDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [manga, setManga] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadMangaDetails = useCallback(async (mangaId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await getMangaDetails(mangaId);
      const formattedManga = formatMangaData(response.data);
      setManga(formattedManga);
    } catch (err) {
      console.error("Error fetching manga details:", err);
      setError("Failed to load manga details. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (id) {
      loadMangaDetails(id);
    }
  }, [id, loadMangaDetails]);

  const retryLoad = () => {
    if (id) {
      loadMangaDetails(id);
    }
  };

  if (loading) {
    return <MangaDetailsSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900 flex items-center justify-center">
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
            <h3 className="text-lg font-semibold mb-2">Failed to Load Manga</h3>
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
              onClick={() => navigate("/manga")}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200"
            >
              Back to Browse
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!manga) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900 flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Manga not found</h2>
          <Link
            to="/manga"
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200"
          >
            Back to Browse
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900">
      {/* Back Button */}
      <div className="sticky top-0 z-10 bg-black bg-opacity-50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-white hover:text-purple-300 transition-colors duration-200 group"
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
                src={manga.image}
                alt={manga.title}
                className="w-full rounded-lg shadow-2xl"
                onError={(e) => {
                  e.target.src = "/placeholder-anime.jpg";
                }}
              />

              {/* Action Buttons */}
              <div className="mt-6 space-y-3">
                <button className="w-full bg-gradient-to-r from-pink-500 to-red-500 text-white py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-red-600 transition-all duration-200 transform hover:scale-105">
                  ❤️ Add to Favorites
                </button>
                <button className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-indigo-600 transition-all duration-200 transform hover:scale-105">
                  📚 Add to Reading List
                </button>
                {manga.url && (
                  <a
                    href={manga.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-3 rounded-lg font-semibold text-center hover:from-green-600 hover:to-teal-600 transition-all duration-200 transform hover:scale-105"
                  >
                    🔗 View on MyAnimeList
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-2 text-white">
            {/* Title Section */}
            <div className="mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {manga.title}
              </h1>

              {manga.titleEnglish && manga.titleEnglish !== manga.title && (
                <p className="text-xl text-gray-300 mb-2">
                  {manga.titleEnglish}
                </p>
              )}

              {manga.titleJapanese && (
                <p className="text-lg text-gray-400 mb-4">
                  {manga.titleJapanese}
                </p>
              )}

              {/* Rating and Stats */}
              <div className="flex flex-wrap gap-4 mb-6">
                {manga.score && (
                  <div className="bg-yellow-500 bg-opacity-20 border border-yellow-500 rounded-lg px-4 py-2">
                    <span className="text-yellow-400 font-bold">
                      ⭐ {manga.score}/10
                    </span>
                  </div>
                )}
                {manga.rank && (
                  <div className="bg-orange-500 bg-opacity-20 border border-orange-500 rounded-lg px-4 py-2">
                    <span className="text-orange-400 font-bold">
                      🏆 Rank #{manga.rank}
                    </span>
                  </div>
                )}
                {manga.popularity && (
                  <div className="bg-purple-500 bg-opacity-20 border border-purple-500 rounded-lg px-4 py-2">
                    <span className="text-purple-400 font-bold">
                      👥 #{manga.popularity}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Basic Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                {manga.type && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-1">
                      Type
                    </h3>
                    <p className="text-white">{manga.type}</p>
                  </div>
                )}

                {manga.chapters && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-1">
                      Chapters
                    </h3>
                    <p className="text-white">{manga.chapters}</p>
                  </div>
                )}

                {manga.volumes && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-1">
                      Volumes
                    </h3>
                    <p className="text-white">{manga.volumes}</p>
                  </div>
                )}

                {manga.status && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-1">
                      Status
                    </h3>
                    <p
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        manga.status === "Finished"
                          ? "bg-green-500 bg-opacity-20 text-green-400 border border-green-500"
                          : manga.status === "Publishing"
                          ? "bg-blue-500 bg-opacity-20 text-blue-400 border border-blue-500"
                          : "bg-yellow-500 bg-opacity-20 text-yellow-400 border border-yellow-500"
                      }`}
                    >
                      {manga.status}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {manga.year && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-1">
                      Year
                    </h3>
                    <p className="text-white">{manga.year}</p>
                  </div>
                )}

                {manga.published && manga.published.string && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-1">
                      Published
                    </h3>
                    <p className="text-white">{manga.published.string}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Authors */}
            {manga.authors && manga.authors.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
                  Authors
                </h3>
                <div className="flex flex-wrap gap-2">
                  {manga.authors.map((author) => (
                    <span
                      key={author.mal_id}
                      className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-opacity-20 border border-indigo-500 text-indigo-300 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {author.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Genres */}
            {manga.genres && manga.genres.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
                  Genres
                </h3>
                <div className="flex flex-wrap gap-2">
                  {manga.genres.map((genre) => (
                    <span
                      key={genre.mal_id}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 bg-opacity-20 border border-purple-500 text-purple-300 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Serializations */}
            {manga.serializations && manga.serializations.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
                  Serializations
                </h3>
                <div className="flex flex-wrap gap-2">
                  {manga.serializations.map((serialization) => (
                    <span
                      key={serialization.mal_id}
                      className="bg-gray-700 bg-opacity-50 border border-gray-600 text-gray-300 px-3 py-1 rounded-lg text-sm"
                    >
                      {serialization.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Synopsis */}
            {manga.synopsis && (
              <div className="mb-12">
                <div className="flex items-center mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white text-2xl">📖</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-1 gradient-text-manga">
                        Story Overview
                      </h3>
                      <p className="text-sm text-gray-400">
                        Dive into this captivating manga story
                      </p>
                    </div>
                  </div>
                </div>

                <div className="relative bg-gradient-to-br from-gray-800 via-gray-850 to-gray-900 rounded-2xl p-8 premium-shadow-dark border border-gray-700 overflow-hidden premium-about-container">
                  {/* Decorative background elements */}
                  <div className="absolute top-0 left-0 w-36 h-36 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full opacity-5 -translate-x-18 -translate-y-18 floating-element"></div>
                  <div className="absolute bottom-0 right-0 w-28 h-28 bg-gradient-to-br from-green-500 to-teal-600 rounded-full opacity-5 translate-x-14 translate-y-14 floating-element"></div>

                  {/* Japanese-style decoration */}
                  <div className="absolute top-6 right-6 text-6xl text-emerald-400 opacity-15 font-serif leading-none select-none floating-element">
                    書
                  </div>

                  <div className="relative z-10 pr-8">
                    {/* Reading info bar with manga-specific details */}
                    <div className="mb-6 flex items-center space-x-4 text-sm text-emerald-400">
                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                        <span>
                          ~{estimateReadingTime(manga.synopsis)} min read
                        </span>
                      </div>
                      <div className="text-gray-500">•</div>
                      <div className="flex items-center space-x-2">
                        <span>📚</span>
                        <span>Manga Synopsis</span>
                      </div>
                      <div className="text-gray-500">•</div>
                      <div className="text-gray-400">
                        {manga.type || "Manga"}
                      </div>
                    </div>

                    <div className="prose prose-lg prose-invert max-w-none premium-text-selection">
                      <div className="text-gray-100 leading-loose text-justify space-y-6">
                        {formatTextToParagraphs(manga.synopsis).map(
                          (paragraph, index) => (
                            <p
                              key={index}
                              className={`premium-paragraph text-gray-200 leading-relaxed text-lg ${
                                index === 0 ? "drop-cap-manga" : ""
                              }`}
                            >
                              {paragraph}
                            </p>
                          )
                        )}
                      </div>
                    </div>

                    {/* Enhanced manga-style bottom accent */}
                    <div className="mt-8 pt-6 border-t border-gray-700">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                            <div
                              className="w-2 h-2 bg-green-400 rounded-full animate-pulse"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-teal-400 rounded-full animate-pulse"
                              style={{ animationDelay: "0.4s" }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-emerald-400">
                            Official Summary
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 flex items-center space-x-2">
                          <span>{manga.title}</span>
                          {manga.volumes && (
                            <>
                              <span>•</span>
                              <span>
                                {manga.volumes} vol
                                {manga.volumes !== 1 ? "s" : ""}
                              </span>
                            </>
                          )}
                          {manga.chapters && (
                            <>
                              <span>•</span>
                              <span>
                                {manga.chapters} ch
                                {manga.chapters !== 1 ? "s" : ""}
                              </span>
                            </>
                          )}
                          {manga.status && (
                            <>
                              <span>•</span>
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${
                                  manga.status === "Finished"
                                    ? "bg-green-900 text-green-300"
                                    : manga.status === "Publishing"
                                    ? "bg-blue-900 text-blue-300"
                                    : "bg-gray-700 text-gray-300"
                                }`}
                              >
                                {manga.status}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Reading Guide */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
                📖 Reading Information
              </h3>
              <div className="bg-purple-800 bg-opacity-30 rounded-lg p-6 border border-purple-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  {manga.chapters && (
                    <div className="flex items-center gap-2">
                      <span className="text-purple-400">📄</span>
                      <span className="text-gray-300">
                        <strong>{manga.chapters}</strong> chapters available
                      </span>
                    </div>
                  )}
                  {manga.volumes && (
                    <div className="flex items-center gap-2">
                      <span className="text-purple-400">📚</span>
                      <span className="text-gray-300">
                        <strong>{manga.volumes}</strong> volumes published
                      </span>
                    </div>
                  )}
                  {manga.status && (
                    <div className="flex items-center gap-2">
                      <span className="text-purple-400">
                        {manga.status === "Publishing" ? "🔄" : "✅"}
                      </span>
                      <span className="text-gray-300">
                        Status: <strong>{manga.status}</strong>
                      </span>
                    </div>
                  )}
                  {manga.type && (
                    <div className="flex items-center gap-2">
                      <span className="text-purple-400">📋</span>
                      <span className="text-gray-300">
                        Type: <strong>{manga.type}</strong>
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-purple-600">
                  <div className="flex items-center gap-2 text-sm text-purple-200">
                    <span>💡</span>
                    <span>
                      {manga.status === "Publishing"
                        ? "This manga is currently being published. New chapters are released regularly!"
                        : "This manga has finished publication. You can read the complete story!"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MangaDetails;
