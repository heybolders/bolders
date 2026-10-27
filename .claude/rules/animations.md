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
- **View Transitions:** la `astro:before-swap` → `ctx.revert()` pentru toate contextele, `ScrollTrigger.getAll().forEach(t => t.kill())`, `lenis.destroy()`. La `astro:page-load` → reinițializare. Nicio animație nu pornește pe `DOMContentLoaded`.
- **`prefers-reduced-motion: reduce` este obligatoriu** pentru fiecare animație: fără Lenis, scrub, pin și marquee; conținutul în starea finală. Se testează explicit.
- Starea inițială ascunsă se setează din JS (sau cu o clasă pusă de modul), nu în CSS, ca fără JS conținutul să rămână vizibil.
- O singură instanță Lenis, legată de `ScrollTrigger.update` și de `gsap.ticker`.
- Pluginuri permise: `gsap`, `ScrollTrigger`, `SplitText`, `Observer`, `Flip`. Se înregistrează o singură dată, în modul.
- **Interzis:** Three.js, WebGL, canvas decorativ, shader-e, Lottie, jQuery, SplitType, cursor custom, preloader.
- Animează doar `transform`, `opacity`, `clip-path` și axa `wght` a fontului. Fără layout thrash (`top`, `left`, `width` animate).
- Pe mobil (`< 768px`): maximum o secțiune fixată per pagină; fără efecte care depind de hover.
