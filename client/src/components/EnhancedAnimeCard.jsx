// src/components/EnhancedAnimeCard.jsx - Premium anime card with hover effects
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Plus, Play, Star, Eye } from "lucide-react";
import {
  useHoverAnimation,
  usePrefersReducedMotion,
  usePrefetch,
} from "../hooks/useAnimation";
import OptimizedImage from "./ui/OptimizedImage";

const EnhancedAnimeCard = ({
  anime,
  index = 0,
  delay = 0,
  onHover,
  isHovered = false,
}) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const { hoverProps, getHoverScale, getHoverY } = useHoverAnimation();
  const prefersReduced = usePrefersReducedMotion();
  const { prefetchResource } = usePrefetch();

  // Handle hover events
  const handleMouseEnter = () => {
    onHover?.(anime.mal_id);
    hoverProps.onMouseEnter();

    // Prefetch anime details on hover
    prefetchResource(`/api/anime/${anime.mal_id}`);
  };

  const handleMouseLeave = () => {
    onHover?.(null);
    hoverProps.onMouseLeave();
  };

  // Card animation variants
  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: prefersReduced ? 0 : 0.6,
        delay: prefersReduced ? 0 : delay,
        ease: "easeOut",
      },
    },
  };

  // Action buttons animation
  const actionsVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1,
      },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
  };

  // Handle favorite toggle
  const handleFavorite = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);

    // Add haptic feedback if supported
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  // Handle watchlist toggle
  const handleWatchlist = (e) => {
    e.stopPropagation();
    setIsInWatchlist(!isInWatchlist);

    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  // Handle card click
  const handleCardClick = () => {
    // Navigate to anime details
    window.location.href = `/anime/${anime.mal_id}`;
  };

  return (
    <motion.div
      className="group relative bg-surface-primary rounded-xl overflow-hidden cursor-pointer transform-gpu"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleCardClick}
      style={{
        transform: `scale(${getHoverScale()}) translateY(${getHoverY()}px)`,
        transition: "transform 0.3s ease",
      }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <OptimizedImage
          src={
            anime.images?.jpg?.large_image_url ||
            anime.images?.jpg?.image_url ||
            "/placeholder-anime.jpg"
          }
          alt={anime.title || anime.title_english}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          priority={index < 8} // Prioritize first 8 images
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Rating Badge */}
        {anime.score && (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-black/70 rounded-lg backdrop-blur-sm">
            <Star className="w-3 h-3 text-accent-gold fill-current" />
            <span className="text-xs font-medium text-white">
              {anime.score}
            </span>
          </div>
        )}

        {/* Status Badge */}
        {anime.status && (
          <div className="absolute top-3 left-3 px-2 py-1 bg-accent-neon/90 text-black text-xs font-medium rounded-lg">
            {anime.status}
          </div>
        )}

        {/* Hover Actions */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          variants={actionsVariants}
          initial="hidden"
          animate={isHovered ? "visible" : "hidden"}
        >
          <div className="flex items-center gap-3">
            <motion.button
              className="p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
              variants={buttonVariants}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleFavorite}
              aria-label="Add to favorites"
            >
              <Heart
                className={`w-5 h-5 ${
                  isFavorite ? "fill-current text-red-500" : ""
                }`}
              />
            </motion.button>

            <motion.button
              className="p-4 bg-accent-neon text-black rounded-full hover:bg-accent-neon/80 transition-colors"
              variants={buttonVariants}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Play trailer"
            >
              <Play className="w-6 h-6 fill-current" />
            </motion.button>

            <motion.button
              className="p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
              variants={buttonVariants}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleWatchlist}
              aria-label="Add to watchlist"
            >
              <Plus
                className={`w-5 h-5 ${
                  isInWatchlist ? "rotate-45" : ""
                } transition-transform`}
              />
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="font-semibold text-text-primary text-lg mb-2 line-clamp-2 group-hover:text-accent-neon transition-colors">
          {anime.title || anime.title_english}
        </h3>

        {/* Meta Info */}
        <div className="flex items-center gap-4 text-text-tertiary text-sm mb-3">
          {anime.year && <span>{anime.year}</span>}
          {anime.episodes && (
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {anime.episodes} eps
            </span>
          )}
        </div>

        {/* Genres */}
        {anime.genres && anime.genres.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {anime.genres.slice(0, 3).map((genre, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-surface-secondary text-text-secondary text-xs rounded-md"
              >
                {genre.name}
              </span>
            ))}
            {anime.genres.length > 3 && (
              <span className="px-2 py-1 bg-surface-secondary text-text-secondary text-xs rounded-md">
                +{anime.genres.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Glow effect on hover */}
      <div className="absolute inset-0 rounded-xl border border-accent-neon/0 group-hover:border-accent-neon/30 transition-colors duration-300 pointer-events-none" />
    </motion.div>
  );
};

export default EnhancedAnimeCard;
