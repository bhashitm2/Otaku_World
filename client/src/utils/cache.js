// src/utils/cache.js - Frontend caching utilities
class CacheManager {
  constructor() {
    this.memoryCache = new Map();
    this.defaultTTL = 30 * 60 * 1000; // 30 minutes
  }

  // Set cache with TTL
  set(key, data, ttl = this.defaultTTL) {
    const expiresAt = Date.now() + ttl;

    // Store in memory
    this.memoryCache.set(key, { data, expiresAt });

    // Store in localStorage for persistence
    try {
      const cacheItem = {
        data,
        expiresAt,
        timestamp: Date.now(),
      };
      localStorage.setItem(`cache_${key}`, JSON.stringify(cacheItem));
    } catch (error) {
      console.warn("Failed to cache to localStorage:", error);
    }
  }

  // Get from cache
  get(key) {
    // Try memory first
    const memoryItem = this.memoryCache.get(key);
    if (memoryItem && memoryItem.expiresAt > Date.now()) {
      return memoryItem.data;
    }

    // Try localStorage
    try {
      const stored = localStorage.getItem(`cache_${key}`);
      if (stored) {
        const cacheItem = JSON.parse(stored);
        if (cacheItem.expiresAt > Date.now()) {
          // Restore to memory cache
          this.memoryCache.set(key, {
            data: cacheItem.data,
            expiresAt: cacheItem.expiresAt,
          });
          return cacheItem.data;
        } else {
          // Expired, remove it
          localStorage.removeItem(`cache_${key}`);
        }
      }
    } catch (error) {
      console.warn("Failed to read from localStorage cache:", error);
    }

    return null;
  }

  // Check if cache exists and is valid
  has(key) {
    return this.get(key) !== null;
  }

  // Remove from cache
  delete(key) {
    this.memoryCache.delete(key);
    try {
      localStorage.removeItem(`cache_${key}`);
    } catch (error) {
      console.warn("Failed to remove from localStorage cache:", error);
    }
  }

  // Clear all cache
  clear() {
    this.memoryCache.clear();

    try {
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (key.startsWith("cache_")) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn("Failed to clear localStorage cache:", error);
    }
  }

  // Clean expired entries
  cleanup() {
    const now = Date.now();

    // Clean memory cache
    for (const [key, item] of this.memoryCache.entries()) {
      if (item.expiresAt <= now) {
        this.memoryCache.delete(key);
      }
    }

    // Clean localStorage cache
    try {
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (key.startsWith("cache_")) {
          try {
            const stored = localStorage.getItem(key);
            if (stored) {
              const cacheItem = JSON.parse(stored);
              if (cacheItem.expiresAt <= now) {
                localStorage.removeItem(key);
              }
            }
          } catch {
            // Invalid cache item, remove it
            localStorage.removeItem(key);
          }
        }
      });
    } catch (error) {
      console.warn("Failed to cleanup localStorage cache:", error);
    }
  }

  // Get cache statistics
  getStats() {
    const memorySize = this.memoryCache.size;

    let localStorageSize = 0;
    try {
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (key.startsWith("cache_")) {
          localStorageSize++;
        }
      });
    } catch (error) {
      console.warn("Failed to get localStorage stats:", error);
    }

    return {
      memoryItems: memorySize,
      localStorageItems: localStorageSize,
      lastCleanup: this.lastCleanup || "Never",
    };
  }

  // Auto cleanup every hour
  startAutoCleanup() {
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
      this.lastCleanup = new Date().toISOString();
    }, 60 * 60 * 1000); // 1 hour
  }

  stopAutoCleanup() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }
}

// Create singleton instance
export const cache = new CacheManager();

// Start auto cleanup
cache.startAutoCleanup();

// Cache keys for consistency
export const CACHE_KEYS = {
  TRENDING_ANIME: "trending_anime",
  TOP_ANIME: "top_anime",
  ANIME_DETAILS: (id) => `anime_details_${id}`,
  CHARACTER_DETAILS: (id) => `character_details_${id}`,
  TOP_CHARACTERS: "top_characters",
  ANIME_SEARCH: (query, page) => `anime_search_${query}_${page}`,
  CHARACTER_SEARCH: (query, page) => `character_search_${query}_${page}`,
  USER_FAVORITES: "user_favorites",
  USER_WATCHLIST: "user_watchlist",
};

// Helper function for cached API calls
export const withCache = async (key, apiCall, ttl) => {
  // Try cache first
  const cached = cache.get(key);
  if (cached) {
    return cached;
  }

  // Make API call
  const result = await apiCall();

  // Cache the result
  cache.set(key, result, ttl);

  return result;
};

export default cache;
