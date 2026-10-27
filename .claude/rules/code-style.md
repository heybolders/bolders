---
paths:
  - "src/**/*.{ts,tsx,astro}"
  - "astro.config.*"
  - "tsconfig.json"
---

# Code style

- TypeScript strict (`astro/tsconfigs/strictest`). Fără `any`, fără `@ts-ignore`. Tipurile lipsă se declară explicit.
- Props tipate în fiecare componentă Astro cu `interface Props`.
- Importuri doar cu alias `@/` (`@/components/...`, `@/scripts/...`, `@/content/...`). Fără `../../`.
- O componentă per fișier. Numele fișierului = numele componentei, în PascalCase (`ProjectSlider.astro`).
- Structură:
  - `src/components/<zona>/`: `global/`, `home/`, `departamente/`, `agentie/`, `contact/`, `ui/`
  - `src/layouts/`: layout-uri de pagină
  - `src/scripts/animations/`: modulul central de animații (un fișier per `data-anim`)
  - `src/content/`: texte și date
  - `src/assets/`: imagini procesate de `<Image />`
- Denumiri: componente în PascalCase, funcții și variabile în camelCase, constante globale în UPPER_SNAKE_CASE, fișiere de script în kebab-case, valori `data-anim` în kebab-case.
- Funcții mici, fără efecte la import. Codul client stă în `<script>` procesat de Astro, nu în `is:inline`, cu excepția celor documentate.
- Fără dependențe noi fără motiv notat în `docs/PROGRESS.md`.
- Fără cod copiat din `reference/webflow/` sau de pe site-urile de inspirație.
- Comentariile explică „de ce”, nu „ce”.
