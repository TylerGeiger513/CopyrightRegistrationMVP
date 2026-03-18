import { defineConfig } from "playwright";

export default defineConfig({
  use: {
    headless: false,
    viewport: { width: 1440, height: 900 },
  },
});
