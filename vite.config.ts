import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: "esnext", // Faster build, assumes modern browser
    sourcemap: false, // Skip sourcemap generation for speed
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // manualChunks removed to let Vite decide best splitting strategy
      },
    },
  },
}));
