/** @type {import('tailwindcss').Config} */

// "Nova" design system tokens — see the Otaku World Design System export
// (cinematic streaming: near-black stage, one warm-gold accent, soft depth).
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        bg: "#0B0B0F", // page stage
        surface: {
          DEFAULT: "#15151B", // cards, rows, panels
          2: "#1E1E26", // raised: chips, inputs, hover
          3: "#2A2A34", // highest raise
        },
        line: {
          DEFAULT: "rgba(255,255,255,0.08)", // hairline dividers
          strong: "rgba(255,255,255,0.14)", // outlined/ghost controls
        },
        text: "#F6F5F3",
        muted: "#9C9AA6",
        faint: "#66646F",
        gold: {
          DEFAULT: "#FFC53D", // the one accent
          strong: "#E8952B",
          dim: "rgba(255,197,61,0.14)", // tint fills, focus rings
        },
        success: "#4ADE80",
        warning: "#FBBF24",
        danger: "#F87171",
        info: "#60A5FA",
      },

      fontFamily: {
        display: ["Sora", "system-ui", "sans-serif"],
        body: ["DM Sans", "system-ui", "sans-serif"],
        sans: ["DM Sans", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },

      borderRadius: {
        sm: "8px", // chips, inputs
        DEFAULT: "10px", // buttons, badges
        md: "12px", // posters
        lg: "14px", // cards
        xl: "18px", // hero panels, modals
        pill: "999px",
      },

      boxShadow: {
        sm: "0 4px 12px rgba(0,0,0,0.30)",
        DEFAULT: "0 8px 24px rgba(0,0,0,0.40)",
        lg: "0 20px 50px rgba(0,0,0,0.55)",
        glow: "0 8px 28px rgba(255,197,61,0.35)", // single primary CTA only
      },

      spacing: {
        nav: "68px", // glass nav height; heroes offset with -mt-nav
        gutter: "24px", // page gutter, mobile
        "gutter-lg": "56px", // page gutter, desktop
      },

      zIndex: {
        docked: "10",
        sticky: "40",
        overlay: "1300",
        modal: "1400",
        toast: "1700",
      },

      transitionDuration: {
        fast: "150ms",
        normal: "250ms",
        slow: "400ms",
      },
      transitionTimingFunction: {
        out: "cubic-bezier(0.33, 1, 0.68, 1)",
        "in-out": "cubic-bezier(0.65, 0, 0.35, 1)",
      },

      animation: {
        "ow-shimmer": "ow-shimmer 1.4s ease-in-out infinite",
        "ow-spin": "ow-spin 0.8s linear infinite",
        "ow-pulse": "ow-pulse 1.6s ease-in-out infinite",
      },
      keyframes: {
        "ow-shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "ow-spin": {
          to: { transform: "rotate(360deg)" },
        },
        "ow-pulse": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
