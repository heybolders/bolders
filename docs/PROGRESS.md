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

## Etapa 4 – Homepage 🔄 în lucru

### Secțiunea 1: Hero ✅ (2026-10-27)

#### Corecturi din Etapa 3
- **Footer:** separatorul „/” eliminat din meniu (elementele despărțite doar de spațiu). Scos din DESIGN.md (tabelul de tokeni, identitate, rolurile lime), ANIMATIONS.md (footer) și `.claude/rules/styling.md`.
- **Wordmark:** „Bolders” e acum un SVG cu `viewBox` pe conturul literelor, măsurat cu fontul real; umple exact lățimea containerului (verificat la 375 / 768 / 1440 / 1920: marginile SVG = marginile containerului), fără JS și fără CLS. Tokenul `text-wordmark` a fost eliminat (nefolosit).
- **Logo fără cerc:** decizie notată în DESIGN.md §3 („Decizii Etapa 4”).

#### Construit
- `src/content/acasa.ts`: textele hero-ului din `continut.md` (pill, titlu în trei părți + cele 7 silabe originale, subtitlu, buton spre `/contact`).
- `src/components/home/Hero.astro`: centrat (pill, titlu, subtitlu, buton), `min-h-svh` cu padding de sus pentru header (zona utilă = 100svh − header), „Acum este momentul” Manrope 200 și „să strălucești!” 700, ambele `text-display`. Titlul complet în `sr-only`, partea vizuală `aria-hidden`. Pe mobil titlul cade pe 3 rânduri („Acum este / momentul / să strălucești!”), silabele pe același rând (`whitespace-nowrap`).
- `src/components/home/HeroGrid.astro`: liniile de construcție ale lui „b” ca grilă `line` aliniată la coloanele reale (detalii în DESIGN.md §2).
- `src/scripts/animations/hero-syllables.ts` + scriptul inline din Hero: secvența, respirația, sesiunea, bugetul de 1 s (ANIMATIONS.md, Homepage §1, „Implementare (Etapa 4)”).
- `src/pages/index.astro`: stub-ul înlocuit cu hero-ul.

#### Verificare
- Capturi: `reference/screenshots/etapa-4/hero/` (cadre la 0 / 400 / 900 / 1600 / 3200 / 4200 / 4500 ms + final la 375 / 768 / 1440; revenire; reduced motion; fără JS) și `reference/screenshots/etapa-4/footer-{375,768,1440,1920}.png`.
- Comparație cu `reference/screenshots/home/hero-timeline/`: aceeași ordine (pill → titlu → silabe → subtitlu/buton) și aceeași compoziție centrată. Diferențe intenționate: titlul mult mai mare (display 200/700 în loc de 500), silabele urcă din mască fără blur și nu mai pleacă spre dreapta în buclă (o singură respirație la 4 s), fără canvas WebGL și fără halo-ul alb al pill-ului; grila pătrată cu glow e înlocuită cu liniile de construcție; butonul fără „→” și fără glow.
- Fără scroll orizontal la 375 / 768 / 1440 / 1920; consola fără erori sau avertismente (în afara mesajului informativ al routerului la reduced motion, cunoscut din Etapa 3).
- Reduced motion: fără clasă de ascundere, fără split, hero static. Fără JS: totul vizibil. Resize peste `md` după intrare: nimic nu dispare.
- **Performanță (build, `astro preview`):** mobil Slow 4G + CPU 4×, cache rece: **LCP 1,40 s, CLS 0** (elementul LCP e subtitlul). Desktop fără throttling: LCP 67 ms, CLS 0, intrarea completă rulează. Lighthouse mobil: Accessibility 100, Best Practices 100, SEO 100.
- `npm run build` (fără `ALLOW_PLACEHOLDERS`), `npm run check` (0/0/0), `npm run lint`, `npm run format:check`: curate.

