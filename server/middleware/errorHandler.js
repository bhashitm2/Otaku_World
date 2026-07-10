// server/middleware/errorHandler.js

// Controllers use JSON responses directly in several places. Strip internal
// error details centrally in production so an unexpected upstream/database
// message is never reflected to clients.
export const redactProductionErrorDetails = (req, res, next) => {
  if (process.env.NODE_ENV !== "production") return next();

  const originalJson = res.json.bind(res);
  res.json = (body) => {
    if (
      body &&
      typeof body === "object" &&
      !Array.isArray(body) &&
      Object.hasOwn(body, "error")
    ) {
      const safeBody = { ...body };
      delete safeBody.error;
      return originalJson(safeBody);
    }

    return originalJson(body);
  };

  next();
};

// Global error handler middleware
export const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  // Default error
  let error = { ...err };
  error.message = err.message;

  // Body parsers reject oversized or malformed payloads before a route runs.
  if (err.type === "entity.too.large" || err.status === 413) {
    error = { message: "Request body is too large", statusCode: 413 };
  }

  if (err.type === "entity.parse.failed") {
    error = { message: "Malformed JSON request body", statusCode: 400 };
  }

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    const message = "Resource not found";
    error = { message, statusCode: 404 };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = "Duplicate field value entered";
    error = { message, statusCode: 400 };
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
    error = { message, statusCode: 400 };
  }

  // Firebase auth errors
  if (err.code && err.code.startsWith("auth/")) {
    error = { message: "Authentication failed", statusCode: 401 };
  }

  // Jikan API errors
  if (err.isAxiosError) {
    if (err.response?.status === 429) {
      error = { message: "API rate limit exceeded", statusCode: 429 };
    } else if (err.response?.status === 404) {
      error = { message: "Resource not found", statusCode: 404 };
    } else {
      error = { message: "External API error", statusCode: 502 };
    }
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
