// server/middleware/performance.js - Performance monitoring middleware
import Logger from "../utils/logger.js";

// Performance monitoring middleware
export const performanceMonitor = (req, res, next) => {
  const startTime = Date.now();
  const startCpuUsage = process.cpuUsage();

  // Store original end method
  const originalEnd = res.end;

  // Override end method to capture metrics
  res.end = function (...args) {
    const endTime = Date.now();
    const duration = endTime - startTime;
    const cpuUsage = process.cpuUsage(startCpuUsage);

    // Log performance metrics
    const metrics = {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      cpuUser: `${Math.round(cpuUsage.user / 1000)}μs`,
      cpuSystem: `${Math.round(cpuUsage.system / 1000)}μs`,
      timestamp: new Date().toISOString(),
      userAgent: req.get("User-Agent"),
      ip: req.ip,
    };

    // Log slow requests (>2 seconds)
    if (duration > 2000) {
      Logger.warn("Slow request detected", metrics);
    }

    // Log errors
    if (res.statusCode >= 400) {
      Logger.error("Request error", metrics);
    }

    // In development, log all requests
    if (process.env.NODE_ENV === "development") {
      Logger.debug("Request completed", metrics);
    }

    // Call original end method
    originalEnd.apply(this, args);
  };

  next();
};

// Request size monitoring
export const requestSizeMonitor = (req, res, next) => {
  const maxSize = 10 * 1024 * 1024; // 10MB limit

  if (req.headers["content-length"]) {
    const size = parseInt(req.headers["content-length"]);
    if (size > maxSize) {
      return res.status(413).json({
        success: false,
        error: "Request entity too large",
        maxSize: "10MB",
      });
    }
  }

  next();
};

// Memory usage monitoring
export const memoryMonitor = (req, res, next) => {
  const memUsage = process.memoryUsage();
  const heapUsedMB = memUsage.heapUsed / 1024 / 1024;

  // Warn if memory usage is high (>500MB)
  if (heapUsedMB > 500) {
    Logger.warn("High memory usage detected", {
      heapUsed: `${Math.round(heapUsedMB)}MB`,
      heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)}MB`,
      rss: `${Math.round(memUsage.rss / 1024 / 1024)}MB`,
    });
  }

  next();
};
