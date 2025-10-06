// server/middleware/rateLimiter.js
import rateLimit from "express-rate-limit";

// Rate limiter for search endpoints
export const searchRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100, // limit each IP to 100 search requests per windowMs
  message: {
    success: false,
    message: "Too many search requests from this IP, please try again later",
    retryAfter: "1 hour",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter for authenticated users
export const authRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 500, // limit each IP to 500 requests per windowMs for authenticated users
  message: {
    success: false,
    message:
      "Too many requests from this authenticated user, please try again later",
    retryAfter: "1 hour",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// General rate limiter middleware
export const rateLimiter = (req, res, next) => {
  // Apply different rate limits based on the endpoint
  if (req.path.includes("/search")) {
    return searchRateLimiter(req, res, next);
  }

  if (req.headers.authorization) {
    return authRateLimiter(req, res, next);
  }

  // Default: no additional rate limiting (global limiter in app.js handles this)
  next();
};
