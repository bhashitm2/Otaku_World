// server/app.js
import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import {
  errorHandler,
  redactProductionErrorDetails,
} from "./middleware/errorHandler.js";
import { protectAndSync, admin } from "./middleware/auth.js";
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
import mangaRoutes from "./routes/mangaRoutes.js";
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
app.use(redactProductionErrorDetails);

// Apply rate limits before parsing a request body so oversized anonymous
// requests cannot consume parsing resources before being throttled.
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === "production" ? 300 : 1000,
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later",
    retryAfter: "15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(globalLimiter);
app.use(rateLimiter);

// General middleware
app.use(compression());
app.use(performanceMonitor);
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(express.json({ limit: "256kb" }));
app.use(express.urlencoded({ extended: false, limit: "32kb", parameterLimit: 100 }));
app.use(validateSecurity);

// Root route - API welcome message
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🎌 Welcome to Otaku World API",
    version: "1.0.0",
    status: "online",
    endpoints: {
      health: "/health",
      documentation: "/api",
      anime: "/api/anime",
      manga: "/api/manga",
      characters: "/api/characters",
      auth: "/api/auth",
      favorites: "/api/favorites",
      watchlist: "/api/watchlist",
    },
    developer: "Bhashit Maheshwari",
    timestamp: new Date().toISOString(),
  });
});

// Favicon handler
app.get("/favicon.ico", (req, res) => {
  res.status(204).end();
});

// Public health probes intentionally return only liveness information.
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use("/api/anime", animeRoutes);
app.use("/api/manga", mangaRoutes);
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
      ai: "/api/ai",
    },
    endpoints: { health: "/health" },
    rateLimit: {
      global: "1000 requests per 15 minutes",
      search: "100 requests per hour",
      authenticated: "500 requests per hour",
    },
  });
});

// Cache statistics are operational data and are restricted to application admins.
app.get("/api/cache/stats", protectAndSync, admin, async (req, res) => {
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
