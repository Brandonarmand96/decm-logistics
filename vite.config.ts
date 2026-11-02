import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  server: {
    proxy: {
      "/api": "http://127.0.0.1:4174",
      "/uploads": "http://127.0.0.1:4174",
    },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["decm-nexus-logo.png", "decm-nexus-app-icon.png"],
      manifest: {
        name: "DECM Nexus Control Tower",
        short_name: "Nexus",
        description: "Logistics and procurement operations workspace",
        theme_color: "#0B3D91",
        background_color: "#f4f1e9",
        display: "standalone",
        start_url: "/app",
        icons: [
          {
            src: "/decm-nexus-app-icon.png",
            sizes: "1080x1080",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/decm-nexus-app-icon.png",
            sizes: "1080x1080",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: { navigateFallback: "/index.html" },
    }),
  ],
});
