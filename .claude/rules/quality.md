---
paths:
  - "src/**"
---

# Calitate

## Imagini
- Doar prin `<Image />` / `<Picture />` din `astro:assets`, cu sursa în `src/assets/`. Fără `<img>` cu cale din `public/`, cu excepția favicon-ului și SVG-urilor de UI inline.
- `alt` descriptiv în română; `alt=""` doar pentru imagini decorative.
- `width`/`height` sau `aspect-ratio` setate (fără CLS); `loading="eager"` + `fetchpriority="high"` doar pentru imaginea LCP.
- Imaginile marcate „posibil stock/străin” în `reference/media/INVENTAR.md` nu se folosesc fără confirmarea clientului. Cele din `template/` nu se folosesc deloc.

## Accesibilitate
- HTML semantic: un singur `h1` per pagină, ierarhie corectă a titlurilor, `header`/`main`/`footer`/`nav`.
- Tot ce e interactiv e accesibil din tastatură, cu `:focus-visible` vizibil (inel lime pe ink).
- Contrast WCAG AA. Ținte de atingere ≥ 44×44 px.
- Textul împărțit de SplitText rămâne citibil de screen readere (`aria-label` pe părinte, copiii `aria-hidden`).
- Slider, acordeon, meniu și formular: roluri și stări ARIA corecte (`aria-expanded`, `aria-current`, `aria-live` pentru pasul formularului).
- `prefers-reduced-motion` respectat (vezi `animations.md`).

## Verificare vizuală (obligatorie după fiecare secțiune)
1. Pornește serverul de dev și deschide pagina cu Playwright.
2. Capturi la 375, 768 și 1440 px (full page + stările animate relevante).
3. Compară cu `reference/screenshots/<pagina>/` și cu inspirația din `reference/inspiratie/`. Notează diferențele intenționate.
4. Verifică consola (fără erori/avertismente) și varianta `prefers-reduced-motion: reduce`.
5. Fără scroll orizontal la 375 px.
- Înainte de finalul unei etape: `npm run build` fără erori și Lighthouse (performance, a11y, SEO ≥ 95 pe mobil).
