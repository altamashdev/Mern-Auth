import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwind from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    tailwind(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["/logo.png", "bg_img.png", "banner.png","header_img.png"],
      manifest: {
        name: "Sanjeet Water Supplier",
        short_name: "SWS",
        description: "Order water easily and fast",
        theme_color: "#ffffff",
        background_color: "linear-gradient(90deg,rgba(255, 255, 255, 1) 0%, rgba(234, 161, 240, 1) 23%, rgba(163, 22, 168, 1) 53%);",
        display: "standalone",
        orientation: "portrait",
        icons: [
          {
            src: "/logo.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/logo.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
});