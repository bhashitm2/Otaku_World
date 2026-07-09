import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Dependency optimization for faster dev server startup
  optimizeDeps: {
    // Pre-bundle these heavy dependencies
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "@tanstack/react-query",
      "firebase/app",
      "firebase/auth",
      "firebase/firestore",
      "framer-motion",
      "lucide-react",
      "axios",
    ],
    // Force pre-bundling even if not detected
    force: false,
    // Increase timeout for slow networks
    esbuildOptions: {
      target: "esnext",
    },
  },

  // Enable caching for faster subsequent loads
  cacheDir: "node_modules/.vite",

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
          // Note: pages are lazy-loaded in App.jsx, so each splits into its
          // own chunk automatically — no manual "pages" chunk needed.
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
    // Faster HMR
    hmr: {
      overlay: true,
    },
    // Warm up frequently used files
    warmup: {
      clientFiles: [
        "./src/main.jsx",
        "./src/App.jsx",
        "./src/pages/Home.jsx",
        "./src/components/Navbar.jsx",
      ],
    },
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
