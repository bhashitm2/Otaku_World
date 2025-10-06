// src/pages/CharacterDetails.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { getCharacterDetails } from "../services/anime";
import AnimeCard from "../components/AnimeCard";
import MangaCard from "../components/MangaCard";
import FavoriteButton from "../components/FavoriteButton";
import Loader, { CharacterDetailsSkeleton } from "../components/Loader";
import {
  formatTextToParagraphs,
  estimateReadingTime,
  parseCharacterAttributes,
} from "../utils/textUtils";

const CharacterDetails = () => {
  const { id } = useParams();
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  const loadCharacterDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getCharacterDetails(id);

      if (response?.data) {
        setCharacter(response.data);
      } else {
        setError("Character not found");
      }
    } catch (err) {
      console.error("Error loading character details:", err);
      setError("Failed to load character details. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadCharacterDetails();
  }, [id, loadCharacterDetails]);

  if (loading) {
    return <CharacterDetailsSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link
            to="/characters"
            className="inline-block px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-200"
          >
            Back to Characters
          </Link>
        </div>
      </div>
    );
  }

  if (!character) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Character Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The character you're looking for doesn't exist.
          </p>
          <Link
            to="/characters"
            className="inline-block px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-200"
          >
            Browse Characters
          </Link>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: "📝" },
    {
      id: "anime",
      label: `Anime (${character.anime?.length || 0})`,
      icon: "🎌",
    },
    {
      id: "manga",
      label: `Manga (${character.manga?.length || 0})`,
      icon: "📚",
    },
    {
      id: "voices",
      label: `Voice Actors (${character.voices?.length || 0})`,
      icon: "🎤",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Link
              to="/"
              className="hover:text-indigo-600 transition-colors duration-200"
            >
              Home
            </Link>
            <span>›</span>
            <Link
              to="/characters"
              className="hover:text-indigo-600 transition-colors duration-200"
            >
              Characters
            </Link>
            <span>›</span>
            <span className="text-gray-900 font-medium">{character.name}</span>
          </div>
        </nav>

        {/* Character Header */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="md:flex">
            {/* Character Image */}
            <div className="md:w-1/3 lg:w-1/4">
              <img
                src={
                  character.images?.jpg?.image_url ||
                  character.images?.webp?.image_url ||
                  "/placeholder-anime.jpg"
                }
                alt={character.name}
                className="w-full h-96 md:h-full object-cover"
                onError={(e) => {
                  e.target.src = "/placeholder-anime.jpg";
                }}
              />
            </div>

            {/* Character Info */}
            <div className="md:w-2/3 lg:w-3/4 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {character.name}
                  </h1>
                  {character.name_kanji && (
                    <p className="text-lg text-gray-600 mb-2">
                      {character.name_kanji}
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-3">
                  {character.favorites && (
                    <div className="bg-red-100 text-red-800 px-4 py-2 rounded-lg font-semibold">
                      ❤️ {character.favorites.toLocaleString()} favorites
                    </div>
                  )}
                  <FavoriteButton
                    item={{
                      mal_id: character.mal_id,
                      name: character.name,
                      title: character.name,
                      images: character.images,
                      type: "character",
                    }}
                    size="lg"
                  />
                </div>
              </div>

              {/* Nicknames */}
              {character.nicknames && character.nicknames.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">
                    Also known as:
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {character.nicknames.map((nickname, index) => (
                      <span
                        key={index}
                        className="bg-indigo-100 text-indigo-800 text-sm px-3 py-1 rounded-full"
                      >
                        {nickname}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 p-3 rounded-lg text-center transform hover:scale-105 transition-transform duration-200">
                  <div className="text-2xl font-bold text-blue-600">
                    {character.anime?.length || 0}
                  </div>
                  <div className="text-sm text-blue-800">Anime Appearances</div>
                </div>
                <div className="bg-green-50 p-3 rounded-lg text-center transform hover:scale-105 transition-transform duration-200">
                  <div className="text-2xl font-bold text-green-600">
                    {character.manga?.length || 0}
                  </div>
                  <div className="text-sm text-green-800">
                    Manga Appearances
                  </div>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg text-center transform hover:scale-105 transition-transform duration-200">
                  <div className="text-2xl font-bold text-purple-600">
                    {character.voices?.length || 0}
                  </div>
                  <div className="text-sm text-purple-800">Voice Actors</div>
                </div>
                <div className="bg-red-50 p-3 rounded-lg text-center transform hover:scale-105 transition-transform duration-200">
                  <div className="text-2xl font-bold text-red-600">
                    {character.favorites
                      ? character.favorites.toLocaleString()
                      : "0"}
                  </div>
                  <div className="text-sm text-red-800">Fan Favorites</div>
                </div>
              </div>

              {/* Character Key Info Preview */}
              {character.about &&
                (() => {
                  const { attributes } = parseCharacterAttributes(
                    character.about
                  );
                  if (attributes.length > 0) {
                    const keyAttributes = attributes.slice(0, 4); // Show only first 4 key attributes
                    return (
                      <div className="mb-6">
                        <h3 className="text-md font-semibold text-gray-800 mb-3 flex items-center">
                          <span className="w-1 h-5 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full mr-2"></span>
                          Key Information
                        </h3>
                        <div className="bg-gradient-to-r from-gray-50 to-indigo-50 rounded-lg p-4 border border-gray-200">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {keyAttributes.map((attr, index) => (
                              <div
                                key={index}
                                className="flex items-center space-x-2"
                              >
                                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full flex-shrink-0"></span>
                                <span className="font-medium text-gray-700 text-sm">
                                  {attr.key}:
                                </span>
                                <span className="text-gray-600 text-sm truncate">
                                  {attr.value}
                                </span>
                              </div>
                            ))}
                          </div>
                          {attributes.length > 4 && (
                            <div className="mt-3 text-center">
                              <span className="text-xs text-indigo-600 font-medium">
                                View complete details in Biography →
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  }
                  return null;
                })()}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeTab === tab.id
                      ? "border-indigo-500 text-indigo-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-8">
                {character.about && (
                  <div className="relative">
                    <div className="flex items-center mb-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                          <span className="text-white text-xl">📖</span>
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 gradient-text">
                            Character Biography
                          </h3>
                          <p className="text-sm text-gray-500">
                            Learn more about {character.name}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="relative bg-gradient-to-br from-white via-indigo-50 to-purple-50 rounded-2xl p-8 premium-shadow border border-indigo-100 premium-about-container">
                      {/* Decorative elements */}
                      <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-full opacity-10 -translate-x-16 -translate-y-16 floating-element"></div>
                      <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full opacity-10 translate-x-12 translate-y-12 floating-element"></div>

                      {/* Quote mark */}
                      <div className="absolute top-6 left-6 text-6xl text-indigo-200 font-serif leading-none select-none floating-element">
                        "
                      </div>

                      <div className="relative z-10 pl-8">
                        {/* Reading time indicator */}
                        <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-indigo-600">
                          <div className="flex items-center space-x-2 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-200">
                            <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></span>
                            <span className="font-medium">
                              ~{estimateReadingTime(character.about)} min read
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 bg-purple-50 px-3 py-1.5 rounded-full border border-purple-200">
                            <span>📖</span>
                            <span className="font-medium text-purple-600">
                              Complete Biography
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
                            <span>�</span>
                            <span className="font-medium text-gray-600">
                              {character.name}
                            </span>
                          </div>
                        </div>

                        <div className="prose prose-lg max-w-none premium-text-selection">
                          {(() => {
                            const { attributes, description } =
                              parseCharacterAttributes(character.about);

                            return (
                              <div className="space-y-8">
                                {/* Character Attributes */}
                                {attributes.length > 0 && (
                                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
                                    <h4 className="text-lg font-semibold text-indigo-800 mb-4 flex items-center">
                                      <span className="mr-2">ℹ️</span>
                                      Character Information
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      {attributes.map((attr, index) => (
                                        <div
                                          key={index}
                                          className="flex items-start space-x-3 p-3 bg-white rounded-lg shadow-sm border border-indigo-100"
                                        >
                                          <div className="w-2 h-2 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></div>
                                          <div>
                                            <span className="font-semibold text-indigo-700 text-sm">
                                              {attr.key}:
                                            </span>
                                            <span className="text-gray-700 ml-2 text-sm">
                                              {attr.value}
                                            </span>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Character Description */}
                                {description && (
                                  <div className="text-gray-800 leading-relaxed text-justify space-y-6">
                                    <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center border-b border-indigo-200 pb-2">
                                      <span className="mr-2">📖</span>
                                      Biography
                                    </h4>
                                    {formatTextToParagraphs(description).map(
                                      (paragraph, index) => (
                                        <p
                                          key={index}
                                          className={`premium-paragraph text-gray-700 leading-loose ${
                                            index === 0 ? "drop-cap" : ""
                                          }`}
                                        >
                                          {paragraph}
                                        </p>
                                      )
                                    )}
                                  </div>
                                )}

                                {/* Fallback if no attributes found, show original text */}
                                {attributes.length === 0 && (
                                  <div className="text-gray-800 leading-relaxed text-justify space-y-6">
                                    {formatTextToParagraphs(
                                      character.about
                                    ).map((paragraph, index) => (
                                      <p
                                        key={index}
                                        className={`premium-paragraph text-gray-700 leading-loose ${
                                          index === 0 ? "drop-cap" : ""
                                        }`}
                                      >
                                        {paragraph}
                                      </p>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          })()}
                        </div>

                        {/* Bottom accent */}
                        <div className="mt-8 pt-6 border-t border-indigo-200">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2 text-sm text-indigo-600">
                              <span className="w-2 h-2 bg-indigo-400 rounded-full"></span>
                              <span className="font-medium">
                                Character Profile
                              </span>
                            </div>
                            <div className="text-xs text-gray-500 flex items-center space-x-2">
                              <span>Source: {character.name}</span>
                              <span>•</span>
                              <span>MyAnimeList Database</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Character URLs */}
                {character.url && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      External Links
                    </h3>
                    <a
                      href={character.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg transition-colors duration-200"
                    >
                      🔗 View on MyAnimeList
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* Anime Tab */}
            {activeTab === "anime" && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Anime Appearances ({character.anime?.length || 0})
                </h3>
                {character.anime && character.anime.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {character.anime.map((animeItem) => (
                      <div key={animeItem.anime.mal_id} className="relative">
                        <AnimeCard anime={animeItem.anime} />
                        {animeItem.role && (
                          <div className="absolute top-2 left-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
                            {animeItem.role}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-4xl mb-2">🎌</div>
                    <p>No anime appearances found</p>
                  </div>
                )}
              </div>
            )}

            {/* Manga Tab */}
            {activeTab === "manga" && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Manga Appearances ({character.manga?.length || 0})
                </h3>
                {character.manga && character.manga.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {character.manga.map((mangaItem) => (
                      <div key={mangaItem.manga.mal_id} className="relative">
                        <MangaCard manga={mangaItem.manga} />
                        {mangaItem.role && (
                          <div className="absolute top-2 left-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
                            {mangaItem.role}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-4xl mb-2">📚</div>
                    <p>No manga appearances found</p>
                  </div>
                )}
              </div>
            )}

            {/* Voice Actors Tab */}
            {activeTab === "voices" && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Voice Actors ({character.voices?.length || 0})
                </h3>
                {character.voices && character.voices.length > 0 ? (
                  <div className="space-y-4">
                    {character.voices.map((voice, index) => (
                      <div
                        key={index}
                        className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg"
                      >
                        <img
                          src={
                            voice.person?.images?.jpg?.image_url ||
                            "/placeholder-anime.jpg"
                          }
                          alt={voice.person?.name}
                          className="w-16 h-20 object-cover rounded-lg"
                          onError={(e) => {
                            e.target.src = "/placeholder-anime.jpg";
                          }}
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">
                            {voice.person?.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            Language: {voice.language}
                          </p>
                          {voice.person?.url && (
                            <a
                              href={voice.person.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                            >
                              View Profile
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-4xl mb-2">🎤</div>
                    <p>No voice actor information available</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Back to Characters */}
        <div className="mt-8 text-center">
          <Link
            to="/characters"
            className="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-200"
          >
            <span className="mr-2">←</span>
            Back to Characters
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CharacterDetails;
