/// <reference types="vitest" />
import { configDefaults, defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
/// <reference types="vitest" />

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts",
    coverage: {
      exclude: [
        ...configDefaults.exclude,
        "src/components/Footer.tsx",
        "src/lib/cn.ts",
        "src/pages/Settings.tsx",
        "src/pages/Landing.tsx",
        "src/components/Hero.tsx",
        "src/App.tsx",
        "src/main.tsx",
        "src/utils/cn.ts",
      ],
    },
  },
});
