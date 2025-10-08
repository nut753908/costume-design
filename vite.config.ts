/// <reference types="vitest/config" />

import { resolve } from "node:path";
import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsConfigPaths()],
  test: {
    include: ["test/**/*.test.ts"],
    coverage: {
      provider: "v8",
    },
    environment: "happy-dom",
    mockReset: true,
  },
  build: {
    rollupOptions: {
      input: {
        "hair-bundle": resolve(__dirname, "hair-bundle.html"),
        "tight-clothing": resolve(__dirname, "tight-clothing.html"),
      },
    },
  },
});
