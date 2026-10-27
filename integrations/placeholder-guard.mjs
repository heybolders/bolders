// @ts-check
import { readdir, readFile } from "node:fs/promises";
import { extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const PATTERN = /lorem/i;
const TEXT_EXTENSIONS = new Set([
  ".html",
  ".xml",
  ".txt",
  ".json",
  ".js",
  ".css",
  ".svg",
  ".webmanifest",
]);

/** @param {string} dir @returns {AsyncGenerator<string>} */
async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else if (TEXT_EXTENSIONS.has(extname(entry.name))) yield path;
  }
}

/**
 * Oprește build-ul de producție dacă în output a rămas text placeholder („lorem”).
 * Rulează doar la `astro build`; în dev placeholderele sunt permise.
 * @returns {import("astro").AstroIntegration}
 */
export default function placeholderGuard() {
  return {
    name: "bolders:placeholder-guard",
    hooks: {
      "astro:build:done": async ({ dir, logger }) => {
        const root = fileURLToPath(dir);
        /** @type {string[]} */
        const hits = [];
        for await (const file of walk(root)) {
          const lines = (await readFile(file, "utf8")).split("\n");
          lines.forEach((line, i) => {
            if (PATTERN.test(line)) hits.push(`${relative(root, file)}:${i + 1}`);
          });
        }
        if (hits.length > 0) {
          throw new Error(
            `Placeholder „lorem” găsit în build (${hits.length}):\n  ${hits.join("\n  ")}\nÎnlocuiește conținutul placeholder înainte de producție.`,
          );
        }
        logger.info("Fără placeholdere „lorem” în output.");
      },
    },
  };
}
