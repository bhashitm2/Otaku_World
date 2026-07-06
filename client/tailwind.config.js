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

        // Aliases already used throughout pages (were silently undefined)
        "accent-cyan": theme.colors.accent.neon,
        "accent-yellow": theme.colors.accent.gold,
        "accent-orange": "#fb923c",
        "surface-dark": theme.colors.background.tertiary,

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

        // "Ink & Impact" design system (design_handoff_ink_redesign)
        "ink-bg": "#14130f", // page background
        "ink-paper": "#1c1b17", // card / raised surface
        ink: "#f2efe6", // text, borders, hard shadows
        "ink-red": "#e63946", // accent (never changes)
        "ink-body": "#cdc9bd",
        "ink-mut1": "#c0bcb0",
        "ink-mut2": "#b6b2a6",
        "ink-mut3": "#a09c90",
        "ink-mut4": "#8f8b7f",
        "ink-mut5": "#6e6a60",
        "ink-link": "#3a3831", // links on light footer
        "ink-stripe1": "#26241f",
        "ink-stripe2": "#2c2a24",
      },

      fontFamily: {
        display: ["Anton", "sans-serif"],
        body: ["Archivo", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
        jp: ["Zen Kaku Gothic New", "sans-serif"],
        sans: ["Archivo", "sans-serif"],
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
        "pulse-slow": "pulse 4s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        marq: "marq 18s linear infinite",
        bob: "bob 5s ease-in-out infinite",
        bob2: "bob2 4s ease-in-out infinite",
        popIn: "popIn .3s ease-out",
      },

      keyframes: {
        marq: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        bob: {
          "0%, 100%": { transform: "rotate(-6deg) translateY(0)" },
          "50%": { transform: "rotate(-4deg) translateY(-7px)" },
        },
        bob2: {
          "0%, 100%": { transform: "rotate(5deg) translateY(0)" },
          "50%": { transform: "rotate(7deg) translateY(-5px)" },
        },
        popIn: {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
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
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
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
        ".animation-delay-2000": {
          "animation-delay": "2s",
        },
        ".animation-delay-4000": {
          "animation-delay": "4s",
        },
      };
      addUtilities(newUtilities);
    },
  ],
};
