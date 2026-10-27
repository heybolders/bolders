# PROGRESS

## Etapa 0 – Inițializare ✅
- Repo, `.gitignore`, `.nvmrc`, asset-uri de brand (`brand/`).

## Etapa 1 – Extragere design și reguli ✅ (2026-10-27)
- `reference/webflow/`: HTML pentru 3 pagini publicate + 404/401, CSS, JS Webflow, IX2 extras în JSON + rezumat, cod custom inline, fonturi, Lottie
- `reference/screenshots/`: 191 de capturi (full page 375/768/1440, stări la scroll la 375/1440, timeline hero)
- `reference/media/`: 66 de imagini cu nume descriptive + `INVENTAR.md` (32 marcate „posibil stock/străin”)
- `reference/continut.md`: texte pe pagini și secțiuni, fără rămășițe de template
- `reference/inspiratie/live/`: 77 de capturi de scroll (studiors: proiecte, metodă, servicii, contact; guillaumezhu: manifest + „My journey”)
- `docs/DESIGN.md`, `docs/ANIMATIONS.md`, `CLAUDE.md`, `.claude/rules/*`

### Neclarități deschise (de rezolvat cu clientul)
- Pe Webflow sunt publicate doar Homepage, Departamente și o pagină legală de template. Agenție, Proiecte, Contact, FAQ, News, Confidențialitate, Termeni și Cookies nu există (linkuri `#`).
- Lipsesc: meta title/description, datele de contact și conturile sociale Bolders, textele legale, conținutul pentru Agenție/News, tipul/anul proiectelor, linkul e-garten.
- `07-poveste.mov` este menționat în `inspiratie.md`, dar nu există în repo, deci nu s-au extras cadre video.
- Capturile `sectiune sub hero.png` și `text intre sectiuni 1–3.png` nu au intrare în `inspiratie.md`. Au fost folosite ca sursă pentru `words-light` și `title-settle`, de confirmat.
- Cifre contradictorii: „Mai mult de 50 de proiecte” vs „349 proiecte de succes!”.
- Mai multe imagini de testimoniale par stock/placeholder (vezi INVENTAR).

## Etapa 2 – Inițializare proiect Astro ⏭️ următoarea
- Proiect Astro + TypeScript strict + Tailwind v4 (`@theme` din DESIGN.md) + Prettier cu plugin Tailwind
- GSAP, Lenis, View Transitions, scheletul modulului `src/scripts/animations/`
- Completarea comenzilor în `CLAUDE.md`
