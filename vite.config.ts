import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import basicSsl from "@vitejs/plugin-basic-ssl";
import { basePath } from "./src/const";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    //host: "::",
    host: "localhost",
    port: 8080,
  },
  plugins: [react(), mode === "development" && basicSsl()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
