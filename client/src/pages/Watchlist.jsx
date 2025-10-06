// src/pages/Watchlist.jsx
import React, { useState } from "react";
import { useWatchlist } from "../hooks/useWatchlist";
import { useAuth } from "../hooks/useAuth";
import { WATCH_STATUS_OPTIONS } from "../services/firestoreService";
import AnimeCard from "../components/AnimeCard";
import MangaCard from "../components/MangaCard";
import Loader from "../components/Loader";

const Watchlist = () => {
  const { user } = useAuth();
  const {
    watchlist,
    animeWatchlist,
    mangaWatchlist,
    watching,
    completed,
    planToWatch,
    onHold,
    dropped,
    totalWatchlist,
    loading,
    error,
  } = useWatchlist();

  const [activeTab, setActiveTab] = useState("all");
  const [activeType, setActiveType] = useState("all"); // 'all', 'anime', 'manga'

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4">
            <svg
              className="mx-auto h-16 w-16 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Sign in to view your watchlist
          </h2>
          <p className="text-gray-600">
            You need to be logged in to access your anime and manga watchlist.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Watchlist</h1>
          </div>
          <Loader />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4">
            <svg
              className="mx-auto h-16 w-16 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-red-900 mb-4">
            Error Loading Watchlist
          </h2>
          <p className="text-red-600 mb-4">{error}</p>
        </div>
      </div>
    );
  }

  const statusTabs = [
    { id: "all", label: "All", count: totalWatchlist },
    {
      id: "watching",
      label: "Watching",
      count: watching.length,
      color: "bg-green-500",
    },
    {
      id: "completed",
      label: "Completed",
      count: completed.length,
      color: "bg-blue-500",
    },
    {
      id: "plan_to_watch",
      label: "Plan to Watch",
      count: planToWatch.length,
      color: "bg-purple-500",
    },
    {
      id: "on_hold",
      label: "On Hold",
      count: onHold.length,
      color: "bg-yellow-500",
    },
    {
      id: "dropped",
      label: "Dropped",
      count: dropped.length,
      color: "bg-red-500",
    },
  ];

  const typeTabs = [
    { id: "all", label: "All", count: totalWatchlist },
    { id: "anime", label: "Anime", count: animeWatchlist.length },
    { id: "manga", label: "Manga", count: mangaWatchlist.length },
  ];

  const getDisplayData = () => {
    let data = watchlist;

    // Filter by status
    if (activeTab !== "all") {
      data = data.filter((item) => item.watchStatus === activeTab);
    }

    // Filter by type
    if (activeType !== "all") {
      data = data.filter((item) => item.type === activeType);
    }

    return data;
  };

  const displayData = getDisplayData();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            My Watchlist
          </h1>
          <p className="text-gray-600">Track your anime and manga progress</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">
              {totalWatchlist}
            </div>
            <div className="text-gray-600 text-sm">Total</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {watching.length}
            </div>
            <div className="text-gray-600 text-sm">Watching</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {completed.length}
            </div>
            <div className="text-gray-600 text-sm">Completed</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {planToWatch.length}
            </div>
            <div className="text-gray-600 text-sm">Plan to Watch</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {onHold.length}
            </div>
            <div className="text-gray-600 text-sm">On Hold</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-2xl font-bold text-red-600">
              {dropped.length}
            </div>
            <div className="text-gray-600 text-sm">Dropped</div>
          </div>
        </div>

        {/* Type Filter */}
        <div className="flex justify-center mb-4">
          <div className="bg-white rounded-lg shadow-md p-1 flex">
            {typeTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveType(tab.id)}
                className={`
                  px-4 py-2 rounded-md font-medium transition-all duration-200 flex items-center space-x-2
                  ${
                    activeType === tab.id
                      ? "bg-gray-900 text-white shadow-md"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }
                `}
              >
                <span>{tab.label}</span>
                <span
                  className={`
                  px-2 py-1 text-xs rounded-full
                  ${
                    activeType === tab.id
                      ? "bg-white/20 text-white"
                      : "bg-gray-200 text-gray-600"
                  }
                `}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Status Tabs */}
        <div className="flex flex-wrap justify-center mb-8">
          <div className="bg-white rounded-lg shadow-md p-1 flex flex-wrap gap-1">
            {statusTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  px-4 py-2 rounded-md font-medium transition-all duration-200 flex items-center space-x-2
                  ${
                    activeTab === tab.id
                      ? tab.color
                        ? `${tab.color} text-white shadow-md`
                        : "bg-blue-600 text-white shadow-md"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }
                `}
              >
                <span>{tab.label}</span>
                <span
                  className={`
                  px-2 py-1 text-xs rounded-full
                  ${
                    activeTab === tab.id
                      ? "bg-white/20 text-white"
                      : "bg-gray-200 text-gray-600"
                  }
                `}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {displayData.length === 0 ? (
          <div className="text-center py-12">
            <div className="mb-4">
              <svg
                className="mx-auto h-16 w-16 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No items in your watchlist yet
            </h3>
            <p className="text-gray-600">
              Start exploring and add some anime or manga to your watchlist!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {displayData.map((item) => {
              // Convert stored item back to component format
              const componentItem = {
                mal_id: item.itemId,
                title: item.title,
                images: {
                  jpg: {
                    image_url: item.image,
                    large_image_url: item.image,
                  },
                },
                score: item.score,
                status: item.status,
                genres: item.genres,
                episodes: item.episodes,
                chapters: item.chapters,
                volumes: item.volumes,
                type: item.type,
              };

              // Create custom card with watchlist info
              const CardComponent =
                item.type === "anime" ? AnimeCard : MangaCard;

              return (
                <div key={`${item.type}-${item.itemId}`} className="relative">
                  <CardComponent {...{ [item.type]: componentItem }} />

                  {/* Watchlist Status Overlay */}
                  <div className="absolute top-2 left-2 z-10">
                    <span
                      className={`
                      px-2 py-1 rounded-md text-xs font-semibold text-white
                      ${
                        WATCH_STATUS_OPTIONS.find(
                          (opt) => opt.value === item.watchStatus
                        )?.color || "bg-gray-500"
                      }
                    `}
                    >
                      {WATCH_STATUS_OPTIONS.find(
                        (opt) => opt.value === item.watchStatus
                      )?.label || item.watchStatus}
                    </span>
                  </div>

                  {/* Progress Info */}
                  {(item.progress > 0 || item.userScore) && (
                    <div className="absolute bottom-16 left-2 right-2 bg-black bg-opacity-75 text-white p-2 rounded-md text-xs">
                      {item.progress > 0 && (
                        <div>
                          Progress: {item.progress}/
                          {item.episodes || item.chapters || "?"}
                        </div>
                      )}
                      {item.userScore && (
                        <div>Your Score: {item.userScore}/10</div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Watchlist;
