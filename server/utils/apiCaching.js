// server/utils/apiCaching.js
import NodeCache from "node-cache";

// Create cache instance with TTL from environment or default 30 minutes
const stdTTL = parseInt(process.env.CACHE_TTL) || 1800;

export const cache = new NodeCache({
  stdTTL,
  checkperiod: 120, // Check for expired keys every 2 minutes
  useClones: false, // Better performance, don't clone objects
  deleteOnExpire: true,
  enableLegacyCallbacks: false,
  maxKeys: 10000, // Limit cache size
});

// Cache statistics and monitoring
export const getCacheStats = () => {
  return {
    keys: cache.keys().length,
    stats: cache.getStats(),
    memory: process.memoryUsage(),
  };
};

// Clear cache manually if needed
export const clearCache = (pattern = null) => {
  if (pattern) {
    const keys = cache.keys();
    const matchingKeys = keys.filter((key) => key.includes(pattern));
    cache.del(matchingKeys);
    return matchingKeys.length;
  } else {
    cache.flushAll();
    return "all";
  }
};

// Cache middleware for Express routes
export const cacheMiddleware = (duration = stdTTL) => {
  return (req, res, next) => {
    const key = `${req.method}:${req.originalUrl}`;
    const cached = cache.get(key);

    if (cached) {
      return res.json({
        ...cached,
        cached: true,
        cacheTimestamp: new Date().toISOString(),
      });
    }

    // Store original json method
    const originalJson = res.json;

    // Override json method to cache response
    res.json = function (data) {
      cache.set(key, data, duration);
      originalJson.call(this, data);
    };

    next();
  };
};

export default cache;
