// src/styles/theme.js - Premium Anime Theme Tokens
export const theme = {
  // Color palette - Deep anime-inspired colors
  colors: {
    // Base colors
    background: {
      primary: "#0a0a0f", // Deep space black
      secondary: "#1a1a2e", // Dark navy
      tertiary: "#16213e", // Slightly lighter navy
    },

    // Surface colors
    surface: {
      primary: "#1e1e2e", // Card backgrounds
      secondary: "#2a2a3e", // Elevated surfaces
      tertiary: "#363650", // Interactive surfaces
      glass: "rgba(30, 30, 46, 0.8)", // Glass morphism
    },

    // Brand colors
    primary: {
      50: "#f0f9ff",
      100: "#e0f2fe",
      500: "#06b6d4", // Cyan primary
      600: "#0891b2",
      700: "#0e7490",
      900: "#164e63",
    },

    // Accent colors
    accent: {
      neon: "#00f5ff", // Electric cyan
      magenta: "#ff00aa", // Vibrant magenta
      purple: "#8b5cf6", // Deep purple
      gold: "#fbbf24", // Golden accent
    },

    // Semantic colors
    success: "#10b981",
    warning: "#f59e0b",
    danger: "#ef4444",
    info: "#3b82f6",

    // Text colors
    text: {
      primary: "#f8fafc", // Pure white text
      secondary: "#cbd5e1", // Muted white
      tertiary: "#94a3b8", // Subtle gray
      inverse: "#1e293b", // Dark text on light
    },

    // Muted colors
    muted: {
      50: "#f8fafc",
      100: "#f1f5f9",
      500: "#64748b",
      600: "#475569",
      900: "#0f172a",
    },
  },

  // Spacing scale
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
    "2xl": "48px",
    "3xl": "64px",
    "4xl": "96px",
    "5xl": "128px",
  },

  // Border radius
  radii: {
    none: "0",
    sm: "4px",
    md: "8px",
    lg: "12px",
    xl: "16px",
    "2xl": "24px",
    full: "9999px",
  },

  // Typography
  fonts: {
    display: ["Orbitron", "system-ui", "sans-serif"], // Futuristic display font
    body: ["Inter", "system-ui", "sans-serif"], // Clean UI font
    mono: ["JetBrains Mono", "monospace"], // Code font
  },

  // Font sizes
  fontSizes: {
    xs: "12px",
    sm: "14px",
    base: "16px",
    lg: "18px",
    xl: "20px",
    "2xl": "24px",
    "3xl": "30px",
    "4xl": "36px",
    "5xl": "48px",
    "6xl": "60px",
    "7xl": "72px",
  },

  // Z-index map
  zIndex: {
    hide: -1,
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    skipLink: 1600,
    toast: 1700,
    tooltip: 1800,
  },

  // Motion timings
  motion: {
    // Durations
    duration: {
      instant: "0ms",
      fast: "150ms",
      normal: "250ms",
      slow: "400ms",
      slower: "600ms",
    },

    // Easing curves
    ease: {
      linear: "linear",
      out: "cubic-bezier(0.33, 1, 0.68, 1)",
      in: "cubic-bezier(0.32, 0, 0.67, 0)",
      inOut: "cubic-bezier(0.65, 0, 0.35, 1)",
      bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
      elastic: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    },
  },

  // Shadows
  shadows: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    neon: "0 0 20px rgba(0, 245, 255, 0.5), 0 0 40px rgba(0, 245, 255, 0.3)",
    glow: "0 0 30px rgba(139, 92, 246, 0.4)",
  },

  // Gradients
  gradients: {
    primary: "linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)",
    accent: "linear-gradient(135deg, #00f5ff 0%, #ff00aa 100%)",
    surface:
      "linear-gradient(135deg, rgba(30, 30, 46, 0.8) 0%, rgba(42, 42, 62, 0.6) 100%)",
    hero: "linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #16213e 100%)",
  },

  // Breakpoints
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },
};

// Export individual token categories for easy imports
export const colors = theme.colors;
export const spacing = theme.spacing;
export const radii = theme.radii;
export const fonts = theme.fonts;
export const motion = theme.motion;
export const zIndex = theme.zIndex;
export const shadows = theme.shadows;

export default theme;
