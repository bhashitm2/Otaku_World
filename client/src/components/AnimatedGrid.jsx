// src/components/AnimatedGrid.jsx - Grid component matching character cards style
import React from "react";
import EnhancedAnimeCard from "./EnhancedAnimeCard";

const AnimatedGrid = ({ items = [], loading = false, className = "" }) => {
  // Handle undefined or empty items
  const safeItems = items || [];

  // Loading skeleton grid
  const LoadingSkeleton = () => (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}
    >
      {[...Array(12)].map((_, index) => (
        <div
          key={index}
          className="bg-gray-900 rounded-lg overflow-hidden animate-pulse"
        >
          <div className="bg-gray-800 w-full h-64" />
          <div className="p-4 space-y-3">
            <div className="bg-gray-800 h-6 w-3/4 rounded" />
            <div className="bg-gray-800 h-4 w-1/2 rounded" />
            <div className="bg-gray-800 h-4 w-2/3 rounded" />
          </div>
        </div>
      ))}
    </div>
  );

  // Empty state
  const EmptyState = () => (
    <div
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <div className="text-6xl mb-4">🔍</div>
      <h3 className="text-xl font-semibold text-text-primary mb-2">
        No anime found
      </h3>
      <p className="text-text-secondary max-w-md">
        Try adjusting your search or filters to discover more anime series.
      </p>
    </div>
  );

  // Show loading state
  if (loading) {
    return <LoadingSkeleton />;
  }

  // Show empty state
  if (!safeItems || safeItems.length === 0) {
    return <EmptyState />;
  }

  // Deduplicate items based on mal_id
  const uniqueItems = safeItems.reduce((acc, item) => {
    const id = item.mal_id || item.id;
    if (id && !acc.seen.has(id)) {
      acc.seen.add(id);
      acc.items.push(item);
    }
    return acc;
  }, { seen: new Set(), items: [] }).items;

  // Standard responsive grid matching character cards
  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 ${className}`}
    >
      {uniqueItems.map((item, index) => (
        <EnhancedAnimeCard
          key={`anime-${item.mal_id || item.id}-${index}`}
          anime={item}
          index={index}
        />
      ))}
    </div>
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
