import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const PORT = Number(env.VITE_PORT) || 5173;
  const API_BASE_URL = env.VITE_API_BASE_URL || "http://localhost:3000";

  // https://vite.dev/config/
  return {
    plugins: [
      tailwindcss(),
      react(),
      VitePWA({
        registerType: "prompt",
        injectRegister: false,

        pwaAssets: {
          disabled: false,
          config: true,
        },

        manifest: {
          name: "Delvoura ",
          short_name: "Delvoura",
          description: "Delvoura App",
          theme_color: "#5d3bff",
        },

        workbox: {
          maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
          globPatterns: ["**/*.{js,css,html,svg,png,ico}"],
          cleanupOutdatedCaches: true,
          clientsClaim: true,
        },

        devOptions: {
          enabled: true,
          navigateFallback: "index.html",
          suppressWarnings: true,
          type: "module",
        },
      }),
    ],
    server: {
      host: true,
      allowedHosts: true,
      port: PORT,
      proxy: {
        "/api": {
          target: API_BASE_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
    preview: {
      port: PORT,
      strictPort: true,
    },
    define: {
      "process.env.VITE_API_BASE_URL": JSON.stringify(API_BASE_URL),
    },
  };
});
