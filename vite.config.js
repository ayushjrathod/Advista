import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";
import { defineConfig, loadEnv } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, "");
  const proxyTarget = env.VITE_API_URL || "http://localhost:8000";

  return {
    plugins: [react(), tailwindcss()],
    server: {
      port: 5173,
      host: true, // Allow external connections
      proxy: {
        "/api": {
          target: proxyTarget,
          changeOrigin: true,
          secure: false,
        },
      },
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
      dedupe: ["three"],
    },
    optimizeDeps: {
      include: ["three"],
      force: true,
    },
  };
});
