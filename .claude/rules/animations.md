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
- **Interzis:** Three.js, WebGL, canvas decorativ, shader-e, Lottie, jQuery, SplitType, cursor custom, preloader.
- Animează doar `transform`, `opacity` și `clip-path` (DESIGN.md §4 „Reguli de mișcare”). Axa `wght` doar pe silabele hero, cu lățimea rezervată (fără reflow). Fără layout thrash (`width`, `height`, `margin`, `top`, `left`, `font-size` animate la scroll).
- Pe mobil (`< 768px`): maximum o secțiune fixată per pagină; fără efecte care depind de hover.
