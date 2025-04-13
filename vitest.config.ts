import { defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config";

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: ["./setup-vitest.ts"],
      exclude: ["**/node_modules/**", "**/__mocks__/**"],
      include: ["src/**/*.test.tsx", "src/**/*.spec.tsx"],
    },
  })
);
