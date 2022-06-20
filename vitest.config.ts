import { fileURLToPath } from "url";
import { defineConfig } from "vitest/config";
import Vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [Vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "jsdom",
    coverage: {
      reporter: ["text", "json", "html"],
    },
  },
});