#### Abateri și motive
- **Ascunderea inițială o face un script inline, nu modulul.** Pe Slow 4G modulul (≈ 60 KB gzip) ajunge la ≈ 2,3 s, după primul paint: dacă ar ascunde el textul, ar apărea un flash. Prima variantă (ascuns până la modul, failsafe 2 s) dădea LCP 2,96 s și un flash posibil între 2 s și sosirea modulului. Varianta finală: ascuns cel mult 1 s de la începutul navigării; dacă modulul nu a ajuns, hero-ul rămâne static și rulează doar respirația. Consecință: **pe conexiuni lente prima vizită nu vede intrarea completă**, doar respirația.
- **`data-anim` pe `<section>`, nu pe titlu** (orchestrează și pill-ul, subtitlul și butonul).
- **Respirația pleacă de la 700:** silabele stau la 700 în repaus, deci unda e 700 → 200 → 700.
- **Varianta scurtă (revenire) nu are respirație.**
- **Pill fără `shadow-tag`:** umbra albă din original arată ca un glow (lista anti-banal).
- **Liniile de construcție sunt redesenate**, nu e inclus `card-bolders-linii-constructie.svg` (50 KB, cu măști și filtre exportate); se păstrează geometria (cerc, două diagonale paralele, trei orizontale, verticale).

#### Neclarități
- Respirația „200 → 700 → revenire” interpretată ca undă de la 700 (vezi mai sus). De confirmat.
- Pe conexiuni lente, prima vizită vede hero-ul static. Dacă intrarea completă e mai importantă decât LCP, bugetul de 1 s se poate mări (fiecare secundă se adaugă direct la LCP).
- La revenire în aceeași sesiune hero-ul apare cu un crossfade de 0.4 s, inclusiv la reload.

### Corecturi după review-ul hero-ului + audit de consistență ✅ (2026-10-28)

#### Audit de consistență (`npm run audit:rules`)
- `scripts/audit-rules.mjs`, fără dependențe noi. Verifică în `src/`: valori arbitrare Tailwind (`x-[..]`, `[prop:val]`, `x-(--var)`), `style=` inline, `<style>` în componente, culori hex/rgb/hsl și `px` în afara `global.css`, importuri GSAP/Lenis în afara `src/scripts/animations/`, importuri relative, texte hardcodate în markup (noduri text, inclusiv din `.map()`, și `aria-label`/`alt`/`title`/`placeholder`), CSS din `global.css` în afara layerelor cu nume și clase din `global.css` nedocumentate în `.claude/rules/styling.md`. Comentariile sunt ignorate. Testat pe un fișier cu abateri intenționate (toate cele 18 prinse), apoi șters.
- **Abateri găsite pe codul existent (header, footer, button, hero, layout):**
  - `global.css`: `::view-transition-group(header)` și `@media (prefers-reduced-motion)` pentru `::view-transition-*` erau în afara unui layer → mutate în `@layer base` (`!important` dintr-un layer bate în continuare `!important`-ul nelayerizat al routerului).
  - `global.css`: 6 clase custom fără documentare (`.btn`, `.btn-lg`, `.btn-fill`, `.line-mask`, `.hero-pending`, `.hero-grid`) → lista exactă a excepțiilor, cu motivul fiecăreia, în `.claude/rules/styling.md`.
  - `BaseLayout.astro`: `#0d0d0d` în `<meta name="theme-color">` → excepție documentată (meta-ul cere o culoare literală), în allowlist-ul scriptului.
  - Fals pozitiv eliminat din script: `<!doctype html>` citit ca text.
  - Restul regulilor (valori arbitrare, inline, `<style>`, px, GSAP, aliasuri, texte) erau deja respectate.
- Hook nou `.claude/hooks/audit-rules.sh` în `.claude/settings.json` (PostToolUse, rulează la orice modificare în `src/`). Regula de finalizare în `.claude/rules/quality.md` și `CLAUDE.md`: nicio secțiune nu e gata fără audit curat.

