// src/pages/CharacterDetails.jsx - Premium Character Details Page
import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getCharacterDetails } from "../services/anime";
import AnimeCard from "../components/AnimeCard";
// MangaCard removed - manga functionality disabled
import AnimatedGrid from "../components/AnimatedGrid";
import FavoriteButton from "../components/FavoriteButton";
import Loader, { CharacterDetailsSkeleton } from "../components/Loader";
import { usePrefersReducedMotion } from "../hooks/useAnimation";
import {
  formatTextToParagraphs,
  estimateReadingTime,
  parseCharacterAttributes,
} from "../utils/textUtils";

const CharacterDetails = () => {
  const { id } = useParams();
  const prefersReduced = usePrefersReducedMotion();
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
      id: "voices",
      label: `Voice Actors (${character.voices?.length || 0})`,
      icon: "🎤",
    },
  ];

  return (
    <motion.div
      className="min-h-screen bg-bg-primary text-text-primary"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: prefersReduced ? 0 : 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Premium Breadcrumb */}
        <motion.nav
          className="mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: prefersReduced ? 0 : 0.4 }}
        >
          <div className="flex items-center space-x-3 text-sm">
            <div className="flex items-center space-x-3 px-4 py-2 bg-surface-dark/30 backdrop-blur-sm rounded-xl border border-border/30">
              <Link
                to="/"
                className="text-accent-cyan hover:text-accent-purple transition-colors duration-200 font-medium"
              >
                Home
              </Link>
              <span className="text-border">›</span>
              <Link
                to="/characters"
                className="text-accent-purple hover:text-accent-pink transition-colors duration-200 font-medium"
              >
                Characters
              </Link>
              <span className="text-border">›</span>
              <span className="text-text-primary font-semibold">
                {character.name}
              </span>
            </div>
          </div>
        </motion.nav>

        {/* Premium Character Header */}
        <motion.div
          className="bg-gradient-to-br from-surface-dark/50 via-bg-secondary to-surface-dark/30 backdrop-blur-sm rounded-2xl border border-border/20 overflow-hidden mb-12 shadow-2xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: prefersReduced ? 0 : 0.6,
            delay: prefersReduced ? 0 : 0.2,
          }}
        >
          <div className="md:flex">
            {/* Premium Character Image */}
            <div className="md:w-1/3 lg:w-1/4 relative">
              <div className="relative overflow-hidden">
                <img
                  src={
                    character.images?.jpg?.image_url ||
                    character.images?.webp?.image_url ||
                    "/placeholder-anime.jpg"
                  }
                  alt={character.name}
                  className="w-full h-96 md:h-full object-cover transition-transform duration-500 hover:scale-105"
                  onError={(e) => {
                    e.target.src = "/placeholder-anime.jpg";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/50 via-transparent to-transparent" />
              </div>
            </div>

            {/* Premium Character Info */}
            <div className="md:w-2/3 lg:w-3/4 p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accent-purple via-accent-pink to-accent-cyan mb-3">
                    {character.name}
                  </h1>
                  {character.name_kanji && (
                    <p className="text-xl text-text-secondary mb-3 font-medium">
                      {character.name_kanji}
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-4">
                  {character.favorites && (
                    <div className="bg-gradient-to-r from-red-500/20 to-pink-500/20 backdrop-blur-sm text-red-400 px-6 py-3 rounded-xl font-bold border border-red-500/30 shadow-lg">
                      ❤️ {character.favorites.toLocaleString()}
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

              {/* Premium Nicknames */}
              {character.nicknames && character.nicknames.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-text-primary mb-3 flex items-center">
                    <span className="w-1.5 h-6 bg-gradient-to-b from-accent-purple to-accent-pink rounded-full mr-3"></span>
                    Also known as:
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {character.nicknames.map((nickname, index) => (
                      <span
                        key={index}
                        className="bg-gradient-to-r from-accent-purple/20 to-accent-pink/20 text-accent-purple border border-accent-purple/30 text-sm px-4 py-2 rounded-xl font-medium backdrop-blur-sm"
                      >
                        {nickname}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Premium Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                <motion.div
                  className="bg-gradient-to-br from-accent-cyan/20 to-accent-purple/20 backdrop-blur-sm p-4 rounded-xl text-center border border-accent-cyan/30 hover:border-accent-cyan/50 transition-all duration-300"
                  whileHover={{
                    scale: prefersReduced ? 1 : 1.05,
                    y: prefersReduced ? 0 : -2,
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="text-3xl font-black text-accent-cyan mb-1">
                    {character.anime?.length || 0}
                  </div>
                  <div className="text-text-secondary font-medium">Anime</div>
                </motion.div>

                <motion.div
                  className="bg-gradient-to-br from-accent-purple/20 to-accent-pink/20 backdrop-blur-sm p-4 rounded-xl text-center border border-accent-purple/30 hover:border-accent-purple/50 transition-all duration-300"
                  whileHover={{
                    scale: prefersReduced ? 1 : 1.05,
                    y: prefersReduced ? 0 : -2,
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="text-3xl font-black text-accent-purple mb-1">
                    {character.voices?.length || 0}
                  </div>
                  <div className="text-text-secondary font-medium">
                    Voice Actors
                  </div>
                </motion.div>

                <motion.div
                  className="bg-gradient-to-br from-red-500/20 to-pink-500/20 backdrop-blur-sm p-4 rounded-xl text-center border border-red-500/30 hover:border-red-500/50 transition-all duration-300"
                  whileHover={{
                    scale: prefersReduced ? 1 : 1.05,
                    y: prefersReduced ? 0 : -2,
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="text-3xl font-black text-red-400 mb-1">
                    {character.favorites
                      ? character.favorites.toLocaleString()
                      : "0"}
                  </div>
                  <div className="text-text-secondary font-medium">
                    Favorites
                  </div>
                </motion.div>
              </div>

              {/* Premium Character Key Info Preview */}
              {character.about &&
                (() => {
                  const { attributes } = parseCharacterAttributes(
                    character.about
                  );
                  if (attributes.length > 0) {
                    const keyAttributes = attributes.slice(0, 4);
                    return (
                      <div className="mb-8">
                        <h3 className="text-xl font-bold text-text-primary mb-4 flex items-center">
                          <span className="w-1.5 h-6 bg-gradient-to-b from-accent-cyan to-accent-purple rounded-full mr-3"></span>
                          Key Information
                        </h3>
                        <div className="bg-gradient-to-br from-surface-dark/30 to-surface-dark/10 backdrop-blur-sm rounded-xl p-6 border border-border/30">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {keyAttributes.map((attr, index) => (
                              <div
                                key={index}
                                className="flex items-center space-x-3"
                              >
                                <span className="w-2 h-2 bg-accent-cyan rounded-full flex-shrink-0"></span>
                                <span className="font-semibold text-text-primary text-sm">
                                  {attr.key}:
                                </span>
                                <span className="text-text-secondary text-sm truncate">
                                  {attr.value}
                                </span>
                              </div>
                            ))}
                          </div>
                          {attributes.length > 4 && (
                            <div className="mt-4 text-center">
                              <span className="text-sm text-accent-purple font-medium">
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
        </motion.div>

        {/* Premium Tabs */}
        <motion.div
          className="bg-gradient-to-br from-surface-dark/50 via-bg-secondary to-surface-dark/30 backdrop-blur-sm rounded-2xl border border-border/20 overflow-hidden shadow-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: prefersReduced ? 0 : 0.5,
            delay: prefersReduced ? 0 : 0.4,
          }}
        >
          {/* Premium Tab Navigation */}
          <div className="border-b border-border/30">
            <nav className="flex space-x-8 px-8 py-2">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-4 font-medium text-sm transition-all duration-300 relative ${
                    activeTab === tab.id
                      ? "text-accent-purple"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                  whileHover={{ scale: prefersReduced ? 1 : 1.02 }}
                  whileTap={{ scale: prefersReduced ? 1 : 0.98 }}
                >
                  <span className="mr-2 text-lg">{tab.icon}</span>
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-accent-purple to-accent-pink rounded-full"
                      layoutId="activeTab"
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </motion.button>
              ))}
            </nav>
          </div>

          {/* Premium Tab Content */}
          <div className="p-8">
            {/* Premium Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-8">
                {character.about && (
                  <motion.div
                    className="relative"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: prefersReduced ? 0 : 0.5 }}
                  >
                    <div className="flex items-center mb-8">
                      <div className="flex items-center space-x-4">
                        <motion.div
                          className="w-16 h-16 bg-gradient-to-br from-accent-purple to-accent-pink rounded-2xl flex items-center justify-center shadow-xl"
                          whileHover={{
                            scale: prefersReduced ? 1 : 1.05,
                            rotate: prefersReduced ? 0 : 5,
                          }}
                          transition={{ duration: 0.2 }}
                        >
                          <span className="text-white text-2xl">📖</span>
                        </motion.div>
                        <div>
                          <h3 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accent-purple via-accent-pink to-accent-cyan mb-2">
                            Character Biography
                          </h3>
                          <p className="text-lg text-text-secondary">
                            Learn more about {character.name}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="relative bg-gradient-to-br from-surface-dark/40 via-bg-secondary/30 to-surface-dark/20 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-border/20">
                      {/* Premium Decorative elements */}
                      <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-accent-purple/20 to-accent-pink/20 rounded-full opacity-20 -translate-x-16 -translate-y-16"></div>
                      <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-br from-accent-cyan/20 to-accent-purple/20 rounded-full opacity-20 translate-x-12 translate-y-12"></div>

                      {/* Premium Quote mark */}
                      <div className="absolute top-6 left-6 text-6xl text-accent-purple/30 font-serif leading-none select-none">
                        "
                      </div>

                      <div className="relative z-10 pl-8">
                        {/* Premium Reading indicators */}
                        <div className="mb-8 flex flex-wrap items-center gap-4 text-sm">
                          <div className="flex items-center space-x-2 bg-gradient-to-r from-accent-purple/20 to-accent-pink/20 backdrop-blur-sm px-4 py-2 rounded-xl border border-accent-purple/30">
                            <span className="w-2 h-2 bg-accent-purple rounded-full animate-pulse"></span>
                            <span className="font-medium text-accent-purple">
                              ~{estimateReadingTime(character.about)} min read
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 bg-gradient-to-r from-accent-cyan/20 to-accent-purple/20 backdrop-blur-sm px-4 py-2 rounded-xl border border-accent-cyan/30">
                            <span>📖</span>
                            <span className="font-medium text-accent-cyan">
                              Complete Biography
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 bg-gradient-to-r from-surface-dark/30 to-surface-dark/10 backdrop-blur-sm px-4 py-2 rounded-xl border border-border/30">
                            <span>👤</span>
                            <span className="font-medium text-text-primary">
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
                                {/* Premium Character Attributes */}
                                {attributes.length > 0 && (
                                  <div className="bg-gradient-to-br from-surface-dark/30 to-surface-dark/10 backdrop-blur-sm rounded-xl p-6 border border-border/30 mb-8">
                                    <h4 className="text-xl font-bold text-text-primary mb-6 flex items-center">
                                      <span className="w-1.5 h-6 bg-gradient-to-b from-accent-cyan to-accent-purple rounded-full mr-3"></span>
                                      <span className="mr-2">ℹ️</span>
                                      Character Information
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      {attributes.map((attr, index) => (
                                        <motion.div
                                          key={index}
                                          className="flex items-start space-x-3 p-4 bg-gradient-to-br from-bg-secondary/50 to-surface-dark/30 backdrop-blur-sm rounded-xl border border-border/20 hover:border-accent-purple/50 transition-all duration-300"
                                          whileHover={{
                                            scale: prefersReduced ? 1 : 1.02,
                                            y: prefersReduced ? 0 : -2,
                                          }}
                                          initial={{ opacity: 0, y: 10 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          transition={{
                                            duration: 0.3,
                                            delay: index * 0.1,
                                          }}
                                        >
                                          <div className="w-2 h-2 bg-accent-cyan rounded-full mt-2 flex-shrink-0"></div>
                                          <div>
                                            <span className="font-semibold text-accent-purple text-sm">
                                              {attr.key}:
                                            </span>
                                            <span className="text-text-primary ml-2 text-sm">
                                              {attr.value}
                                            </span>
                                          </div>
                                        </motion.div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Premium Character Description */}
                                {description && (
                                  <div className="text-text-primary leading-relaxed text-justify space-y-6">
                                    <h4 className="text-xl font-bold text-text-primary mb-6 flex items-center border-b border-border/30 pb-3">
                                      <span className="w-1.5 h-6 bg-gradient-to-b from-accent-purple to-accent-pink rounded-full mr-3"></span>
                                      <span className="mr-2">📖</span>
                                      Biography
                                    </h4>
                                    <div className="space-y-6">
                                      {formatTextToParagraphs(description).map(
                                        (paragraph, index) => (
                                          <motion.p
                                            key={index}
                                            className={`text-text-primary leading-loose ${
                                              index === 0
                                                ? "text-lg font-medium"
                                                : ""
                                            }`}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{
                                              duration: 0.5,
                                              delay: index * 0.1,
                                            }}
                                          >
                                            {paragraph}
                                          </motion.p>
                                        )
                                      )}
                                    </div>
                                  </div>
                                )}

                                {/* Premium Fallback if no attributes found */}
                                {attributes.length === 0 && (
                                  <div className="text-text-primary leading-relaxed text-justify space-y-6">
                                    <div className="space-y-6">
                                      {formatTextToParagraphs(
                                        character.about
                                      ).map((paragraph, index) => (
                                        <motion.p
                                          key={index}
                                          className={`text-text-primary leading-loose ${
                                            index === 0
                                              ? "text-lg font-medium"
                                              : ""
                                          }`}
                                          initial={{ opacity: 0, y: 20 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          transition={{
                                            duration: 0.5,
                                            delay: index * 0.1,
                                          }}
                                        >
                                          {paragraph}
                                        </motion.p>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })()}
                        </div>

                        {/* Premium Bottom accent */}
                        <div className="mt-8 pt-6 border-t border-border/30">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2 text-sm text-accent-purple">
                              <span className="w-2 h-2 bg-accent-purple rounded-full"></span>
                              <span className="font-medium">
                                Character Profile
                              </span>
                            </div>
                            <div className="text-xs text-text-secondary flex items-center space-x-2">
                              <span>Source: {character.name}</span>
                              <span>•</span>
                              <span>Anime Database</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            )}

            {/* Premium Anime Tab */}
            {activeTab === "anime" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: prefersReduced ? 0 : 0.5 }}
              >
                <h3 className="text-2xl font-bold text-text-primary mb-6 flex items-center">
                  <span className="w-1.5 h-6 bg-gradient-to-b from-accent-cyan to-accent-purple rounded-full mr-3"></span>
                  <span className="mr-2">🎌</span>
                  Anime Appearances ({character.anime?.length || 0})
                </h3>
                {character.anime && character.anime.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {character.anime.map((animeItem, index) => (
                      <motion.div
                        key={animeItem.anime.mal_id}
                        className="relative"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <AnimeCard anime={animeItem.anime} />
                        {animeItem.role && (
                          <div className="absolute top-2 left-2 bg-gradient-to-r from-accent-purple/90 to-accent-pink/90 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-xs font-medium border border-accent-purple/50">
                            {animeItem.role}
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-text-secondary">
                    <div className="text-6xl mb-4">🎌</div>
                    <p className="text-xl">No anime appearances found</p>
                  </div>
                )}
              </motion.div>
            )}

            {/* Premium Voice Actors Tab */}
            {activeTab === "voices" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: prefersReduced ? 0 : 0.5 }}
              >
                <h3 className="text-2xl font-bold text-text-primary mb-6 flex items-center">
                  <span className="w-1.5 h-6 bg-gradient-to-b from-accent-purple to-accent-pink rounded-full mr-3"></span>
                  <span className="mr-2">🎤</span>
                  Voice Actors ({character.voices?.length || 0})
                </h3>
                {character.voices && character.voices.length > 0 ? (
                  <div className="space-y-6">
                    {character.voices.map((voice, index) => (
                      <motion.div
                        key={index}
                        className="flex items-start space-x-6 p-6 bg-gradient-to-br from-surface-dark/30 to-surface-dark/10 backdrop-blur-sm rounded-xl border border-border/30 hover:border-accent-purple/50 transition-all duration-300"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        whileHover={{
                          scale: prefersReduced ? 1 : 1.02,
                          y: prefersReduced ? 0 : -2,
                        }}
                      >
                        <img
                          src={
                            voice.person?.images?.jpg?.image_url ||
                            "/placeholder-anime.jpg"
                          }
                          alt={voice.person?.name}
                          className="w-20 h-24 object-cover rounded-xl shadow-lg"
                          onError={(e) => {
                            e.target.src = "/placeholder-anime.jpg";
                          }}
                        />
                        <div className="flex-1">
                          <h4 className="text-xl font-bold text-text-primary mb-2">
                            {voice.person?.name}
                          </h4>
                          <p className="text-text-secondary mb-3 flex items-center">
                            <span className="w-2 h-2 bg-accent-cyan rounded-full mr-2"></span>
                            Language:{" "}
                            <span className="text-accent-cyan ml-1 font-medium">
                              {voice.language}
                            </span>
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-text-secondary">
                    <div className="text-6xl mb-4">🎤</div>
                    <p className="text-xl">
                      No voice actor information available
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Premium Back to Characters */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: prefersReduced ? 0 : 0.5, delay: 0.6 }}
        >
          <Link
            to="/characters"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-accent-purple to-accent-pink hover:from-accent-purple/80 hover:to-accent-pink/80 text-white rounded-xl transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <span className="mr-3 text-lg">←</span>
            Back to Characters
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CharacterDetails;
