// server/utils/securityValidator.js
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import logger from "./logger.js";
import { isFirebaseAdminInitialized } from "./firebaseAdmin.js";

export const securityConfig = {
  // Helmet configuration for production security
  helmet: {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "https://apis.google.com"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:", "http:"],
        connectSrc: [
          "'self'",
          "https://api.jikan.moe",
          "https://identitytoolkit.googleapis.com",
        ],
        mediaSrc: ["'self'"],
        objectSrc: ["'none'"],
        childSrc: ["'none'"],
        workerSrc: ["'none'"],
        frameSrc: ["'none'"],
        upgradeInsecureRequests:
          process.env.NODE_ENV === "production" ? [] : null,
      },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
    referrerPolicy: { policy: "same-origin" },
  },

  // Rate limiting configuration
  rateLimiting: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
      error: "Too many requests from this IP",
      retryAfter: 900, // 15 minutes in seconds
    },
    standardHeaders: true,
    legacyHeaders: false,
    // Skip successful requests
    skipSuccessfulRequests: false,
    // Skip failed requests
    skipFailedRequests: false,
    // Custom key generator for additional security
    keyGenerator: (req) => {
      return req.ip + req.get("User-Agent");
    },
  },

  // API-specific rate limiting
  apiRateLimiting: {
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 200, // More requests for API endpoints
    message: {
      error: "API rate limit exceeded",
      retryAfter: 600,
    },
  },

  // Auth-specific rate limiting (stricter)
  authRateLimiting: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Only 5 auth attempts per 15 minutes
    message: {
      error: "Too many authentication attempts",
      retryAfter: 900,
    },
  },
};

// Security validation middleware
export const validateSecurity = (req, res, next) => {
  // Log security-relevant events
  const securityLog = {
    timestamp: new Date().toISOString(),
    ip: req.ip,
    userAgent: req.get("User-Agent"),
    method: req.method,
    path: req.path,
    headers: {
      origin: req.get("Origin"),
      referer: req.get("Referer"),
      authorization: req.get("Authorization") ? "present" : "absent",
    },
  };

  // Detect suspicious patterns
  const suspiciousPatterns = [
    /\.\.\//, // Directory traversal
    /<script/i, // XSS attempts
    /union.*select/i, // SQL injection
    /javascript:/i, // JavaScript injection
    /vbscript:/i, // VBScript injection
    /on\w+=/i, // Event handler injection
  ];

  const requestData =
    JSON.stringify(req.body) + req.url + JSON.stringify(req.query);
  const suspicious = suspiciousPatterns.some((pattern) =>
    pattern.test(requestData)
  );

  if (suspicious) {
    logger.warn("Suspicious request detected", {
      ...securityLog,
      suspiciousContent: true,
      blocked: true,
    });

    return res.status(403).json({
      error: "Request blocked for security reasons",
      timestamp: new Date().toISOString(),
    });
  }

  // Log normal requests in development
  if (process.env.NODE_ENV === "development") {
    logger.info("Security validation passed", securityLog);
  }

  next();
};

const developmentOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://otaku-world-nu.vercel.app"
];

const normalizeOrigin = (origin) => {
  try {
    const parsed = new URL(origin);
    if (!["http:", "https:"].includes(parsed.protocol)) return null;
    return parsed.origin;
  } catch {
    return null;
  }
};

const configuredOrigins = () =>
  [
    process.env.FRONTEND_URL,
    ...(process.env.ADDITIONAL_ALLOWED_ORIGINS || "").split(","),
    ...(process.env.NODE_ENV === "production" ? [] : developmentOrigins),
  ]
    .filter((origin) => typeof origin === "string")
    .map((origin) => origin.trim())
    .filter(Boolean)
    .map(normalizeOrigin)
    .filter(Boolean);

// CORS accepts only explicit origins. Preview or alternate deployments must be
// deliberately added through ADDITIONAL_ALLOWED_ORIGINS.
export const corsConfig = {
  origin: function (origin, callback) {
    const allowedOrigins = new Set(configuredOrigins());

    // Allow requests with no origin (mobile apps, etc.)
    if (!origin) return callback(null, true);

    if (allowedOrigins.has(origin)) {
      callback(null, true);
    } else {
      logger.warn("CORS blocked request", {
        origin,
        allowedOrigins: [...allowedOrigins],
      });
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: false,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
  ],
  exposedHeaders: ["X-Total-Count", "X-Rate-Limit-Remaining"],
  maxAge: 86400, // 24 hours
};

// Security headers validation
export const validateSecurityHeaders = (req, res, next) => {
  // Add security headers
  res.set({
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
    "Cache-Control": "no-cache, no-store, must-revalidate",
    Pragma: "no-cache",
    Expires: "0",
  });

  next();
};

// Environment-specific security checks
export const validateEnvironment = () => {
  const requiredEnvVars = [
    "MONGO_URI",
    "JWT_SECRET",
    "FIREBASE_PROJECT_ID",
    "FIREBASE_CLIENT_EMAIL",
    "FIREBASE_PRIVATE_KEY",
  ];

  const missing = requiredEnvVars.filter((env) => !process.env[env]);

  if (missing.length > 0) {
    logger.error("Missing required environment variables", { missing });
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }

  if (!isFirebaseAdminInitialized()) {
    logger.error("Firebase Admin SDK failed to initialize");
    throw new Error("Firebase Admin SDK initialization failed");
  }

  if (process.env.NODE_ENV === "production") {
    const productionOrigins = [
      process.env.FRONTEND_URL,
      ...(process.env.ADDITIONAL_ALLOWED_ORIGINS || "").split(","),
    ].filter(Boolean);

    if (productionOrigins.length === 0) {
      throw new Error("FRONTEND_URL is required in production");
    }

    const invalidOrigin = productionOrigins.find((origin) => {
      const normalized = normalizeOrigin(origin.trim());
      return !normalized || !normalized.startsWith("https://");
    });

    if (invalidOrigin) {
      throw new Error("Production CORS origins must be valid HTTPS origins");
    }
  }

  // Validate JWT secret strength
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    logger.warn("JWT_SECRET is too short, should be at least 32 characters");
  }

  logger.info("Environment security validation passed");
};

export default {
  securityConfig,
  validateSecurity,
  corsConfig,
  validateSecurityHeaders,
  validateEnvironment,
};
