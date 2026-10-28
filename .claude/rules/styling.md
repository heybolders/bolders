---
paths:
  - "src/**/*.{astro,css,ts,tsx}"
  - "prettier.config.*"
  - ".prettierrc*"
---

# Styling

- Doar Tailwind CSS v4. Tokenii stau în `@theme` din `src/styles/global.css`, conform `docs/DESIGN.md` §2. Un token nou se adaugă întâi în DESIGN.md, apoi în `@theme`.
- **Doar tokeni:** culori, fonturi, mărimi de text, raze, umbre, blur, aspect, breakpoint-uri și easing din `@theme`. `--color-*: initial`: nu există paleta implicită Tailwind.
- **Fără valori arbitrare** (`w-[37px]`, `text-[#aaf22d]`, `mt-[13px]`, `[mask-type:x]`, `bg-(--var)`, `aria-[...]:`). Dacă lipsește o valoare, se discută și se adaugă token.
- **Fără stiluri inline** (`style="..."`) în markup. Excepție: custom properties setate din JS de modulul de animații (`el.style.setProperty("--progress", …)`).
- **Fără `<style>` în componente.** Fără culori hex/rgb/hsl și fără valori în `px` în afara `global.css`.
- Mobile-first: clasele de bază sunt pentru 375 px, apoi `sm:`, `md:`, `lg:`, `xl:`, `2xl:`.
- Ordinea claselor e sortată automat de `prettier-plugin-tailwindcss`. Nu se sortează manual și nu se comite cod neformatat.
- Accentul `lime` se folosește doar ca semnal (stare activă, punct buton, progres) și pentru separatorul „/” din meniul footerului (element de identitate). Lista anti-banal din DESIGN.md §5 e obligatorie.
- Mărimi de text doar din scara proprie: `text-tag`, `text-body`, `text-lead`, `text-h3`, `text-h2-sm`, `text-h2`, `text-story`, `text-display`. `font-light` (200) doar cu `text-display`. Wordmark-ul din footer e SVG (DESIGN.md §2).
- Contrast minim WCAG AA pentru text (`paper-muted` pe `ink` e verificat; `paper-dim` doar pentru stări animate, niciodată pentru text final).

## CSS scris de mână

Permis **doar** în `src/styles/global.css`, **doar** în layere cu nume (`@layer base`, `@layer components`) și doar pentru ce nu se poate face cu utilitare: `@font-face`, `@keyframes`, `::view-transition-*`, stări de bază (`html`, `body`, `:focus-visible`) și excepțiile de mai jos. La nivelul de sus al fișierului stau numai `@import`, `@theme`, `@custom-variant` și `@layer <nume>`.

### Excepții (lista exactă; `npm run audit:rules` cere ca fiecare clasă din `global.css` să apară aici)

| Clasă | Layer | De ce nu se poate cu utilitare |
|---|---|---|
| `.btn` | components | variabile locale `--btn-pad` / `--btn-dot-x`: padding-ul și poziția punctului derivă din aceeași valoare |
| `.btn-lg` | components | suprascrie `--btn-pad` pentru butoanele mari |
| `.btn-fill` | components | `clip-path: circle(… at var(--btn-dot-x) 50%)` cu tranziție; ar cere valori arbitrare |
| `.line-mask` | components | `padding-block` / `margin-block` în `em` (0.12em / 0.2em) pentru masca SplitText |
| `.no-kerning` | components | `font-kerning: none` (fără utilitar Tailwind) pe cuvântul cu `smoke-text`: lățimea nu se schimbă când SplitText împarte literele |
| `.hero-pending` | components | starea ascunsă a hero-ului, pusă de scriptul inline înaintea primului paint (ANIMATIONS.md, „hero-syllables”) |
| `.hero-grid` | components | `mask-image: radial-gradient(...)` pe liniile de construcție |

Alte excepții din `global.css`, fără clase: `::view-transition-group(header)` și varianta reduced motion a `::view-transition-*` (în `@layer base`), `@custom-variant current`.

### Excepții în afara `global.css` (allowlist în `scripts/audit-rules.mjs`)

- `src/layouts/BaseLayout.astro`: `<meta name="theme-color" content="#0d0d0d" />`. Meta-ul cere o culoare literală; valoarea = `--color-ink`.
- `src/scripts/animations/capabilities.ts`: `document.createElement("canvas")` și `canvas.getContext("webgl2") ?? canvas.getContext("webgl")` în `supportsWebGL()`. Canvas temporar doar pentru detecție, fără randare (`.claude/rules/animations.md`).

## Audit

`npm run audit:rules` (`scripts/audit-rules.mjs`) verifică în `src/`: valori arbitrare Tailwind, `style=` inline, `<style>` în componente, culori hex/rgb/hsl și `px` în afara `global.css`, importuri GSAP/Lenis în afara `src/scripts/animations/`, importuri relative (fără `@/`), texte hardcodate în markup (noduri text și `aria-label`/`alt`/`title`/`placeholder`), CSS în afara layerelor și clase din `global.css` nedocumentate aici; plus excepțiile efectelor reactivate (`.claude/rules/animations.md`): `filter`/`blur` doar în `smoke-text.ts`, `box-shadow` animat nicăieri, canvas/WebGL doar în `fluid.ts` (+ detecția din `capabilities.ts`), notița de licență MIT obligatorie în `fluid.ts`, haloul static (`halo-static`: fără `data-anim="halo"` și fără `halo.ts`). Rulează în hook-ul PostToolUse; **nicio secțiune nu e gata fără audit curat.**
