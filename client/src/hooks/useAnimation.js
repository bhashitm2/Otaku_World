// src/hooks/useAnimation.js - Animation utilities and performance hooks
import { useEffect, useState } from 'react';

// Hook to respect user's motion preferences
export const usePrefersReducedMotion = () => {
  const [prefersReduced, setPrefersReduced] = useState(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReduced(mediaQuery.matches);
    
    const handler = (e) => setPrefersReduced(e.matches);
    mediaQuery.addListener(handler);
    
    return () => mediaQuery.removeListener(handler);
  }, []);
  
  return prefersReduced;
};

// Hook for smooth reveal animations
export const useRevealAnimation = (threshold = 0.1) => {
  const [isVisible, setIsVisible] = useState(false);
  const [ref, setRef] = useState(null);
  
  useEffect(() => {
    if (!ref) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(ref);
        }
      },
      { threshold }
    );
    
    observer.observe(ref);
    
    return () => observer.disconnect();
  }, [ref, threshold]);
  
  return [setRef, isVisible];
};

// Hook for staggered children animations
export const useStaggerAnimation = (itemCount, delay = 0.05) => {
  const prefersReduced = usePrefersReducedMotion();
  
  const getStaggerDelay = (index) => {
    return prefersReduced ? 0 : index * delay;
  };
  
  return { getStaggerDelay };
};

// Hook for hover animations with performance optimization
export const useHoverAnimation = () => {
  const [isHovered, setIsHovered] = useState(false);
  const prefersReduced = usePrefersReducedMotion();
  
  const hoverProps = {
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
  };
  
  const getHoverScale = () => prefersReduced ? 1 : (isHovered ? 1.03 : 1);
  const getHoverY = () => prefersReduced ? 0 : (isHovered ? -6 : 0);
  
  return {
    isHovered,
    hoverProps,
    getHoverScale,
    getHoverY,
  };
};

// Hook for loading states with skeleton animations
export const useLoadingAnimation = () => {
  const prefersReduced = usePrefersReducedMotion();
  
  const getSkeletonClass = () => {
    return prefersReduced ? 'bg-surface-secondary' : 'shimmer';
  };
  
  return { getSkeletonClass };
};

// Anime.js wrapper with reduced motion support
export const useAnimeJS = () => {
  const prefersReduced = usePrefersReducedMotion();
  
  const animate = async (config) => {
    if (prefersReduced) {
      // Skip animations but still resolve promise
      return Promise.resolve();
    }
    
    try {
      // Import anime.js - try default first, then named export
      const animeModule = await import('animejs');
      const anime = animeModule.default || animeModule.anime || animeModule;
      
      if (!anime || typeof anime !== 'function') {
        console.warn('anime.js not loaded properly, skipping animation');
        return Promise.resolve();
      }
      
      const animation = anime(config);
      return animation.finished || Promise.resolve();
    } catch (importError) {
      console.warn('Failed to load anime.js:', importError.message);
      return Promise.resolve();
    }
  };
  
  return { animate };
};

// Performance-focused image loading hook
export const useOptimizedImage = (src, options = {}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(options.placeholder || '');
  
  useEffect(() => {
    if (!src) return;
    
    const img = new Image();
    
    img.onload = () => {
      setCurrentSrc(src);
      setIsLoaded(true);
    };
    
    img.onerror = () => {
      setIsError(true);
      if (options.fallback) {
        setCurrentSrc(options.fallback);
      }
    };
    
    img.src = src;
    
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, options.fallback, options.placeholder]);
  
  return {
    src: currentSrc,
    isLoaded,
    isError,
  };
};

// Prefetch hook for hover interactions
export const usePrefetch = () => {
  const prefetchResource = async (url) => {
    try {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = url;
      document.head.appendChild(link);
      
      // Clean up after a delay
      setTimeout(() => {
        if (document.head.contains(link)) {
          document.head.removeChild(link);
        }
      }, 30000);
    } catch (error) {
      console.warn('Prefetch failed:', error);
    }
  };
  
  return { prefetchResource };
};

export default {
  usePrefersReducedMotion,
  useRevealAnimation,
  useStaggerAnimation,
  useHoverAnimation,
  useLoadingAnimation,
  useAnimeJS,
  useOptimizedImage,
  usePrefetch,
};