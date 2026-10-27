// @ts-check
import js from "@eslint/js";
import astro from "eslint-plugin-astro";
import { defineConfig, globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";

export default defineConfig(
  globalIgnores([
    "dist/",
    ".astro/",
    "node_modules/",
    "reference/",
    "brand/",
    "Logo Nou/",
    "splash-effect-8.js",
  ]),
  js.configs.recommended,
  tseslint.configs.strict,
  astro.configs.recommended,
  {
    files: ["**/*.mjs"],
    languageOptions: { globals: { console: "readonly", process: "readonly" } },
  },
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/ban-ts-comment": "error",
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["../*"],
              message: "Folosește aliasul @/ în loc de căi relative spre părinte.",
            },
          ],
        },
      ],
    },
  },
);
