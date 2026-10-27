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

## Etapa 3 – Structura globală ✅ (2026-10-27)

### Corecturi din Etapa 2
- Guard „lorem”: build-ul de producție eșuează în continuare; `ALLOW_PLACEHOLDERS=1` îl transformă în avertisment doar local (documentat în CLAUDE.md: deploy-ul nu setează flag-ul).
- `inspiratie.md`: eliminat titlul `## 01-hero` duplicat (intrarea rămasă e cea despre hero-ul Bolders); `07-footer` are acum `Fișier: footer.png`.

### Construit
- **Layout:** `BaseLayout` cu `lang="ro"`, `theme-color #0d0d0d`, Fonts API, `global.css`, `<ClientRouter />`, skip link „Sari la conținut” (spre `<main id="continut">`, cu focus).
- **SEO:** `components/global/Seo.astro` (title, description, canonical, Open Graph, Twitter, `noindex` pe 404, fără canonical acolo); `site: https://bolders.ro`; URL-uri fără slash final (`trailingSlash: "never"`, `build.format: "file"`).
- **Favicon:** `public/favicon.svg` cu `<style>` + `prefers-color-scheme` (ink pe tab deschis, alb pe tab închis), `favicon-32.png` și `apple-touch-icon.png` 180 generate din `brand/logo.svg` (simbol alb pe pătrat ink, pentru că PNG-ul nu se poate adapta temei).
- **Navigație:** `src/config/navigation.ts` (rute + liste header/meniu/footer/legal), etichete în `src/content/global.ts`. Fără News.
- **Header** (`transition:persist`): logo „b” paper cu hover mascat, linkuri cu `aria-current` + lime, buton „Contact” cu punct lime, pill cu blur, `data-anim="nav"` (ascundere la scroll), meniu mobil full-screen.
- **Button** (`ui/Button.astro`): variante `header`, `cta`, `footer`; punctul lime se extinde prin `clip-path` (doar CSS), textul trece la ink, fără glow.
- **Footer** (`transition:persist`): meniul pe 3 rânduri cu „/” lime (fără News), coloană rezervată pentru contact (Etapa 6), wordmark „Bolders” cu `data-anim="wordmark"`, bară cu © anul build-ului + linkuri legale. Fără iconițe sociale și fără linkuri de template.
- **Pagini:** stub-uri pentru `/`, `/agentie`, `/departamente`, `/proiecte`, `/contact`, `/intrebari-frecvente` (titlu cu `line-reveal`, meta din colecția `pagini`), 404 în identitatea Bolders. Pagina de test și `data-anim="debug"` eliminate.
- **Animații:** `nav`, `line-reveal`, `wordmark`; crossfade 0.3 pe `main`; ancore prin `lenis.scrollTo` cu offset (detalii în ANIMATIONS.md, „Implementare (Etapa 3)”).

### Verificare
- Playwright 375 / 768 / 1440: header, meniu mobil (deschidere, Tab rămâne în header, Esc închide și readuce focusul, închidere la navigare, `main` inert și Lenis oprit cât e deschis), header ascuns la scroll în jos (−100%) și vizibil la scroll în sus, tranziții între toate stub-urile (header același nod DOM, `aria-current`, title și canonical corecte), 404, reduced motion (fără Lenis, fără split, header fix, meniu fără animație, scroll blocat prin `overflow-hidden`).
- Tastatură: skip link → logo → linkuri → buton → footer, inel lime pe toate; ținte ≥ 44 px (linkurile footerului ridicate de la 42 la 44).
- Contrast: `paper` și `paper-muted` pe ink, `lime` pe `ink`/`ink-soft`, `ink` pe `lime` (buton activ) peste AA. Lighthouse mobil (build): Accessibility 100, Best Practices 100, SEO 100. Performanța nu e inclusă în tool-ul Lighthouse disponibil; trace mobil (Slow 4G, CPU 4×): LCP 1,4 s, CLS 0.
- Fără erori în consolă, fără scroll orizontal la 375 / 768 / 1440. În producție titlul e împărțit și ascuns înainte de primul paint (fără flash).
- `npm run build` (fără `ALLOW_PLACEHOLDERS`), `npm run check` (0/0/0), `npm run lint`: curate.
- Capturi: `reference/screenshots/etapa-3/` (header, footer, meniu deschis, pagini, 404, focus, hover, skip link, reduced motion).
- Comparație cu `reference/screenshots/home/` și `footer.png`: aceeași structură (logo stânga, pill central, buton dreapta; pe mobil pill cu logo + hamburger; meniul footerului pe rânduri cu „/” lime; wordmark mare; bara de jos). Diferențe intenționate: logo fără cercul din original (cerut „b” din `brand/logo.svg`), „Contact” din meniu nu mai e lime permanent (lime = pagina curentă), separatorul „/” stă la finalul elementului, wordmark cu gradient vertical static, fără iconițe sociale, Stripe/Wise și „Privacy Policy and Terms”.

### Abateri și motive
- **Meniul mobil sub `lg` (992 px), nu sub `md`:** la 768 cele 4 linkuri + logo + buton nu încap în pill.
- **Masca `line-reveal` lărgită** (`.line-mask`) și pornire de la `yPercent 130` în loc de 110: cu line-height 0.95, masca strictă tăia „g” și virgula din „ț”.
- **Linkurile din meniul mobil** folosesc o mască în markup (`li` cu `overflow: clip`), nu SplitText: un singur rând per link.
- **Persistente vs. Lenis:** header/footer citesc instanța curentă cu `getLenis()`; rezolvă și neclaritatea din Etapa 2 pentru elementele persistente.
- **Ancore:** `history.replaceState` în loc de `pushState`, ca să nu stric indexul de istoric al routerului Astro.
- **Prefetch dezactivat** (`data-astro-prefetch="false"`) pe linkurile legale cât timp paginile nu există (hover-ul producea 404 în consolă). Lista `PENDING_ROUTES` din `navigation.ts` se golește la Etapa 5.
- **Bara de dev Astro dezactivată** (`devToolbar: false`): se suprapunea peste capturi.
- **`@custom-variant current`** în loc de `aria-[current=page]:` (fără valori arbitrare în markup).
- **Anul din footer** se generează la build (site static, se reconstruiește la fiecare deploy), nu pe client.

### Neclarități
- **Format URL / hosting:** `dist/agentie.html` servit la `/agentie` funcționează direct pe Netlify, Vercel, Cloudflare Pages și nginx cu `try_files $uri $uri.html`; pe Apache e nevoie de o regulă de rewrite. De confirmat la deploy.
- **Texte de interfață fără sursă** (marcate `TODO(continut)` în `src/content/global.ts`): etichetele ARIA, textele paginii 404. **Meta provizorii** (`provizoriu: true` în `src/content/pagini/*.json`): title compus din etichetă + „Bolders”, description din texte existente în `continut.md`.
- Lipsește o imagine Open Graph (cardul Twitter e `summary`, fără imagine).
- Linkurile legale duc la 404 până la Etapa 5.
- Routerul Astro scrie în consolă un avertisment informativ la reduced motion („all view transition animations … are disabled”); nu vine din codul nostru.
- Wordmark-ul are `text-wordmark` (max 20rem), deci nu umple tot containerul la 1440 (≈ 1050 / 1216 px) ca în original. Se poate mări tokenul, dacă se dorește.

## Etapa 4 ⏭️ următoarea
- Secțiunile homepage-ului (DESIGN §3, ANIMATIONS „Homepage”). Se înlocuiește stub-ul de pe `/`.
