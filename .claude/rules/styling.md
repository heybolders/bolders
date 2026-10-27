---
paths:
  - "src/**/*.{astro,css,ts,tsx}"
  - "prettier.config.*"
  - ".prettierrc*"
---

# Styling

- Doar Tailwind CSS v4. Tokenii stau în `@theme` din `src/styles/global.css`, conform `docs/DESIGN.md` §2. Un token nou se adaugă întâi în DESIGN.md, apoi în `@theme`.
- **Doar tokeni:** culori, fonturi, mărimi de text, raze, umbre, breakpoint-uri și easing din `@theme`. `--color-*: initial`: nu există paleta implicită Tailwind.
- **Fără valori arbitrare** (`w-[37px]`, `text-[#aaf22d]`, `mt-[13px]`). Dacă lipsește o valoare, se discută și se adaugă token.
- **Fără stiluri inline** (`style="..."`). Excepție: custom properties setate din JS de modulul de animații (`--progress`).
- Fără CSS scris de mână în componente, în afară de `@layer components` pentru cazurile documentate (ex. masca SplitText).
- Mobile-first: clasele de bază sunt pentru mobil, apoi `md:`, `lg:`, `xl:`.
- Ordinea claselor e sortată automat de `prettier-plugin-tailwindcss`. Nu se sortează manual și nu se comite cod neformatat.
- Accentul `lime` se folosește doar ca semnal (stare activă, punct buton, progres, separator „/”). Lista anti-banal din DESIGN.md §4 e obligatorie.
- Contrast minim WCAG AA pentru text (`paper-muted` pe `ink` e verificat; `paper-dim` doar pentru stări animate, niciodată pentru text final).