#### Mobile-first
- Reguli noi în `.claude/rules/quality.md` („Mobile-first” + „Finalizare”): 375 întâi, ținte ≥ 44×44, text de conținut ≥ 16 px, hover niciodată singura cale, fără scroll orizontal, verificare pe iPhone SE / iPhone 15 / Pixel 7 emulate + 768 / 1440 / 1920.
- Pill-ul din hero trece de la `text-tag` (14 px pe mobil) la `text-body` la toate lățimile; linkurile legale din footer de la `text-tag` la `text-body`.

#### Footer (ca în `footer.png`)
- Wordmark pe toată lățimea, cu gradient orizontal static (alb în stânga → stins spre dreapta) și literele din dreapta („e r s”) în contur (`stroke` `mist`, 1.5 px `non-scaling-stroke`).
- Panou `rounded-panel` (mobil `rounded-card`), `bg-ink-soft/60`, `backdrop-blur-panel`, care începe la mijlocul înălțimii literelor la orice lățime (grilă cu rândul 1 = `aspect-wordmark-half`, fără JS) și se prelungește sub linia de bază. În panou: © anul + Bolders Srl, linkurile legale, locul gol pentru iconițele sociale (`data-slot="social"`). Bara veche de sub wordmark a fost înlocuită de panou. Fără Stripe/Wise.
- Separatorul „/” lime revine, **doar între linkurile de pe același rând**: e poziționat în `gap`-ul din stânga fiecărui link, iar lista are `overflow-clip`, deci la începutul oricărui rând vizual (inclusiv după wrap pe mobil) nu se vede. DESIGN.md: separatorul redevine element de identitate (decizia din hero e anulată), rolurile lime actualizate.
- Tokeni noi (DESIGN §2 → `@theme`): `--blur-panel: 30px` (din overlay-urile originale), `--aspect-wordmark-half: 3319 / 375`. Lista anti-banal: blur permis pe nav și pe panoul footerului (ambele din original).

#### Header
- Linkurile din pill: `text-body` 400 → `text-lead` 500. **Măsurat:** erau 16 px, iar originalul are 1.2rem ≈ 19 px / 500, deci erau mai mici, nu mai mari, decât în referință. Varianta aleasă (confirmată de tine): `text-lead` (18 px), tokenul cel mai apropiat. Butonul „Contact” din header: tot `text-lead`, pentru echilibru. Verificat la 992 și 1440: pill-ul încape cu spațiu liber de ambele părți.

#### Logo header
- Simbolul „b” din header: `h-6` → `h-7` (24 → 28 px înălțime, ≈ 44 × 28 px), în aceeași zonă de click de 56 × 44. Capturi: `reference/screenshots/etapa-4/corecturi/header-logo-{1440,iphone-se}.png`.

#### Buton
- Punctul e acum un element propriu (`size-2 bg-lime`), iar umplerea pornește de la `circle(0)` din centrul lui. La hover/focus: punctul rămâne lime pe fundal lime (dispare). Apăsat (`:active`): punctul devine `ink`. Toate variantele (`header`, `cta`, `footer`). Verificat cu culoarea calculată: repaus/hover/focus `#aaf22d`, apăsat `#0d0d0d`.

#### Verificare
- Playwright, dispozitive emulate (`isMobile` + `hasTouch`): iPhone SE 375×667, iPhone 15 393×852, Pixel 7 412×915, plus 768, 992, 1440, 1920: fără scroll orizontal, nicio țintă < 44 px, niciun text vizibil < 16 px, consola curată. Reduced motion: wordmark static (`transform: none`).
- Capturi: `reference/screenshots/etapa-4/corecturi/` (`<dispozitiv>-hero.png`, `<dispozitiv>-footer.png`, `iphone-se-footer-reduced-motion.png`, `buton-{repaus,hover,focus,activ}.png`, `buton-header-hover.png`).
- Comparație cu `footer.png`: aceeași compoziție (meniu pe rânduri cu „/” lime între linkuri, wordmark cu gradient orizontal și contur la dreapta, panou rotunjit cu blur peste jumătatea de jos). Diferențe intenționate: fără News, fără Stripe/Wise și „Privacy Policy and Terms”, iconițe sociale goale, formularul de contact rămâne pentru Etapa 6.
- **Performanță (build, Slow 4G + CPU 4×, 375 mobil, cache rece):** baseline măsurat în aceeași sesiune pe `efca8f6` LCP 1423 ms / CLS 0; după corecturi LCP 1429 și 1431 ms / CLS 0. Diferența de 6–8 ms vine din CSS-ul puțin mai mare (render-blocking) și e în marja de variație dintre rulări.
- `npm run audit:rules` (0 abateri), `npm run build` (fără `ALLOW_PLACEHOLDERS`), `npm run check` (0/0/0), `npm run lint`, `npm run format:check`: curate.

