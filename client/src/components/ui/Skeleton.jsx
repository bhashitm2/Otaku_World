// src/components/ui/Skeleton.jsx - Skeleton loading components
import React from "react";

// Base skeleton with shimmer animation
export const Skeleton = ({
  className = "",
  variant = "rectangular",
  width,
  height,
  animate = true,
  ...props
}) => {
  const baseClasses = "bg-surface-secondary relative overflow-hidden";

  const shimmerClasses = animate
    ? "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-surface-primary/20 before:to-transparent"
    : "";

  const variantClasses = {
    rectangular: "rounded-md",
    circular: "rounded-full",
    text: "rounded-sm h-4",
  };

  const style = {
    width,
    height,
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${shimmerClasses} ${className}`}
      style={style}
      {...props}
    />
  );
};

// Anime card skeleton
export const AnimeCardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden">
    <Skeleton className="w-full h-64" />
    <div className="p-4">
      <Skeleton className="h-4 mb-2" />
      <Skeleton className="h-3 w-3/4 mb-2" />
      <div className="flex gap-2 mb-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <div className="flex justify-between">
        <Skeleton className="h-3 w-12" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  </div>
);

// Character card skeleton
export const CharacterCardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden">
    <Skeleton className="w-full h-80" />
    <div className="p-4">
      <Skeleton className="h-5 mb-2" />
      <Skeleton className="h-3 w-2/3 mb-3" />
      <div className="flex justify-between">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  </div>
);

// Grid skeleton for loading states
export const GridSkeleton = ({
  count = 12,
  CardSkeleton = AnimeCardSkeleton,
  className = "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6",
}) => {
  const SkeletonComponent = CardSkeleton;

  return (
    <div className={className}>
      {Array(count)
        .fill(0)
        .map((_, index) => (
          <SkeletonComponent key={index} />
        ))}
    </div>
  );
};

// Details page skeleton
export const DetailsSkeleton = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    {/* Breadcrumb skeleton */}
    <div className="mb-8">
      <Skeleton className="h-8 w-64" />
    </div>

    {/* Header skeleton */}
    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-12">
      <div className="md:flex">
        <div className="md:w-1/3 lg:w-1/4">
          <Skeleton className="w-full h-96 md:h-full" />
        </div>
        <div className="md:w-2/3 lg:w-3/4 p-8">
          <Skeleton className="h-12 mb-4" />
          <Skeleton className="h-6 w-3/4 mb-6" />

          {/* Stats skeleton */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {Array(3)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="text-center p-4 bg-gray-50 rounded-xl">
                  <Skeleton className="h-8 w-12 mx-auto mb-2" />
                  <Skeleton className="h-4 w-16 mx-auto" />
                </div>
              ))}
          </div>

          {/* Description skeleton */}
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    </div>

    {/* Tabs skeleton */}
    <div className="bg-white rounded-2xl shadow-xl">
      <div className="border-b border-gray-200 px-8 py-4">
        <div className="flex space-x-8">
          {Array(3)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-8 w-24" />
            ))}
        </div>
      </div>
      <div className="p-8">
        <GridSkeleton count={8} />
      </div>
    </div>
  </div>
);

export default Skeleton;
