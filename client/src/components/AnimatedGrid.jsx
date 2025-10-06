// src/components/AnimatedGrid.jsx - Premium animated grid component
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useStaggerAnimation,
  usePrefersReducedMotion,
} from "../hooks/useAnimation";
import EnhancedAnimeCard from "./EnhancedAnimeCard";

const AnimatedGrid = ({ items = [], loading = false, className = "" }) => {
  const [hoveredId, setHoveredId] = useState(null);
  const { getStaggerDelay } = useStaggerAnimation(items?.length || 0);
  const prefersReduced = usePrefersReducedMotion();

  // Handle undefined or empty items
  const safeItems = items || [];

  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: prefersReduced ? 0 : 0.6,
        staggerChildren: prefersReduced ? 0 : 0.05,
      },
    },
  };

  // Loading skeleton grid
  const LoadingSkeleton = () => (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}
    >
      {[...Array(12)].map((_, index) => (
        <motion.div
          key={index}
          className="bg-surface-secondary rounded-xl overflow-hidden"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            delay: prefersReduced ? 0 : index * 0.05,
            duration: prefersReduced ? 0 : 0.3,
          }}
        >
          <div className="shimmer w-full h-64" />
          <div className="p-4 space-y-3">
            <div className="shimmer h-6 w-3/4 rounded" />
            <div className="shimmer h-4 w-1/2 rounded" />
            <div className="shimmer h-4 w-2/3 rounded" />
          </div>
        </motion.div>
      ))}
    </div>
  );

  // Empty state
  const EmptyState = () => (
    <motion.div
      className="flex flex-col items-center justify-center py-20 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="text-6xl mb-4">🔍</div>
      <h3 className="text-xl font-semibold text-text-primary mb-2">
        No anime found
      </h3>
      <p className="text-text-secondary max-w-md">
        Try adjusting your search or filters to discover more anime series.
      </p>
    </motion.div>
  );

  // Show loading state
  if (loading) {
    return <LoadingSkeleton />;
  }

  // Show empty state
  if (!safeItems || safeItems.length === 0) {
    return <EmptyState />;
  }

  // Standard responsive grid with premium animations
  return (
    <motion.div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <AnimatePresence mode="popLayout">
        {safeItems.map((item, index) => (
          <EnhancedAnimeCard
            key={item.mal_id || index}
            anime={item}
            index={index}
            delay={getStaggerDelay(index)}
            onHover={setHoveredId}
            isHovered={hoveredId === item.mal_id}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

// Memoized version for performance
const MemoizedAnimatedGrid = React.memo(
  AnimatedGrid,
  (prevProps, nextProps) => {
    // Safe comparison with fallback for undefined items
    const prevLength = prevProps.items?.length || 0;
    const nextLength = nextProps.items?.length || 0;

    return prevLength === nextLength && prevProps.loading === nextProps.loading;
  }
);

export default MemoizedAnimatedGrid;
