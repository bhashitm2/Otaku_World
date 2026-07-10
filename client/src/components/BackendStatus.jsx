// src/components/BackendStatus.jsx
import { useEffect, useState } from "react";
import { apiService } from "../services/api";
import Preloader from "./Preloader";

const BackendStatus = ({ children }) => {
  const [backendStatus, setBackendStatus] = useState("checking"); // checking, waking, ready, error

  useEffect(() => {
    const wakeUpBackend = async () => {
      try {
        setBackendStatus("checking");

        // Try a quick health check first
        try {
          console.log("Trying quick health check...");
          await apiService.health();
          console.log("Backend is already awake!");
          setBackendStatus("ready");
          return;
        } catch (error) {
          // Backend might be sleeping, try to wake it up
          console.log(
            "Health check failed, backend might be sleeping:",
            error.message
          );
          setBackendStatus("waking");
        }

        // Wake up the backend
        console.log("Waking up backend server...");
        await apiService.wakeUp();

        setBackendStatus("ready");
        console.log("Backend is now ready!");
      } catch (error) {
        console.error("Failed to wake up backend:", error);
        setBackendStatus("error");
      }
    };

    wakeUpBackend();
  }, []);

  // Checking/waking: the adaptive preloader covers the stage (it settles into
  // its cold-start waiting state by itself if the wake-up drags on). It stays
  // mounted through "ready" so its curtain exit reveals the app underneath.
  if (backendStatus !== "error") {
    return (
      <>
        <Preloader loading={backendStatus !== "ready"} />
        {backendStatus === "ready" && children}
      </>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg font-body text-text">
      <div className="max-w-md space-y-6 p-8 text-center">
        <div className="mx-auto flex h-[72px] w-[72px] items-center justify-center rounded-full border border-line bg-surface-2 text-[30px] text-gold">
          ⚠
        </div>

        <div className="space-y-3">
          <h2 className="font-display text-2xl font-bold">Connection error</h2>
          <p className="text-sm text-muted">
            Unable to connect to the server. Please try again later.
          </p>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center justify-center rounded bg-gold px-6 py-3 font-body text-[14.5px] font-bold leading-none text-bg transition-transform duration-fast active:scale-[0.97]"
        >
          Try again
        </button>
      </div>
    </div>
  );
};

export default BackendStatus;
