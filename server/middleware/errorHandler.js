// server/middleware/errorHandler.js

// Global error handler middleware
export const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  // Default error
  let error = { ...err };
  error.message = err.message;

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
