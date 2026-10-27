// @ts-check

/** @type {import("prettier").Config} */
export default {
  printWidth: 100,
  plugins: ["prettier-plugin-astro", "prettier-plugin-tailwindcss"],
  // pluginul Tailwind citește tokenii din @theme pentru ordinea claselor
  tailwindStylesheet: "./src/styles/global.css",
  overrides: [{ files: "*.astro", options: { parser: "astro" } }],
};
