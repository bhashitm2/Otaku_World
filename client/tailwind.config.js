/** @type {import('tailwindcss').Config} */
import { theme } from "./src/styles/theme.js";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        // Background colors
        "bg-primary": theme.colors.background.primary,
        "bg-secondary": theme.colors.background.secondary,
        "bg-tertiary": theme.colors.background.tertiary,

        // Surface colors
        "surface-primary": theme.colors.surface.primary,
        "surface-secondary": theme.colors.surface.secondary,
        "surface-tertiary": theme.colors.surface.tertiary,
        "surface-glass": theme.colors.surface.glass,

        // Brand colors
        primary: theme.colors.primary,

        // Accent colors
        "accent-neon": theme.colors.accent.neon,
        "accent-magenta": theme.colors.accent.magenta,
        "accent-purple": theme.colors.accent.purple,
        "accent-gold": theme.colors.accent.gold,

        // Semantic colors
        success: theme.colors.success,
        warning: theme.colors.warning,
        danger: theme.colors.danger,
        info: theme.colors.info,

        // Text colors
        "text-primary": theme.colors.text.primary,
        "text-secondary": theme.colors.text.secondary,
        "text-tertiary": theme.colors.text.tertiary,
        "text-inverse": theme.colors.text.inverse,

        // Muted colors
        muted: theme.colors.muted,

        // Legacy colors for backward compatibility
        dark: "#141414",
        animePurple: "#6B5B95",
        neonPink: "#FF6EC7",
        cyanGlow: "#00FFE4",
        darkBg: "#0D0D0D",
        lightText: "#F8F8F2",
      },

      fontFamily: {
        display: theme.fonts.display,
        body: theme.fonts.body,
        mono: theme.fonts.mono,
        sans: ["Poppins", "sans-serif"], // Keep existing for compatibility
      },

      fontSize: theme.fontSizes,

      spacing: theme.spacing,

      borderRadius: theme.radii,

      zIndex: theme.zIndex,

      boxShadow: {
        neon: theme.shadows.neon,
        glow: theme.shadows.glow,
      },

      backgroundImage: {
        "gradient-primary": theme.gradients.primary,
        "gradient-accent": theme.gradients.accent,
        "gradient-surface": theme.gradients.surface,
        "gradient-hero": theme.gradients.hero,
      },

      animation: {
        shimmer: "shimmer 1.5s infinite",
        "pulse-neon": "pulse-neon 2s ease-in-out infinite",
        glow: "glow 3s ease-in-out infinite",
      },

      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200px 0" },
          "100%": { backgroundPosition: "calc(200px + 100%) 0" },
        },
        "pulse-neon": {
          "0%, 100%": { boxShadow: theme.shadows.neon },
          "50%": {
            boxShadow:
              "0 0 30px rgba(0, 245, 255, 0.8), 0 0 60px rgba(0, 245, 255, 0.5)",
          },
        },
        glow: {
          "0%, 100%": { boxShadow: theme.shadows.glow },
          "50%": { boxShadow: "0 0 40px rgba(139, 92, 246, 0.6)" },
        },
      },

      transitionDuration: theme.motion.duration,
      transitionTimingFunction: theme.motion.ease,

      screens: theme.breakpoints,
    },
  },
  plugins: [
    // Add custom utilities
    function ({ addUtilities }) {
      const newUtilities = {
        ".glass-morphism": {
          background: "var(--color-surface-glass)",
          "backdrop-filter": "blur(10px)",
          "-webkit-backdrop-filter": "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        },
        ".gradient-text": {
          background: "var(--gradient-primary)",
          "-webkit-background-clip": "text",
          "-webkit-text-fill-color": "transparent",
          "background-clip": "text",
        },
        ".shimmer": {
          background:
            "linear-gradient(90deg, var(--color-surface-primary) 25%, var(--color-surface-secondary) 50%, var(--color-surface-primary) 75%)",
          "background-size": "200px 100%",
          animation: "shimmer 1.5s infinite",
        },
      };
      addUtilities(newUtilities);
    },
  ],
};
