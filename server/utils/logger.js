// server/utils/logger.js - Server-side logging utility
import fs from "fs";
import path from "path";

class Logger {
  constructor() {
    this.isDevelopment = process.env.NODE_ENV === "development";
    this.logDir = path.join(process.cwd(), "logs");

    // Create logs directory if it doesn't exist
    if (!fs.existsSync(this.logDir)) {
      try {
        fs.mkdirSync(this.logDir, { recursive: true });
      } catch (error) {
        console.error("Failed to create logs directory:", error);
      }
    }
  }

  formatMessage(level, message, data = null) {
    const timestamp = new Date().toISOString();
    const dataStr = data ? ` | ${JSON.stringify(data)}` : "";
    return `[${timestamp}] [${level}] ${message}${dataStr}`;
  }

  writeToFile(filename, message) {
    if (process.env.NODE_ENV === "production") {
      try {
        const logFile = path.join(this.logDir, filename);
        fs.appendFileSync(logFile, message + "\n");
      } catch (error) {
        console.error("Failed to write log file:", error);
      }
    }
  }

  log(message, data = null) {
    const formatted = this.formatMessage("INFO", message, data);
    console.log(formatted);
    this.writeToFile("app.log", formatted);
  }

  info(message, data = null) {
    this.log(message, data);
  }

  warn(message, data = null) {
    const formatted = this.formatMessage("WARN", message, data);
    console.warn(formatted);
    this.writeToFile("app.log", formatted);
  }

  error(message, error = null) {
    const data = error
      ? {
          message: error.message,
          stack: error.stack,
          ...error,
        }
      : null;

    const formatted = this.formatMessage("ERROR", message, data);
    console.error(formatted);
    this.writeToFile("error.log", formatted);
    this.writeToFile("app.log", formatted);
  }

  debug(message, data = null) {
    if (this.isDevelopment) {
      const formatted = this.formatMessage("DEBUG", message, data);
      console.debug(formatted);
    }
  }

  // HTTP request logging
  request(req, res, duration) {
    const message = `${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`;
    const data = {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration,
      ip: req.ip,
      userAgent: req.get("User-Agent"),
    };

    if (res.statusCode >= 400) {
      this.error(message, data);
    } else if (duration > 2000) {
      this.warn(`Slow request: ${message}`, data);
    } else if (this.isDevelopment) {
      this.debug(message, data);
    }
  }
}

export default new Logger();
