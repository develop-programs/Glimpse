import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";
import path from "node:path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: {
        enabled: true,
      },
      manifest: {
        name: "Glimpse: A Glimpse video calling app",
        short_name: "Glimpse",
        description: "A Glimpse video calling app",
        theme_color: "#ffffff",
        icons: [
          {
            sizes: "64x64",
            src: "/logo_extra_small.png",
            type: "image/png",
          },
          {
            src: "/logo_small.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/logo_large.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        orientation: "portrait",
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
