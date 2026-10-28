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

## Mobile-first
- Totul se gândește întâi la **375 px**, apoi se extinde (`sm:` → `2xl:`).
- **Ținte de atingere ≥ 44×44 px** (`min-h-11` / `size-11`), inclusiv linkurile din liste și footer.
- **Text de conținut ≥ 16 px** (`text-body` sau mai mare) la toate lățimile. `text-tag` (14 px) nu se folosește pentru conținut.
- **Hover nu e niciodată singura cale de acces:** orice informație sau acțiune dezvăluită la hover e accesibilă și la focus/tap.
- **Fără scroll orizontal** la nicio lățime (`scrollWidth === clientWidth`).
- Verificare obligatorie în Playwright pe **emulare de dispozitive reale**: iPhone SE (375×667, DPR 2), iPhone 15 (393×852, DPR 3), Pixel 7 (412×915, DPR 2.625), toate cu `isMobile` + `hasTouch`; plus 768, 1440 și 1920. La fiecare: captură, scroll orizontal, ținte < 44 px, text < 16 px, consolă.

## Verificare vizuală (obligatorie după fiecare secțiune)
1. Pornește serverul de dev și deschide pagina cu Playwright.
2. Capturi pe dispozitivele din „Mobile-first” (full page + stările animate relevante).
3. Compară cu `reference/screenshots/<pagina>/` și cu inspirația din `reference/inspiratie/`. Notează diferențele intenționate.
4. Verifică consola (fără erori/avertismente) și varianta `prefers-reduced-motion: reduce`.
5. Fără scroll orizontal la 375 px.

## Finalizare (nicio secțiune nu e gata fără toate)
- `npm run audit:rules` curat (0 abateri), `npm run build` (fără `ALLOW_PLACEHOLDERS`), `npm run check`, `npm run lint`, `npm run format:check`.
- Verificarea pe dispozitive de mai sus, fără abateri.
- Lighthouse (performance, a11y, SEO ≥ 95 pe mobil); LCP și CLS pe Slow 4G + CPU 4× nu cresc față de secțiunea anterioară.
