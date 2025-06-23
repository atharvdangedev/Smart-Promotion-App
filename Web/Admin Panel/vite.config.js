import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "~bootstrap": path.resolve(__dirname, "node_modules/bootstrap"),
      "@redux": path.resolve(__dirname, "redux"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          "ui-vendor": ["react-bootstrap", "bootstrap"],
          "form-vendor": ["react-hook-form", "yup", "@hookform/resolvers"],
        },
      },
    },
    chunkSizeWarningLimit: 800,
  },
});
