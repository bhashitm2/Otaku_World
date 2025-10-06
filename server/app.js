// server/app.js
import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { errorHandler } from "./middleware/errorHandler.js";
import { rateLimiter } from "./middleware/rateLimiter.js";
import { performanceMonitor, memoryMonitor } from "./middleware/performance.js";
import {
  securityConfig,
  validateSecurity,
  corsConfig,
  validateSecurityHeaders,
  validateEnvironment,
} from "./utils/securityValidator.js";

// Import routes
import animeRoutes from "./routes/animeRoutes.js";
// mangaRoutes removed - manga functionality disabled
import characterRoutes from "./routes/characterRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import favoritesRoutes from "./routes/favoritesRoutes.js";
import watchlistRoutes from "./routes/watchlistRoutes.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();

// Validate environment security
validateEnvironment();

// Enhanced security middleware
app.use(helmet(securityConfig.helmet));
app.use(cors(corsConfig));
app.use(validateSecurityHeaders);
app.use(validateSecurity);

// General middleware
app.use(compression());
app.use(performanceMonitor);
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Global rate limiting
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === "production" ? 1000 : 2000, // More lenient in development
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later",
    retryAfter: "15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(globalLimiter);

// Custom rate limiter for specific routes
app.use(rateLimiter);

// Enhanced health check endpoint
app.get("/health", async (req, res) => {
  const startTime = Date.now();

  try {
    // Basic health info
    const healthData = {
      success: true,
      status: "ok",
      message: "Otaku World API is running",
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || "1.0.0",
      environment: process.env.NODE_ENV || "development",
      uptime: process.uptime(),
      responseTime: Date.now() - startTime,
    };

    // Memory usage
    const memUsage = process.memoryUsage();
    healthData.memory = {
      rss: Math.round(memUsage.rss / 1024 / 1024) + " MB",
      heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024) + " MB",
      heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024) + " MB",
      external: Math.round(memUsage.external / 1024 / 1024) + " MB",
    };

    // If cache stats are available
    if (typeof getCacheStats === "function") {
      try {
        const { getCacheStats } = await import("./utils/apiCaching.js");
        healthData.cache = getCacheStats();
      } catch (error) {
        healthData.cache = { error: "Cache stats unavailable" };
      }
    }

    res.status(200).json(healthData);
  } catch (error) {
    res.status(500).json({
      success: false,
      status: "error",
      message: "Health check failed",
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// API routes
app.use("/api/anime", animeRoutes);
// app.use("/api/manga", mangaRoutes); // manga functionality disabled
app.use("/api/characters", characterRoutes);
app.use("/api/users", userRoutes);
app.use("/api/favorites", favoritesRoutes);
app.use("/api/watchlist", watchlistRoutes);
app.use("/api/auth", authRoutes);

// API documentation endpoint
app.get("/api", (req, res) => {
  res.json({
    success: true,
    message: "Otaku World API v1.0",
    documentation: {
      anime: "/api/anime",
      characters: "/api/characters",
      users: "/api/users",
      favorites: "/api/favorites",
      watchlist: "/api/watchlist",
      auth: "/api/auth",
    },
    endpoints: {
      health: "/health",
      cache: "/api/cache/stats",
    },
    rateLimit: {
      global: "1000 requests per 15 minutes",
      search: "100 requests per hour",
      authenticated: "500 requests per hour",
    },
  });
});

// Cache statistics endpoint (for monitoring)
app.get("/api/cache/stats", async (req, res) => {
  try {
    const { getCacheStats } = await import("./utils/apiCaching.js");
    const stats = getCacheStats();
    res.json({
      success: true,
      cache: stats,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve cache statistics",
      error: error.message,
    });
  }
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found",
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString(),
  });
});

// Global error handler (must be last middleware)
app.use(errorHandler);

export default app;
