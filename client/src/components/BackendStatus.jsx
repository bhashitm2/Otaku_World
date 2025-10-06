// src/components/BackendStatus.jsx
import { useEffect, useState } from "react";
import { apiService } from "../services/api";

const BackendStatus = ({ children }) => {
  const [backendStatus, setBackendStatus] = useState("checking"); // checking, waking, ready, error
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const wakeUpBackend = async () => {
      try {
        setBackendStatus("checking");
        setProgress(10);

        // Try a quick health check first
        try {
          console.log("Trying quick health check...");
          await apiService.health();
          console.log("Backend is already awake!");
          setBackendStatus("ready");
          setProgress(100);
          return;
        } catch (error) {
          // Backend might be sleeping, try to wake it up
          console.log(
            "Health check failed, backend might be sleeping:",
            error.message
          );
          setBackendStatus("waking");
          setProgress(30);
        }

        // Wake up the backend
        const progressInterval = setInterval(() => {
          setProgress((prev) => Math.min(prev + 5, 90));
        }, 2000);

        console.log("Waking up backend server...");
        await apiService.wakeUp();

        clearInterval(progressInterval);
        setProgress(100);
        setBackendStatus("ready");
        console.log("Backend is now ready!");
      } catch (error) {
        console.error("Failed to wake up backend:", error);
        setBackendStatus("error");
        setProgress(0);
      }
    };

    wakeUpBackend();
  }, []);

  if (backendStatus === "ready") {
    return children;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
      <div className="text-center space-y-6 p-8 max-w-md">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-cyan-400 border-t-transparent mx-auto"></div>

        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-white">
            {backendStatus === "checking" && "Checking Backend Status..."}
            {backendStatus === "waking" && "Waking Up Server..."}
            {backendStatus === "error" && "Connection Error"}
          </h2>

          <p className="text-gray-300 text-sm">
            {backendStatus === "checking" && "Connecting to Otaku World API..."}
            {backendStatus === "waking" &&
              "The server was sleeping. Please wait 30-60 seconds..."}
            {backendStatus === "error" &&
              "Unable to connect to the server. Please try again later."}
          </p>
        </div>

        {backendStatus !== "error" && (
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-cyan-400 to-purple-400 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}

        {backendStatus === "waking" && (
          <div className="text-xs text-gray-400 space-y-1">
            <p>🌟 Free hosting takes time to start up</p>
            <p>⚡ This only happens on the first visit</p>
          </div>
        )}

        {backendStatus === "error" && (
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default BackendStatus;