#### Neclarități
- **„Starea activă” a butonului** interpretată ca `:active` (apăsat). Dacă e vorba de butonul paginii curente (ex. „Contact” din header pe `/contact`), se adaugă `current:` pe punct.
- Textele `© … Bolders Srl` și linkurile legale sunt acum `text-body` (regula 16 px); în original sunt mai mici.
- Pe mobil, panoul footerului e mai înalt decât jumătatea wordmark-ului (linkurile legale pe două rânduri), deci acoperă literele de la mijloc în jos și se întinde sub ele; proporția e fidelă doar de la `md` în sus.
- Auditul de texte acoperă markup-ul `.astro`. Textele setate din TS nu sunt verificate automat; momentan nu există niciunul în `src/scripts/`.

## Etapa: Reactivare efecte din original 🔄 (înainte de Storytelling)

Decizii confirmate de Adi (28.10):
- Se reactivează: fum WebGL la cursor/atingere pe toată pagina (și pe mobil), cursor custom, glow pe butoane. Se adaugă halouri de lumină difuză în spatele textelor (omise la recreare). Hero: „să strălucești!” cu fum în loop, în locul respirației 700 → 200 → 700.
- Limitele pentru fumul WebGL: încărcare după LCP (`requestIdleCallback`), rezoluție redusă pe mobil, randare oprită fără mișcare și cu tab-ul ascuns, ascultători touch pasivi, oprit la reduced motion, fără WebGL sau pe dispozitiv slab (`deviceMemory ≤ 2` sau `hardwareConcurrency ≤ 2`, doar dacă valoarea e definită; pragul de nuclee corectat de la 4 la 2, vezi mai jos).
- Iconițele 3D: reactivate, dar **amânate** până la fișierele originale de la Adi. Nu se ating până atunci.
- Rămân eliminate: poze stock, preloader cu procent, contoare animate.
- Regulă: nimic din original nu se elimină fără confirmarea lui Adi.

Pași: 1 fundația ✅ · 2 `halo` ✅ · 3 `glow` · 4 `smoke-text` · 5 `cursor` · 6 `fluid` (WebGL). Iconițe 3D: amânate.

