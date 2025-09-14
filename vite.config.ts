/// <reference types="vitest/config" />

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
});
