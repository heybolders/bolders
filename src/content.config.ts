import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

// Structura urmează reference/continut.md.
const DATA_PATTERN = "**/*.{json,yaml,yml}";

const pagini = defineCollection({
  loader: glob({ pattern: DATA_PATTERN, base: "./src/content/pagini" }),
  schema: z.object({
    /** meta title */
    title: z.string(),
    /** meta description */
    description: z.string(),
    /** titlul vizibil (h1) */
    titlu: z.string(),
    /** TODO(continut): meta provizorii, de înlocuit cu cele furnizate de client */
    provizoriu: z.boolean().default(false),
  }),
});

const testimoniale = defineCollection({
  loader: glob({ pattern: DATA_PATTERN, base: "./src/content/testimoniale" }),
  schema: z.object({
    citat: z.string(),
    nume: z.string(),
    rol: z.string(),
    ordine: z.number().int(),
  }),
});

const proiecte = defineCollection({
  loader: glob({ pattern: DATA_PATTERN, base: "./src/content/proiecte" }),
  schema: ({ image }) =>
    z.object({
      numar: z.number().int().positive(),
      nume: z.string(),
      tip: z.string(),
      an: z.string(),
      descriere: z.string(),
      imagine: image(),
      alt: z.string(),
      link: z.url().optional(),
    }),
});

const faq = defineCollection({
  loader: glob({ pattern: DATA_PATTERN, base: "./src/content/faq" }),
  schema: z.object({
    intrebare: z.string(),
    raspuns: z.string(),
    linkContact: z.boolean().default(false),
    ordine: z.number().int(),
  }),
});

export const collections = { pagini, testimoniale, proiecte, faq };
