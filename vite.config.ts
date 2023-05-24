import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import wasm from "vite-plugin-wasm";
import nodePolyfills from 'rollup-plugin-polyfill-node';

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    'process.env': { NODE_ENV: process.env.NODE_ENV }
  },
  plugins: [vue()],
  build: {
    lib: {
      entry: resolve(__dirname, "src/main.ts"),
      name: "MyLib",
      fileName: "main",
      formats: ["cjs"],
    },
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        dir: undefined,
        file: resolve(__dirname, "main.js"),
        sourcemap: "inline",
        sourcemapExcludeSources: true,
        format: "cjs",
        exports: "default",
        globals: {
          vue: "Vue",
        },
        assetFileNames: (chunkInfo) => {
          if (chunkInfo.name === "style.css") return "styles.css";
        },
      },
      external: [
        "obsidian",
        'electron',
        'fs',
      ],
      plugins: [
        typescript(),
        nodeResolve({ browser: true }),
        wasm(),
        commonjs(),
        nodePolyfills({
          sourceMap: true,
        })],

    },
  },
});
