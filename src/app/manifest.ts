import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Kiss Monitor",
    short_name: "Kisses",
    description: "Make kiss deals with your love and watch your total grow.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#4a9df4",
    theme_color: "#4a9df4",
    icons: [
      { src: "/pwa-icon/192", sizes: "192x192", type: "image/png" },
      { src: "/pwa-icon/512", sizes: "512x512", type: "image/png" },
      { src: "/pwa-icon/512", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
