import lineClamp from "@tailwindcss/line-clamp";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#E50914", // Netflix red
        dark: "#141414", // deep black-gray background
        animePurple: "#6B5B95",
        neonPink: "#FF6EC7",
        cyanGlow: "#00FFE4",
        darkBg: "#0D0D0D",
        lightText: "#F8F8F2",
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [lineClamp],
};
