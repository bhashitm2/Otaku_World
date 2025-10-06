// server/index.js
import dotenv from "dotenv";
import app from "./app.js";
import { connectDB } from "./config/database.js";

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;

// Graceful shutdown function
const gracefulShutdown = (server) => {
  return (signal) => {
    console.log(`\n${signal} received. Starting graceful shutdown...`);

    server.close(() => {
      console.log("HTTP server closed.");

      // Close database connection
      import("mongoose").then(({ default: mongoose }) => {
        mongoose.connection.close(() => {
          console.log("MongoDB connection closed.");
          process.exit(0);
        });
      });
    });

    // Force close after 30 seconds
    setTimeout(() => {
      console.error(
        "Could not close connections in time, forcefully shutting down"
      );
      process.exit(1);
    }, 30000);
  };
};

// Start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start HTTP server
    const server = app.listen(PORT, () => {
      console.log(`
🚀 Otaku World API Server Started Successfully!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📡 Server running on port: ${PORT}
🌐 Environment: ${process.env.NODE_ENV || "development"}
🔗 API URL: http://localhost:${PORT}
📊 Health Check: http://localhost:${PORT}/health
📚 API Docs: http://localhost:${PORT}/api
💾 Cache Stats: http://localhost:${PORT}/api/cache/stats
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      `);
    });

    // Setup graceful shutdown
    const shutdown = gracefulShutdown(server);
    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);

    // Handle uncaught exceptions
    process.on("uncaughtException", (error) => {
      console.error("Uncaught Exception:", error);
      shutdown("uncaughtException");
    });

    process.on("unhandledRejection", (reason, promise) => {
      console.error("Unhandled Rejection at:", promise, "reason:", reason);
      shutdown("unhandledRejection");
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

// Start the server
startServer();
