import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api/auth": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
      "/api/collections": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
      "/api/v1": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
      "/api/preferences": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
})
