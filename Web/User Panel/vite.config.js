import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  server: {
    allowedHosts: ["central-rat-hugely.ngrok-free.app"],
    host: true,
  },
  plugins: [react(), tailwindcss()],
});
