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
      includeAssets: [
        "/logo.png",
        "bg_img.png",
        "banner.png",
        "header_img.png",
      ],
      manifest: {
        name: "Sanjeet Water Supplier",
        short_name: "SWS",
        description: "Order water easily and fast",
        background_color: "#a316a8",
        theme_color: "#a316a8",
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