### Pasul 1 din 6: fundația ✅ (2026-10-28)
Fără niciun efect vizual implementat; site-ul arată identic.
- **DESIGN.md:** din lista anti-banal (§5) au ieșit WebGL/fum la cursor, cursorul custom, glow-ul pe butoane și iconițele 3D (rămân interzise: glow pe carduri, Three.js/shader-e/canvas în afara `fluid`, magnetic buttons). Secțiune nouă **§6 „Efecte reactivate”** (tabel efect / original / `data-anim` / pas; iconițele 3D „amânate, fișiere de la Adi”), regula „nimic din original nu se elimină fără confirmarea lui Adi”, lime rămâne semnal (~3%), glow și halouri doar din tokeni. §4: excepțiile `filter: blur()` (smoke-text) și canvas/WebGL (fluid).
- **ANIMATIONS.md:** `data-anim` noi în tabel (`smoke-text`, `halo`, `glow`, `cursor`, `fluid`) și secțiunea „Efecte reactivate”, cu ce face fiecare, proprietăți animate, mobil și reduced motion. Hero: respirația e înlocuită de `smoke-text`. Cursor/splash și butoane: marcate reactivate; „Ce NU se preia” actualizat.
- **`.claude/rules/animations.md`:** aliniat la ANIMATIONS.md; excepțiile strict limitate (`filter: blur()` doar în `smoke-text.ts`, canvas/WebGL doar în `fluid.ts`, restul interzis, inclusiv `box-shadow` animat).
- **`audit:rules`:** reguli noi `filter` (proprietatea `filter`, `blur()`, utilitarele `blur-*` / `drop-shadow-*`; `backdrop-blur` static rămâne permis), `box-shadow-animat` (`boxShadow`, `transition-shadow`, tranziții/keyframes pe `box-shadow`), `canvas-webgl` (`<canvas>`, `createElement("canvas")`, `getContext(...)`, tipurile Canvas/WebGL), `licenta-fluid` (dacă `fluid.ts` există, trebuie să conțină „MIT”, „Pavel Dobryakov” și textul „Permission is hereby granted, free of charge”). Allowlist exact: `smoke-text.ts` pentru `filter`, `fluid.ts` pentru canvas. Testat cu fișiere temporare (toate cazurile prinse, excepțiile respectate), apoi șterse.
- **`src/scripts/animations/capabilities.ts`**, exportat din `index.ts`: `prefersReducedMotion()` (mutat din `conditions.ts`; `nav.ts` și `smooth-scroll.ts` importă de aici), `hasFinePointer()`, `supportsWebGL()` (WebGL2 → WebGL1, rezultat memorat, contextul de test eliberat cu `WEBGL_lose_context`), `isLowEndDevice()` (valoare nedefinită = nu e slab; `hardwareConcurrency` 0 tratat ca necunoscut). Fără `any`.
- Codul hero-ului rulează încă respirația; se înlocuiește la pasul 4.

#### Corectură (2026-10-28): detecția dispozitivelor slabe
- `isLowEndDevice()`: pragul `hardwareConcurrency` coborât de la ≤ 4 la **≤ 2**. Safari limitează valoarea la 4 sau 8 (anti-fingerprinting), deci ≤ 4 excludea iPhone-urile. Regula: slab = (`deviceMemory` definit și ≤ 2) SAU (`hardwareConcurrency` definit și ≤ 2); valoare nedefinită = nu e slab. ANIMATIONS.md actualizat.

#### Abateri și motive
- **`capabilities.ts` atinge canvas/WebGL**, deși regula spune „doar în fluid”: `supportsWebGL()` trebuie să creeze un canvas temporar ca să detecteze suportul. Excepția e limitată la exact cele două linii (allowlist pe text în `audit-rules.mjs`) și documentată în `.claude/rules/animations.md`.

#### Neclarități / de verificat la pașii următori
- Valorile `blur()` din `smoke-text` se scriu în `rem`/`em`: regula `px` rămâne valabilă și acolo.
- Tokenii pentru glow și halouri (din `#ffffff4d`, `#ffffff80`, `#ddd6d633`) se adaugă în DESIGN.md §2 la pașii 2–3.

