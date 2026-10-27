// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

import placeholderGuard from "./integrations/placeholder-guard.mjs";

// https://astro.build/config
export default defineConfig({
  output: "static",
  fonts: [
    {
      provider: fontProviders.local(),
      name: "Manrope",
      cssVariable: "--font-manrope",
      fallbacks: ["ui-sans-serif", "system-ui", "sans-serif"],
      options: {
        variants: [
          {
            // subset latin + latin-ext într-un singur fișier: diacriticele RO (ș ț cu virgulă) sunt în latin-ext
            weight: "200 800",
            style: "normal",
            display: "swap",
            src: ["./src/assets/fonts/Manrope-Variable-latin-ext.woff2"],
          },
        ],
      },
    },
  ],
  integrations: [placeholderGuard()],
  vite: {
    plugins: [tailwindcss()],
  },
});
