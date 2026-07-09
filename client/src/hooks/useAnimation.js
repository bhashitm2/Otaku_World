// src/hooks/useAnimation.js - motion preference hook
import { useEffect, useState } from "react";

// Hook to respect user's motion preferences
export const usePrefersReducedMotion = () => {
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReduced(mediaQuery.matches);

    const handler = (e) => setPrefersReduced(e.matches);
    mediaQuery.addListener(handler);

    return () => mediaQuery.removeListener(handler);
  }, []);

  return prefersReduced;
};