### Pasul 2 din 6: halouri de lumină (`data-anim="halo"`) ✅ (2026-10-28)
- **Referința (Playwright pe bolders1.webflow.io):** haloul original e imaginea `centerbackground.png` ca fundal `cover` pe hero, pe fundalul fix din „Fii Bolders” + testimoniale (opacitate .4, .5 pe mobil) și pe cardul CTA (.88); pe Departamente și pe lista de servicii. Static (fără apariție/stingere, fără mișcare), neutru-rece, vârf ≈ 20% alb efectiv, rază ≈ 475 px la 1440 și ≈ 255 px la 375, centrat pe linia titlului. Valorile complete și tabelul „unde apare” sunt în ANIMATIONS.md, `halo`.
- **Tokeni** (DESIGN.md §2 → `@theme`): `--color-halo` (= `paper-dim`), `--spacing-halo` 32rem / `--spacing-halo-lg` 60rem, `--halo-duration` 14s în `@theme static` (citit doar din JS; fără `static`, Tailwind l-ar elimina).
- **`src/components/ui/Halo.astro`:** decorativ (`aria-hidden`, `pointer-events-none`), `absolute -z-10`, gradient doar din utilitare (`bg-radial from-halo via-halo/50 via-18% to-transparent to-70%`, profilul originalului), fără `filter`. Props `position` (`center`/`top`/`bottom`/`left`/`right`), `mobile` (false = ascuns sub md), `class`.
- **`src/scripts/animations/halo.ts`** (înregistrat în `registry.ts`): opacitate 1 → 0.35 și înapoi + derivă și scalare foarte lente, perioade diferite, decalaj de fază per halou (raportul de aur) și direcții alternate. Pauză în afara ecranului (ScrollTrigger) și cu tab-ul ascuns (`visibilitychange`); `will-change` doar cât rulează. Reduced motion: static, `opacity-60`. Pornește de la opacitatea plină, deci fără flash.
- **Hero:** `<Halo position="center" />` înaintea grilei (sub linii, ca în original); cade pe linia titlului (titlul e la 44–48% din înălțime), deasupra centrului blocului de conținut.
- **Verificare:** iPhone SE, iPhone 15, Pixel 7 (emulare reală, DPR, touch), 768, 1440, 1920: fără scroll orizontal (`scrollWidth === clientWidth`), consolă curată, capturi în `.playwright-mcp/halo-*.png`. Pauză/reluare testate (tab ascuns simulat, scroll în afara ecranului cu spațiu temporar), `will-change` `auto` în pauză. Reduced motion: opacitate 0.6, fără transform. View Transitions: `/` → `/agentie` → înapoi, haloul repornește, fără erori. **Slow 4G + CPU 4× (Pixel 7, build):** LCP 1435 ms față de 1423 ms la baseline (HEAD, aceeași sesiune; diferența e zgomot), CLS 0.00 în ambele. Contrast: `paper-muted` ≈ 6.3:1 în centrul haloului la opacitate maximă (≈ 9.6:1 fără), peste AA; `paper` > 10:1.
- `npm run audit:rules` (0 abateri), `npm run check` (0/0/0), `npm run lint`, `npm run format:check`, `npm run build` (fără `ALLOW_PLACEHOLDERS`): curate.

#### Abateri și motive
- **Animația nu există în original** (lumina e statică acolo). Apariția/stingerea în buclă și deriva au fost cerute explicit la pasul 2; restul (culoare, intensitate maximă, dimensiune, poziție, profil) reproduce originalul. Opacitatea maximă (1) = intensitatea originalului.
- **Poziția în hero:** originalul e centrat pe secțiune, ceea ce înseamnă pe linia titlului, nu pe centrul blocului de conținut. Am folosit ancora `center`, care la noi cade tot pe titlu (titlul e puțin deasupra centrului secțiunii), plus deriva. Nu am deplasat-o artificial față de original.
- **z-index fără token:** Tailwind v4 nu are namespace de tema pentru `z-index`; haloul folosește `-z-10` în contextul `isolate` al secțiunii, ca `HeroGrid`, iar ordinea față de grilă vine din DOM.
- **Culoarea:** neutră (`paper-dim`), nu ușor rece ca `rgba(160,168,174)` din original: cerința a fost o culoare din paleta existentă; diferența de ton e sub pragul vizibil la 20% alfa.

#### Neclarități
- Fundalul fix (`background-attachment: fixed`) din „Fii Bolders”/testimoniale devine halouri locale în spatele titlurilor, nu un strat fix pe toată secțiunea; de confirmat cu Adi la construirea secțiunii 4.

### Următoarea secțiune: 2. Storytelling (`data-anim="words-light"`) ⏭️
