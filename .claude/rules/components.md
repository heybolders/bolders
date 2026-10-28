---
paths:
  - "src/components/**"
  - "src/layouts/**"
  - "src/pages/**"
---

# Componente

Documentația fiecărei primitive (props, variante, exemple, când se folosește): `docs/COMPONENTS.md`.

- **Secțiunile compun doar primitive.** Butoanele, titlurile, containerele, pill-urile și linkurile se scriu **doar** prin primitivele din `src/components/ui/`: `Button`, `Heading`, `Container`, `Section`, `Pill`, `TextLink`, `Icon`, `Halo`. Markup-ul propriu al unei secțiuni rămâne pentru layout (grile, liste, paragrafe) și pentru elementele animate (`data-anim`, `data-hero-*`).
- **Primitive noi:** doar dacă tiparul apare de **minim 2 ori** în componente; se documentează în `docs/COMPONENTS.md` și aici, în aceeași modificare. O variantă nouă a unei primitive existente urmează aceeași regulă (o variantă unică e permisă doar pentru elemente unice: skip link, logo, bara headerului, hero).
- **Convenții pentru primitive:**
  - `interface Props` tipată, valori implicite în destructurare; atributele HTML trec prin `...attrs`.
  - Variantele sunt obiecte `const` (`VARIANTS`, `SIZES` etc.) mapate pe utilitare Tailwind; tipul variantei e `keyof typeof`. Fără dependențe pentru variante (cva, clsx, tailwind-merge).
  - Clasele se combină cu `class:list`. Prop-ul `class` e **doar pentru poziționare în layout** (margin, grid, order, vizibilitate pe breakpoint), niciodată pentru culoare, mărime de text, padding sau fundal: acelea sunt variante.
  - `focus-visible` și ținta minimă de 44 px stau în primitivă (`Button`, `TextLink`), nu în secțiuni.
  - O componentă per fișier, importuri cu `@/`.
- **Semantica e separată de aspect:** `Heading` primește `as` (h1–h6 sau `p` pentru text decorativ cu aspect de titlu) și `size` separat. Un singur `h1` per pagină.
- **Atribute `data-*` fără valoare** pe o primitivă se scriu `data-x=""`: trecute prin props, un atribut boolean ajunge în HTML ca `data-x="true"`.
- `Container size="prose"` primește `measure` egal cu mărimea textului din paragraf: `max-w-prose` e `65ch`, calculat din fontul elementului.

## Audit (`npm run audit:rules`)

Erori în afara primitivelor:
- `glow-in-afara-buton`: `shadow-glow`, tokenii `--glow-*` / `--color-glow` / `--shadow-glow` și punctul lime (`size-* … bg-lime`) în afara `ui/Button.astro`, `ui/Pill.astro` (eticheta din hero e sursa glow-ului în original) și `global.css`.
- `titlu-direct`: `<h1>`…`<h6>` în `src/components/`, `src/layouts/`, `src/pages/` în afara `ui/Heading.astro`.
- `buton-direct`: `<button>`, `<a>` și clasele `btn`/`btn-lg`/`btn-fill` în afara `ui/Button.astro` (`<a>` e permis și în `ui/TextLink.astro`).
- `container-direct`: `max-w-site` / `max-w-prose` în afara `ui/Container.astro`.
