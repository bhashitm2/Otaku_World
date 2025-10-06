// src/utils/logger.js
const isDevelopment = import.meta.env.MODE === "development";

class Logger {
  static log(message, data = null) {
    if (isDevelopment) {
      console.log(`[INFO] ${message}`, data || "");
    }
  }

  static warn(message, data = null) {
    if (isDevelopment) {
      console.warn(`[WARN] ${message}`, data || "");
    }
  }

  static error(message, error = null) {
    console.error(`[ERROR] ${message}`, error || "");

    // In production, you could send to external service
    if (!isDevelopment && error) {
      this.reportError(message, error);
    }
  }

  static debug(message, data = null) {
    if (isDevelopment) {
      console.debug(`[DEBUG] ${message}`, data || "");
    }
  }

  static reportError(message, error) {
    // Send to monitoring service (Sentry, LogRocket, etc.)
    // For now, just track in localStorage for debugging
    try {
      const errorLog = {
        message,
        error: error.toString(),
        stack: error.stack,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
      };

      const logs = JSON.parse(localStorage.getItem("errorLogs") || "[]");
      logs.push(errorLog);

      // Keep only last 50 errors
      if (logs.length > 50) {
        logs.splice(0, logs.length - 50);
      }

      localStorage.setItem("errorLogs", JSON.stringify(logs));
    } catch (e) {
      console.error("Failed to log error:", e);
    }
  }

  static getErrorLogs() {
    try {
      return JSON.parse(localStorage.getItem("errorLogs") || "[]");
    } catch {
      return [];
    }
  }

  static clearErrorLogs() {
    localStorage.removeItem("errorLogs");
  }
}

export default Logger;
