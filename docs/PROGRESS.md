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

## Etapa 2 – Setup proiect + corecturi documentație ✅ (2026-10-27)

### Corecturi documentație (aprobate)
- **DESIGN.md:** hero centrat (punctul 3 + schița); eliminat „layout centrat simetric clasic” din anti-banal; tokenii de text redenumiți (`text-tag`, `text-body`, `text-lead`, `text-h3`, `text-h2-sm`, `text-h2`, `text-story`, `text-display`, `text-wordmark`) + `--text-*: initial`; regula Manrope 200 doar la display/wordmark (≥ ~3rem); secțiune nouă §4 „Reguli de mișcare” (anti-banal devine §5).
- **ANIMATIONS.md:** homepage §5 redevine „Resurse” cu `data-anim="resource-reveal"` (fantă `clip-path` + contra-mișcare, scrub); `service-list` doar pe Departamente; metoda `+=250%`; respirația silabelor fără reflow (`inline-grid` cu copie invizibilă la wght 700); trimiterile la inspirație aliniate exact cu `inspiratie.md` (secțiuni `01-hero`…`07-footer`, numele exacte ale fișierelor).
- **continut.md:** corecturile efective aplicate (Departamente, Agenție, Bolders este, Proiectele noastre de succes, Experiență în web și marketing, experiență, perfecțiune, virgula, Contactează-ne, Numele tău, Scrie mesajul tău); „tehnologii web moderne”; „peste 50” peste tot, „349” eliminat; testimoniale și proiecte → lorem ipsum (fără poze / imagini placeholder neutre); „Acreditări Webflow & Figma” și „Recenzii Google/Trustpilot” → de confirmat; News scos din meniu/footer; tabelul de greșeli are acum coloana Stare.
- `.claude/rules/` sincronizate (styling, animations, content).

### Setup
- Astro 7.4.2 (`output: "static"`), TypeScript `strictest`, alias `@/*`, Tailwind 4.3.3 prin `@tailwindcss/vite`, GSAP 3.15.0, Lenis 1.3.27.
- Font: `Manrope-Variable-latin-ext.woff2` (32 KB, din TTF de 161 KB), axa wght 200–800, verificat ă â î ș ț + majuscule; ș/ț cu virgulă (U+0218–021B) distincte de variantele cu sedilă. Încărcat prin Fonts API (stabil în Astro 7), `font-display: swap`, preload.
- Modulul de animații: registry, `gsap.context` + `gsap.matchMedia` (isDesktop/isMobile/reduceMotion), Lenis pe `gsap.ticker` (`syncTouch: false`, oprit la reduced motion), ciclu `astro:before-swap` / `astro:page-load`, pluginuri înregistrate o dată.
- Calitate: Prettier (astro + tailwindcss), ESLint flat (typescript-eslint strict + eslint-plugin-astro, interzice `../`), hook PostToolUse, guard „lorem” la build.
- Pagina de test `src/pages/index.astro` + capturi `reference/screenshots/etapa-2/test-375.png`, `test-1440.png`. Verificat: font încărcat, modul pornit, comutare live desktop→mobil, reduced motion (scroll nativ), ciclul swap/page-load, fără scroll orizontal, fără erori în consolă.
- `npm run build`, `npm run check` (0 erori/avertismente/hint-uri), `npm run lint`: curate.

### Abateri și motive
- `--font-sans: var(--font-manrope)` în `@theme inline`, nu `"Manrope"` literal: Fonts API generează numele familiei cu hash și fallback cu metrici.
- Dependențe dev în plus față de listă: `@types/node` (tipurile pentru `integrations/placeholder-guard.mjs` cer `astro check`), `@eslint/js`, `@astrojs/check`, `typescript` (cerute de ESLint și `astro check`).
- View Transitions: în loc de `ScrollTrigger.killAll()` necondiționat, se revertează contextele non-persistente și se omoară toate trigger-ele doar când nu există elemente `transition:persist`, ca headerul/footerul persistente să nu-și piardă trigger-ele.
- Pagina de test are etichetele direct în fișier (temporară, se șterge la Etapa 3), la fel `data-anim="debug"`.
- Lighthouse nu s-a rulat: pagina de test nu e reprezentativă. Se rulează la finalul Etapei 3.

### Neclarități
- `astro build`/`check` afișează avertismente `glob-loader` „No files found” pentru cele 4 colecții goale. Dispar odată cu primul conținut.
- Reduced motion schimbat în timpul sesiunii: Lenis pornește/se oprește, dar factory-urile deja montate păstrează referința `lenis` de la montare până la următoarea navigare.
- Cât timp testimonialele și proiectele sunt lorem ipsum, build-ul de producție va eșua după ce sunt folosite în pagini (intenționat).
- Imaginile placeholder neutre pentru proiecte se generează la etapa secțiunii Proiecte.
- `inspiratie.md` are titlul `## 01-hero` duplicat și nu listează `footer.png`; nu am modificat fișierul de inspirație.

## Etapa 3 ⏭️ următoarea
- Conținutul exact se stabilește la cerere (Etapele 3–5: header, footer, secțiuni, pagini). Se șterge pagina de test și `data-anim="debug"`.
