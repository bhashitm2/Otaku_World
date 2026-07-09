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
    <div className="flex min-h-screen items-center justify-center bg-bg font-body text-text">
      <div className="max-w-md space-y-6 p-8 text-center">
        <span className="mx-auto block h-12 w-12 animate-ow-spin rounded-full border-4 border-surface-3 border-t-gold" />

        <div className="space-y-3">
          <h2 className="font-display text-2xl font-bold">
            {backendStatus === "checking" && "Checking the backend…"}
            {backendStatus === "waking" && "Waking up the server…"}
            {backendStatus === "error" && "Connection error"}
          </h2>

          <p className="text-sm text-muted">
            {backendStatus === "checking" &&
              "Connecting to the Otaku World API…"}
            {backendStatus === "waking" &&
              "The server was sleeping. This can take 30–60 seconds…"}
            {backendStatus === "error" &&
              "Unable to connect to the server. Please try again later."}
          </p>
        </div>

        {backendStatus !== "error" && (
          <div className="h-1.5 w-full rounded-pill bg-surface-3">
            <div
              className="h-1.5 rounded-pill bg-gradient-to-r from-gold to-gold-strong transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}

        {backendStatus === "waking" && (
          <div className="space-y-1 text-xs text-faint">
            <p>Free hosting takes a moment to start up</p>
            <p>This only happens on the first visit</p>
          </div>
        )}

        {backendStatus === "error" && (
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center rounded bg-gold px-6 py-3 font-body text-[14.5px] font-bold leading-none text-bg transition-transform duration-fast active:scale-[0.97]"
          >
            Try again
          </button>
        )}
      </div>
    </div>
  );
};

export default BackendStatus;
