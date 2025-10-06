import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor dependencies
          vendor: ["react", "react-dom"],
          router: ["react-router-dom"],
          query: ["@tanstack/react-query"],
          firebase: ["firebase/app", "firebase/auth", "firebase/firestore"],
          ui: ["framer-motion", "lucide-react"],
          animations: ["animejs"],

          // Custom chunks for large components
          pages: [
            "./src/pages/Home.jsx",
            "./src/pages/Anime.jsx",
            "./src/pages/AnimeDetails.jsx",
            "./src/pages/Characters.jsx",
            "./src/pages/CharacterDetails.jsx",
          ],
        },
      },
    },
    chunkSizeWarningLimit: 600,
    sourcemap: false, // Disable sourcemaps in production for smaller build
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true,
      },
    },
  },
  // Development server configuration
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
