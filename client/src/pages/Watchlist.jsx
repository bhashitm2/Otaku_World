// src/pages/Watchlist.jsx - Premium Watchlist Page
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useWatchlist } from "../hooks/useWatchlist";
import { useAuth } from "../hooks/useAuth";
import AnimeCard from "../components/AnimeCard";
import Loader from "../components/Loader";
import { usePrefersReducedMotion } from "../hooks/useAnimation";

const Watchlist = () => {
  const { user } = useAuth();
  const prefersReduced = usePrefersReducedMotion();
  const {
    watchlist,
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
            You need to be logged in to access your anime watchlist.
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

  const getDisplayData = () => {
    let data = watchlist;

    // Filter by status
    if (activeTab !== "all") {
      data = data.filter((item) => item.watchStatus === activeTab);
    }

    return data;
  };

  const displayData = getDisplayData();

  return (
    <motion.div 
      className="min-h-screen bg-bg-primary text-text-primary"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: prefersReduced ? 0 : 0.6 }}
    >
      {/* Premium Header Section */}
      <div className="relative bg-gradient-to-br from-bg-secondary via-surface-dark to-bg-primary overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-accent-purple/20 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_80%,rgba(59,130,246,0.1),transparent_50%)]" />
        
        <motion.div 
          className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
          initial={{ y: prefersReduced ? 0 : 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: prefersReduced ? 0 : 0.8, delay: prefersReduced ? 0 : 0.2 }}
        >
          {/* Premium Header */}
          <div className="text-center mb-12">
            <motion.div
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-accent-purple to-accent-cyan rounded-2xl mb-6 shadow-lg"
              whileHover={{ scale: prefersReduced ? 1 : 1.05, rotate: prefersReduced ? 0 : 5 }}
              transition={{ duration: 0.2 }}
            >
              <span className="text-3xl">📺</span>
            </motion.div>
            
            <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accent-purple via-accent-cyan to-accent-purple mb-6">
              My Watchlist
            </h1>
            
            <p className="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
              Track your anime viewing progress and manage your queue
            </p>
          </div>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Premium Stats */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: prefersReduced ? 0 : 0.6, delay: prefersReduced ? 0 : 0.4 }}
        >
          <motion.button 
            onClick={() => setActiveTab("all")}
            className={`bg-gradient-to-br from-surface-dark/30 to-surface-dark/10 backdrop-blur-sm p-4 rounded-xl text-center border transition-all duration-300 hover:scale-105 ${
              activeTab === "all" ? "border-accent-purple/50 bg-accent-purple/10" : "border-border/30 hover:border-accent-purple/50"
            }`}
            whileHover={{ scale: prefersReduced ? 1 : 1.02, y: prefersReduced ? 0 : -2 }}
          >
            <div className="text-2xl font-black text-text-primary mb-1">
              {totalWatchlist}
            </div>
            <div className="text-text-secondary text-sm font-medium">Total</div>
          </motion.button>
          
          <motion.button 
            onClick={() => setActiveTab("watching")}
            className={`bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm p-4 rounded-xl text-center border transition-all duration-300 hover:scale-105 ${
              activeTab === "watching" ? "border-green-500/50 bg-green-500/10" : "border-green-500/30 hover:border-green-500/50"
            }`}
            whileHover={{ scale: prefersReduced ? 1 : 1.02, y: prefersReduced ? 0 : -2 }}
          >
            <div className="text-2xl font-black text-green-400 mb-1">
              {watching.length}
            </div>
            <div className="text-text-secondary text-sm font-medium">Watching</div>
          </motion.button>
          
          <motion.button 
            onClick={() => setActiveTab("completed")}
            className={`bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm p-4 rounded-xl text-center border transition-all duration-300 hover:scale-105 ${
              activeTab === "completed" ? "border-blue-500/50 bg-blue-500/10" : "border-blue-500/30 hover:border-blue-500/50"
            }`}
            whileHover={{ scale: prefersReduced ? 1 : 1.02, y: prefersReduced ? 0 : -2 }}
          >
            <div className="text-2xl font-black text-blue-400 mb-1">
              {completed.length}
            </div>
            <div className="text-text-secondary text-sm font-medium">Completed</div>
          </motion.button>
          
          <motion.button 
            onClick={() => setActiveTab("plan_to_watch")}
            className={`bg-gradient-to-br from-accent-purple/20 to-accent-pink/20 backdrop-blur-sm p-4 rounded-xl text-center border transition-all duration-300 hover:scale-105 ${
              activeTab === "plan_to_watch" ? "border-accent-purple/50 bg-accent-purple/10" : "border-accent-purple/30 hover:border-accent-purple/50"
            }`}
            whileHover={{ scale: prefersReduced ? 1 : 1.02, y: prefersReduced ? 0 : -2 }}
          >
            <div className="text-2xl font-black text-accent-purple mb-1">
              {planToWatch.length}
            </div>
            <div className="text-text-secondary text-sm font-medium">Plan to Watch</div>
          </motion.button>
          
          <motion.button 
            onClick={() => setActiveTab("on_hold")}
            className={`bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-sm p-4 rounded-xl text-center border transition-all duration-300 hover:scale-105 ${
              activeTab === "on_hold" ? "border-yellow-500/50 bg-yellow-500/10" : "border-yellow-500/30 hover:border-yellow-500/50"
            }`}
            whileHover={{ scale: prefersReduced ? 1 : 1.02, y: prefersReduced ? 0 : -2 }}
          >
            <div className="text-2xl font-black text-yellow-400 mb-1">
              {onHold.length}
            </div>
            <div className="text-text-secondary text-sm font-medium">On Hold</div>
          </motion.button>
          
          <motion.button 
            onClick={() => setActiveTab("dropped")}
            className={`bg-gradient-to-br from-red-500/20 to-pink-500/20 backdrop-blur-sm p-4 rounded-xl text-center border transition-all duration-300 hover:scale-105 ${
              activeTab === "dropped" ? "border-red-500/50 bg-red-500/10" : "border-red-500/30 hover:border-red-500/50"
            }`}
            whileHover={{ scale: prefersReduced ? 1 : 1.02, y: prefersReduced ? 0 : -2 }}
          >
            <div className="text-2xl font-black text-red-400 mb-1">
              {dropped.length}
            </div>
            <div className="text-text-secondary text-sm font-medium">Dropped</div>
          </motion.button>
        </motion.div>

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
              Start exploring and add some anime to your watchlist!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {displayData.map((item) => {
              // Convert stored item back to component format
              // Handle empty or invalid image URLs
              const imageUrl = item.image && item.image.trim() !== '' 
                ? item.image 
                : "/placeholder-anime.jpg";
              
              const componentItem = {
                mal_id: item.itemId,
                title: item.title,
                images: {
                  jpg: {
                    image_url: imageUrl,
                    large_image_url: imageUrl,
                    small_image_url: imageUrl,
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

              // Debug: Log problematic images
              if (!item.image || item.image.trim() === '') {
                console.log(`Using placeholder for ${item.title} - original image:`, item.image);
              }

              // Create custom card with watchlist info
              const CardComponent = AnimeCard;

              return (
                <div key={`${item.type}-${item.itemId}`} className="relative">
                  <CardComponent anime={componentItem} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Watchlist;
