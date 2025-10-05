// src/components/Loader.jsx
import React from "react";

const Loader = ({ size = "md", text = "Loading...", className = "" }) => {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  return (
    <div
      className={`flex flex-col items-center justify-center p-8 ${className}`}
    >
      <div
        className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-gray-300 border-t-blue-600 mb-4`}
      ></div>
      <p className="text-gray-600 text-sm font-medium">{text}</p>
    </div>
  );
};

// Skeleton loader for anime cards
export const AnimeCardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
      <div className="w-full h-64 bg-gray-300"></div>
      <div className="p-4">
        <div className="h-4 bg-gray-300 rounded mb-2"></div>
        <div className="h-3 bg-gray-300 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-300 rounded w-1/2"></div>
      </div>
    </div>
  );
};

// Grid skeleton for multiple anime cards
export const AnimeGridSkeleton = ({ count = 20 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 p-6">
      {Array.from({ length: count }, (_, i) => (
        <AnimeCardSkeleton key={i} />
      ))}
    </div>
  );
};

// Details page skeleton
export const AnimeDetailsSkeleton = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 animate-pulse">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Image skeleton */}
          <div className="lg:col-span-1">
            <div className="w-full h-96 bg-gray-700 rounded-lg"></div>
          </div>

          {/* Content skeleton */}
          <div className="lg:col-span-2 space-y-6">
            <div className="h-8 bg-gray-700 rounded w-3/4"></div>
            <div className="flex space-x-4">
              <div className="h-6 bg-gray-700 rounded w-20"></div>
              <div className="h-6 bg-gray-700 rounded w-16"></div>
              <div className="h-6 bg-gray-700 rounded w-24"></div>
            </div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-700 rounded"></div>
              <div className="h-4 bg-gray-700 rounded"></div>
              <div className="h-4 bg-gray-700 rounded w-5/6"></div>
            </div>
            <div className="flex space-x-2">
              <div className="h-8 bg-gray-700 rounded w-20"></div>
              <div className="h-8 bg-gray-700 rounded w-16"></div>
              <div className="h-8 bg-gray-700 rounded w-24"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Manga-specific details page skeleton
export const MangaDetailsSkeleton = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 animate-pulse">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Image skeleton */}
          <div className="lg:col-span-1">
            <div className="w-full h-96 bg-gray-700 rounded-lg"></div>
          </div>

          {/* Content skeleton */}
          <div className="lg:col-span-2 space-y-6">
            <div className="h-8 bg-gray-700 rounded w-3/4"></div>
            <div className="flex space-x-4">
              <div className="h-6 bg-gray-700 rounded w-24"></div>
              <div className="h-6 bg-gray-700 rounded w-20"></div>
              <div className="h-6 bg-gray-700 rounded w-28"></div>
            </div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-700 rounded"></div>
              <div className="h-4 bg-gray-700 rounded"></div>
              <div className="h-4 bg-gray-700 rounded w-5/6"></div>
            </div>
            {/* Manga-specific elements */}
            <div className="flex space-x-2">
              <div className="h-8 bg-gray-700 rounded w-16"></div>
              <div className="h-8 bg-gray-700 rounded w-20"></div>
              <div className="h-8 bg-gray-700 rounded w-18"></div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-700 rounded w-32"></div>
              <div className="h-3 bg-gray-700 rounded w-28"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Character-specific details page skeleton
export const CharacterDetailsSkeleton = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 animate-pulse">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb skeleton */}
        <div className="mb-6 flex space-x-2">
          <div className="h-4 bg-gray-300 rounded w-12"></div>
          <div className="h-4 bg-gray-300 rounded w-1"></div>
          <div className="h-4 bg-gray-300 rounded w-20"></div>
          <div className="h-4 bg-gray-300 rounded w-1"></div>
          <div className="h-4 bg-gray-300 rounded w-24"></div>
        </div>

        {/* Character Header */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="md:flex">
            <div className="md:w-1/3 lg:w-1/4">
              <div className="w-full h-96 md:h-full bg-gray-300"></div>
            </div>
            <div className="md:w-2/3 lg:w-3/4 p-6 space-y-4">
              <div className="h-8 bg-gray-300 rounded w-3/4"></div>
              <div className="h-5 bg-gray-300 rounded w-1/2"></div>
              <div className="flex flex-wrap gap-2">
                <div className="h-6 bg-gray-300 rounded-full w-16"></div>
                <div className="h-6 bg-gray-300 rounded-full w-20"></div>
                <div className="h-6 bg-gray-300 rounded-full w-18"></div>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-gray-200 p-3 rounded-lg">
                  <div className="h-6 bg-gray-300 rounded mb-1"></div>
                  <div className="h-4 bg-gray-300 rounded w-12"></div>
                </div>
                <div className="bg-gray-200 p-3 rounded-lg">
                  <div className="h-6 bg-gray-300 rounded mb-1"></div>
                  <div className="h-4 bg-gray-300 rounded w-14"></div>
                </div>
                <div className="bg-gray-200 p-3 rounded-lg">
                  <div className="h-6 bg-gray-300 rounded mb-1"></div>
                  <div className="h-4 bg-gray-300 rounded w-16"></div>
                </div>
                <div className="bg-gray-200 p-3 rounded-lg">
                  <div className="h-6 bg-gray-300 rounded mb-1"></div>
                  <div className="h-4 bg-gray-300 rounded w-18"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs skeleton */}
        <div className="bg-white rounded-lg shadow-lg">
          <div className="border-b border-gray-200 px-6">
            <div className="flex space-x-8">
              <div className="h-12 bg-gray-300 rounded w-20"></div>
              <div className="h-12 bg-gray-300 rounded w-16"></div>
              <div className="h-12 bg-gray-300 rounded w-18"></div>
              <div className="h-12 bg-gray-300 rounded w-24"></div>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="h-6 bg-gray-300 rounded w-1/3"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded w-4/5"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
