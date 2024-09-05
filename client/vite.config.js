import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const baseUrl = String(process.env.VITE_API_BASE_URL_DEV);
// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": baseUrl || "http://localhost:3000",
    },
    changeOrigin: true,
    secure: false,
  },
  plugins: [react()],
});
