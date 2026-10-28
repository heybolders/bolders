---
paths:
  - "src/scripts/**/*.ts"
  - "src/components/**/*.astro"
  - "src/layouts/**/*.astro"
---

# Animații

- Toate animațiile trec prin **modulul central** `src/scripts/animations/`. Componentele marchează elementele cu `data-anim="<nume>"` (+ `data-anim-*`) și nu importă GSAP sau Lenis direct.
- Nume și comportament: exclusiv cele din `docs/ANIMATIONS.md`. Un `data-anim` nou se documentează acolo înainte de implementare.
- Fiecare animație rulează în `gsap.context()` + `gsap.matchMedia()` și returnează o funcție de cleanup.
- **View Transitions:** gestionate central în `src/scripts/animations/index.ts` (vezi ANIMATIONS.md, Principii): la `astro:before-swap` → cleanup + `mm.revert()` + `ctx.revert()` pentru contextele non-persistente, `ScrollTrigger.getAll().forEach(t => t.kill())` când nu există persistente, `lenis.destroy()`. La `astro:page-load` → reinițializare. Nicio animație nu pornește pe `DOMContentLoaded`.
- **`prefers-reduced-motion: reduce` este obligatoriu** pentru fiecare animație: fără Lenis, scrub, pin și marquee; conținutul în starea finală. Se testează explicit.
- Starea inițială ascunsă se setează din JS (sau cu o clasă pusă de modul), nu în CSS, ca fără JS conținutul să rămână vizibil.
- O singură instanță Lenis, legată de `ScrollTrigger.update` și de `gsap.ticker`.
- Pluginuri permise: `gsap`, `ScrollTrigger`, `SplitText`, `Observer`, `Flip`. Se înregistrează o singură dată, în modul.
- **Interzis:** Three.js, Lottie, jQuery, SplitType, preloader. Nimic din original nu se elimină fără confirmarea lui Adi (DESIGN.md §6).
- Animează doar `transform`, `opacity` și `clip-path` (DESIGN.md §4 „Reguli de mișcare”). Axa `wght` doar pe silabele hero, cu lățimea rezervată (fără reflow), până când `smoke-text` înlocuiește respirația. Fără layout thrash (`width`, `height`, `margin`, `top`, `left`, `font-size` animate la scroll).
- Pe mobil (`< 768px`): maximum o secțiune fixată per pagină; fără efecte care depind de hover.

## Efecte reactivate (ANIMATIONS.md, „Efecte reactivate”)

- `data-anim` noi: `smoke-text`, `glow`, `cursor`, `fluid`. Haloul **nu** e `data-anim`: e decor static, ca în original (DESIGN.md §7; `audit:rules`, regula `halo-static`, respinge `data-anim="halo"` și `halo.ts`). Comportamentul (proprietăți, mobil, reduced motion) e cel din ANIMATIONS.md; un fișier per efect în `src/scripts/animations/`.
- Toate verifică `src/scripts/animations/capabilities.ts` înainte să pornească: `prefersReducedMotion()`, `hasFinePointer()`, `supportsWebGL()`, `isLowEndDevice()`. La reduced motion niciunul nu se montează (sau rămâne static).
- **Excepții permise, strict limitate** (verificate de `npm run audit:rules`):
  - `filter: blur()` **doar** în `src/scripts/animations/smoke-text.ts`.
  - canvas / WebGL **doar** în `src/scripts/animations/fluid.ts`. Singura altă atingere permisă: detecția de suport din `capabilities.ts` (`supportsWebGL()` creează un canvas temporar, fără randare).
  - Orice altă utilizare de `filter` (inclusiv utilitarele `blur-*`, `drop-shadow-*`), `box-shadow` animat (`boxShadow` în GSAP, `transition-shadow`, tranziții/keyframes pe `box-shadow`) sau canvas rămâne **interzisă**. (`backdrop-blur` din nav și panoul footerului e `backdrop-filter`, static, permis.)
- `glow`: doar `opacity` și `transform` pe pseudo-elemente/elemente cu gradient din tokeni; niciodată lime ca glow sau halou.
- `cursor`: doar cu `pointer: fine`, doar `transform`; cursorul nativ rămâne pe `input`/`textarea`/`select`.
- `fluid` (WebGL-Fluid-Simulation, Pavel Dobryakov, MIT): notița de licență MIT rămâne în `fluid.ts`; încărcare după LCP (`requestIdleCallback`, fallback `setTimeout`, `import()` dinamic), rezoluție redusă pe mobil, randare oprită fără mișcare și cu tab-ul ascuns, ascultători touch pasivi, oprit la reduced motion, fără WebGL sau pe dispozitiv slab.
