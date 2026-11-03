import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  build: {
    target: "es2022",
    assetsInlineLimit: 4096,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        notes: resolve(__dirname, "notes.html"),
      },
    },
  },
  server: {
    port: 3000,
  },
});
