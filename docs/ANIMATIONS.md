# ANIMATIONS – Bolders

Surse: `reference/webflow/ix2/ix2-site.json` (140 de evenimente IX2, rezumat în `IX2-SUMMARY.md`), codul GSAP inline din `reference/webflow/custom-code/home.custom.txt` (GSAP 3.11 + ScrollTrigger + SplitType), `reference/inspiratie/inspiratie.md` și capturile din `reference/inspiratie/live/`.
Capturile stărilor originale: `reference/screenshots/<pagina>/scroll-1440|375/` și `home/hero-timeline/`.

## Principii

- **Un singur modul central** (`src/scripts/animations/`) citește `data-anim` și pornește animația. Componentele nu importă GSAP direct.
- Reguli de mișcare: `docs/DESIGN.md` §4 (doar `transform`, `opacity`, `clip-path`; scrub și măști înaintea aparițiilor simple; 60 fps pe mobil).
- Un singur moment orchestrat per ecran. Restul secțiunilor primesc animații discrete sau niciuna. Fără fade-up generic pe fiecare secțiune.
- Pluginuri: `gsap`, `ScrollTrigger`, `SplitText` (gratuit din GSAP 3.13), `Flip` doar dacă e nevoie. Lenis pentru smooth scroll, sincronizat cu `ScrollTrigger.update`.
- Durate (secunde): `fast 0.2` · `base 0.5` · `slow 0.9` · `slower 1.4`. Easing implicit `expo.out`; `power4.out` la intrări mari; `none` la scrub.
- Mobil (`< 768px`): fără pinning lung (max. 1 secțiune fixată pe pagină), scrub mai scurt, fără efecte dependente de hover.
- `prefers-reduced-motion: reduce`: Lenis dezactivat (scroll nativ), fără scrub, pin și marquee. Conținutul apare direct în starea finală. Se păstrează doar tranzițiile de stare declanșate de utilizator (acordeon, meniu, pași formular), ca schimbare instant sau crossfade ≤ 150 ms.
- View Transitions (`<ClientRouter />`): la `astro:before-swap` se apelează cleanup-ul, `mm.revert()` și `ctx.revert()` pe toate contextele GSAP ale paginii (ceea ce omoară și ScrollTrigger-ele lor), apoi `lenis.destroy()`. Dacă nu există elemente persistente, se omoară și orice ScrollTrigger rămas (`ScrollTrigger.getAll()`). La `astro:page-load` se reinițializează și se apelează `ScrollTrigger.refresh()`. Elementele persistente (`transition:persist`: header, footer) își păstrează contextul și nu se reanimează. Implementare: `src/scripts/animations/index.ts`.

## Atribute `data-anim`

| Atribut | Ce face | Unde |
|---|---|---|
| `data-anim="hero-syllables"` | pill, titlu, silabe mascate pe rând, subtitlu și buton; o respirație pe axa wght | secțiunea hero |
| `data-anim="line-reveal"` | rânduri SplitText care urcă din mască | titluri H1/H2 mari |
| `data-anim="words-light"` | cuvinte de la opacitate .2 la 1, legat de scroll | storytelling, citat lung |
| `data-anim="title-settle"` | litere împrăștiate care se așază la scroll | titluri între secțiuni, Agenție |
| `data-anim="story"` | fraze care apar pe bucăți (Întâi / Apoi / Azi), secțiune fixată | povestea agenției |
| `data-anim="fan"` | stiva de carduri se răsfiră | departamente (carduri) |
| `data-anim="resource-reveal"` | carduri deschise dintr-o fantă mascată, legat de scroll | Resurse (homepage) |
| `data-anim="service-list"` | rând activ la hover/focus, celelalte se estompează | lista de departamente, **doar pe pagina Departamente** |
| `data-anim="slider"` | slider orizontal de proiecte cu contor | proiecte |
| `data-anim="method"` | secțiune fixată, pașii se schimbă la scroll | procesul în 5 pași |
| `data-anim="accordion"` | deschidere/închidere cu înălțime animată | FAQ |
| `data-anim="form-steps"` | tranziție între pașii formularului + bară progres | contact |
| `data-anim="marquee"` | bandă de mesaje, viteză legată de scroll | CTA final |
| `data-anim="wordmark"` | wordmark-ul „Bolders” se ridică din mască | footer |
| `data-anim="parallax"` | deplasare verticală ușoară (max. 10%) | imaginea din echipă |
| `data-anim="nav"` | header ascuns la scroll în jos, vizibil la scroll în sus; meniu mobil | header global |


Modificatori comuni: `data-anim-delay="0.2"`, `data-anim-start="top 80%"`, `data-anim-scrub="1"`, `data-anim-stagger="0.04"`. Ținte interne: `data-anim-item`, `data-anim-counter`, `data-anim-progress`.

Contract modul: `registry[name](el, { mm, lenis }) => cleanup`. Fiecare inițializare rulează într-un `gsap.context(el)` și într-un `gsap.matchMedia()` cu condițiile `isDesktop`, `isMobile`, `reduceMotion`.

Elementele persistente (header, footer) se montează o singură dată, dar Lenis se recreează la fiecare navigare: ele nu păstrează `lenis` primit la montare, ci citesc instanța curentă cu `getLenis()` (`smooth-scroll.ts`) în momentul acțiunii.

### `line-reveal` (implementare, Etapa 3)
SplitText `type: "lines"`, `mask: "lines"`, `autoSplit: true`, animația returnată din `onSplit`. Rândurile: `yPercent 130 → 0`, 0.9 `expo.out`, stagger 0.08 (mobil 0.06), ScrollTrigger `start top 90%` (modificator `data-anim-start`), `once: true`; titlurile din primul ecran pornesc imediat. Masca are clasa `line-mask` (DESIGN §2, „Clase de componente”), lărgită cu padding + margine negativă ca să nu taie descendentele și diacriticele (g, ș, ț, Î), de aceea pornirea e la 130, nu 110. Reduced motion: textul nu se împarte.

---

## Global

### Smooth scroll
- **Original:** scroll nativ, fără Lenis.
- **Nou:** Lenis (`lerp 0.1`, `wheelMultiplier 1`), `lenis.on('scroll', ScrollTrigger.update)`, `gsap.ticker` ca driver.
- **Mobil:** `syncTouch: false` (touch nativ).
- **Reduced motion:** Lenis nu se instanțiază.

### Header / navigație — `data-anim="nav"`
- **Original:** pill cu blur 11px. Meniu mobil IX2 `NAVBAR_OPEN/CLOSE`: liniile hamburger se rotesc la ±45°, 400 ms `inOutQuint`. Logo hover: simbolul urcă −110% și reapare (500/300 ms).
- **Nou:** același pill. Headerul se ascunde la scroll în jos (`yPercent -100`, 0.5 `expo.out`) și reapare la scroll în sus. Hover pe logo: păstrat (mască, 0.3). Meniu mobil full-screen cu linkuri mari, `line-reveal` cu stagger 0.05.
- **Implementare (Etapa 3):** se animă doar bara (`data-nav-bar`), nu `<header>`: un `transform` pe header ar deveni containing block pentru meniul `position: fixed`. Ascunderea pornește după ce scroll-ul depășește înălțimea barei; orice `focusin` în header o readuce (tastatura nu ajunge într-un header ascuns); după swap bara revine vizibilă. Logo: simbolul iese în sus (0.15 `power2.in`), reintră de jos (0.3 `expo.out`), doar `isDesktop` (hover). Meniu: fundalul intră cu opacitate 0.2, linkurile urcă din mască (`yPercent 110 → 0`, 0.9 `expo.out`, stagger 0.05); masca e un `li` cu `overflow: clip` în markup (un rând per link, fără SplitText). Hamburger → X: CSS pe `aria-expanded`, 400 ms `in-out-quint`. Comportament (indiferent de mișcare): `aria-expanded`/`aria-controls`, restul paginii `inert` + capcană pe Tab, Esc închide și readuce focusul pe buton, închidere instant la `astro:before-preparation` și la trecerea pe desktop (≥ 62rem), `lenis.stop()` (fără Lenis: `overflow-hidden` pe `html`). Meniul mobil e activ sub `lg` (992 px), nu sub `md`: cele 4 linkuri + butonul nu încap în pill la 768.
- **Sursă:** Webflow (identitate).
- **Plugin / trigger:** ScrollTrigger `onUpdate` (direcție); click pe buton.
- **Mobil:** la fel; meniul este principalul moment de mișcare pe mobil.
- **Reduced motion:** header fix vizibil, meniul apare fără translație.

### Cursor personalizat și fundalul „splash”
- **Original:** `.cursor-element` (punct care urmărește mouse-ul, IX2 `MOUSE_MOVE`, smoothing 85; se mărește pe butoane) + `splash-effect-8.js` (fluid WebGL pe canvas fix).
- **Nou:** **eliminate.** WebGL este interzis, iar cursorul custom e pe lista anti-banal. Rămâne cursorul sistemului.

### Butoane
- **Original:** hover IX2: fundal `#1d1d1d`, umbra interioară dispare, cursorul se mărește; varianta „glowing” cu halo alb.
- **Nou:** punctul lime se mărește până umple butonul (clip-path cerc din poziția punctului, 0.4 `expo.out`), textul se inversează la ink. Fără glow. Doar CSS (`transition`), fără `data-anim`.
- **Reduced motion:** schimbare de culoare instant.

### Tranziții între pagini
- **Original:** încărcare clasică.
- **Nou:** View Transitions: crossfade 0.3 pe `main`, header și footer persistente. Titlul paginii noi folosește `line-reveal` după `astro:page-load`.
- **Reduced motion:** `::view-transition-*` cu `animation: none`.
- **Implementare (Etapa 3):** `<html transition:animate="none">`, `<main transition:animate={fade({ duration: "0.3s" })}>`. Header (`transition:persist="header"` + `transition:name="header"`, grup ridicat cu `z-index` ca snapshot-ul lui `main` să nu se picteze peste el) și footer (`transition:persist="footer"`). Fiind persistente, starea `aria-current` a linkurilor se sincronizează pe client la `astro:page-load` (`src/scripts/navigation/current-page.ts`). `astro:page-load` rulează înaintea primului cadru al paginii noi, deci titlul nu apare neascuns.

### Linkuri cu ancoră
- Linkurile spre o ancoră din aceeași pagină (inclusiv skip link-ul) sunt interceptate în faza de capture, înaintea routerului Astro: `lenis.scrollTo(target, { offset: -(înălțimea barei + 16px) })`; fără Lenis, salt instant cu același offset. URL-ul se actualizează cu `history.replaceState` (routerul Astro își ține indexul în `history.state`), iar focusul trece pe țintă. Implementare: `src/scripts/animations/anchor-scroll.ts`.

---

## Homepage

### 1. Hero — `data-anim="hero-syllables"`
- **Original:** IX2 `heading [scroll in - change txt]`. `.heading-move._1…_7` („st · ră · lu · ce · șt · i · !”) intră din `y −100%` cu blur și opacitate, 400 ms `outCirc`, decalaj 100 ms. După 3000 ms ies spre `x 160%` (500 ms) și ciclul se repetă. Fundal: canvas WebGL + grilă de linii. Capturi: `screenshots/home/hero-timeline/`.
- **Nou:** hero centrat (DESIGN §3). Silabele urcă din mască (`overflow: clip` pe linie, `yPercent 110 → 0`), stagger 0.06, 0.9 `expo.out`, după pill (0.3) și „Acum este momentul” (`line-reveal`). Fără blur. După intrare, la 4 s, silabele „respiră” o singură dată: weight 200 → 700 pe axa variabilă, stagger 0.05, apoi revin. Fără buclă infinită. Subtitlul și butonul: opacitate 0 → 1, 0.5, delay 0.9.
- **Fără reflow la respirație:** fiecare silabă e un `inline-grid` cu două straturi în aceeași celulă: o copie invizibilă (`aria-hidden`, `visibility: hidden`) la `wght 700`, care fixează lățimea, și silaba vizibilă centrată peste ea. Se animă doar `font-variation-settings` pe stratul vizibil, în interiorul cutiei deja dimensionate, deci textul din jur nu se mișcă. Lățimea rezervată se verifică la 375 și 1440 (fără salt de rând între 200 și 700).
- **Sursă:** `inspiratie.md` → `01-hero` (hero actual Bolders, „intrarea literelor mai fluidă, cu mască, tipografie mai mare, ritm mai bun pe mobil”). Fișier: `hero.png`.
- **Plugin:** SplitText (`lines` pentru prima linie), GSAP timeline.
- **Trigger:** `astro:page-load` (o singură dată pe sesiune la prima vizită; la navigare înapoi, varianta scurtă de 0.4 s).
- **Mobil:** titlul pe 3–4 rânduri, silabele rămân pe un rând propriu, stagger 0.04.
- **Reduced motion:** text static complet, fără animație de weight.
- **Implementare (Etapa 4):** `data-anim="hero-syllables"` stă pe `<section>`, nu pe titlu, pentru că orchestrează și pill-ul, subtitlul și butonul. Ținte: `data-hero-part="pill|line|word|after"`, `data-hero-syllable` (intrare din mască: „să” + cele 7 silabe), `data-hero-breath` (doar cele 7 silabe). Titlul complet e într-un `sr-only` din `h1`, partea vizuală e `aria-hidden`.
  - Secvența completă: pill `opacity 0 → 1` + `yPercent 40 → 0` (0.5) la 0 s; „Acum este momentul” SplitText `lines` cu mască, `yPercent 130 → 0`, 0.9 `expo.out`, stagger 0.08 (mobil 0.06) la 0.3 s; silabele `yPercent 130 → 0`, 0.9 `expo.out`, stagger 0.06 (mobil 0.04) la 0.55 s; subtitlu și buton `opacity` 0.5 la 1.2 s (0.9 după începutul titlului); respirația la 4 s. Pornirea de la 130 (nu 110) e din același motiv ca la `line-reveal` (masca `.line-mask` lărgită).
  - Respirația: `font-variation-settings 'wght' 700 → 200 → 700` (yoyo, 0.5 per sens, `sine.inOut`, stagger 0.05), o singură dată. Silabele stau la 700 în repaus (contrastul de greutate cerut), deci „200 → 700” se citește ca undă prin axa de greutate care pleacă de la 700 și revine. Lățimea e rezervată de copia invizibilă la 700: verificat la 375 și 1440 (rândul nu se rupe, textul din jur nu se mișcă).
  - O dată pe sesiune: `sessionStorage["bolders:hero-intro"]`. La revenire (reload sau navigare înapoi pe `/`): toate părțile `opacity 0 → 1`, 0.4, fără respirație.
  - **Fără flash și LCP:** modulul ajunge după primul paint pe rețele lente, deci nu poate ascunde singur textul fără flash. Un script inline (`is:inline`, excepție documentată) din `Hero.astro` rulează doar la încărcarea inițială a documentului (`readyState === "loading"`), înaintea primului paint: pune clasa `hero-pending` pe `<html>` (CSS: `[data-hero-part]` la `opacity 0`) și o scoate singur la **1 s de la începutul navigării**. Dacă modulul ajunge înainte, își setează starea inițială sincron (`from()` randează imediat), scoate clasa și rulează intrarea. Dacă bugetul a expirat, textul e deja vizibil: modulul nu-l mai ascunde, rulează doar respirația. La navigarea prin router, `astro:page-load` rulează înaintea primului cadru, deci modulul ascunde și animă direct. Fără JS sau la reduced motion clasa nu se pune.
  - Resize peste pragul `md`: intrarea nu se repetă (flag în factory).

### 2. Storytelling — `data-anim="words-light"`
- **Original:** SplitType `words, chars` + GSAP `[scrub-each-word]`: opacitate .2 → 1 pe cuvinte, `start top 85%`, `end top 55%`, `scrub 2`, `power1.out`. IX2 `About Us text`: culoarea textului .2 → 1 cu delay-uri de 200 ms.
- **Nou:** aceeași idee, dar pe o distanță de scroll mai lungă (`start top 75%`, `end bottom 60%`), `scrub 0.6`, cuvintele trec de la `paper-dim` la `paper`. Fragmentul „Garanția noastră este simplă...” e setat la weight 700, restul la 400.
- **Sursă:** Webflow + captura `sectiune sub hero.png` (fără intrare în `inspiratie.md`, de confirmat).
- **Plugin:** SplitText (`words`), ScrollTrigger scrub.
- **Mobil:** `end bottom 80%`, aceeași logică.
- **Reduced motion:** text complet aprins.

### 3. Departamente (carduri în stivă) — `data-anim="fan"`
- **Original:** carduri suprapuse rotite (−4°, −2°, 6°, 16°). IX2 `Fan Cards Wide/narow` la hover/click le răsfiră. GSAP `.reveal-card`: `y 80, x 30, rotate 5, scale .95 → 0`, 1.4 `power4.out`, delay i·0.1. IX2 `Scrolling through panels` (rotate 3D −40°).
- **Nou:** la intrarea în viewport, stiva se răsfiră o singură dată (rotate din pozițiile originale spre 0 și distanțare pe X), 1.2 `power4.out`, stagger 0.08. Hover/focus pe un card îl ridică (`y −1rem`, 0.3). Fără rotații 3D pe axele X/Y.
- **Sursă:** Webflow.
- **Plugin / trigger:** ScrollTrigger `start top 70%`, `once: true`.
- **Mobil:** cardurile stau într-o coloană (fără stivă), fără animație.
- **Reduced motion:** cardurile apar direct răsfirate.

### 4. Fii Bolders + testimoniale
- **Original:** IX2 `slideInBottom` (`y 100px → 0`, 1000 ms `outQuart`) pe blocuri; avatare cu hover; săgeată curbă.
- **Nou:** titlul cu `line-reveal`. Cele trei avantaje fără animație de intrare (conținut liniștit). Testimoniale ca citate mari care se schimbă la click (săgeți) sau drag, crossfade 0.4. Fără autoplay.
- **Sursă:** Webflow; restraint conform DESIGN.
- **Plugin:** SplitText (`line-reveal`), Observer pentru drag.
- **Mobil:** swipe.
- **Reduced motion:** schimbare instant.

### 5. Resurse — `data-anim="resource-reveal"`
- **Original:** IX2 `Resource Menu Transition` (`x −10% → 100% → 0`, 500 ms `easeInOut`), `Shiny Gradient Hover`, parallax pe imagine (`y 0 → 40%`). Cardurile „Creăm branduri memorabile” și „De la strategie la rezultate”.
- **Nou:** titlul „Aducem digitalizarea mai aproape ca niciodată” cu `line-reveal`. Cele 2 carduri (`data-anim-item`) se deschid dintr-o fantă orizontală, legat de scroll: `clip-path: inset(48% 0 48% 0 round panel) → inset(0 0 0 0 round panel)`, scrub 0.6, de la `top 85%` la `top 35%`. Conținutul cardului face contra-mișcare în interiorul măștii (`yPercent 18 → 0`), astfel încât textul pare că „se așază” pe măsură ce fanta se lărgește. Al doilea card pornește cu un decalaj de scroll (offset 15% din distanță), deci cele două nu se deschid simultan. Fără pin, fără fade simplu, fără rotații (diferit de `fan` și de `service-list`).
- **Sursă:** Webflow (secțiunea Resurse, conținut) + DESIGN §4 „Reguli de mișcare” (scrub și mască). Fără intrare în `inspiratie.md`.
- **Plugin / trigger:** ScrollTrigger `scrub 0.6`, câte un trigger per card.
- **Mobil:** cardurile în coloană, fanta pornește de la `inset(30% 0 30% 0)`, contra-mișcare `yPercent 10 → 0`, scrub 0.4.
- **Reduced motion:** cardurile complet deschise, fără scrub.

### 6. Proiecte — `data-anim="slider"`
- **Original:** grilă de capturi lungi; la hover imaginea derulează `y 0 → −77%` în 50 s; overlay alb .2; `y −1rem`. Fundalul secțiunii își schimbă padding-ul la intrare. Pe mobil: `x 2rem → −2rem` la scroll.
- **Nou:** slider orizontal cu contor `01 / 04` (`data-anim-counter`), fiecare slide cu număr, nume, tip, an. Navigare prin drag, săgeți și tastatură. Slide-ul activ e la scara 1, celelalte la `0.92` și opacitate .5. Tranziție 0.8 `expo.out`. Derularea capturii la hover se păstrează (mai lentă, 12 s, `none`) ca semnătură Bolders.
- **Sursă:** `inspiratie.md` → `02-proiecte` (studiors „Projets en image”, fără WebGL). Fișier: `proiecte.png`. Capturi: `live/studiors-02-proiecte/`.
- **Conținut:** nume, tip, an și descriere sunt placeholder (lorem ipsum), imaginile sunt placeholder neutre generate local (`reference/continut.md`).
- **Plugin / trigger:** GSAP + Observer (drag/wheel orizontal), fără pin.
- **Mobil:** scroll-snap nativ CSS. Contorul se actualizează prin IntersectionObserver, fără GSAP.
- **Reduced motion:** fără scalare, fără derularea capturii; schimbare instant.

### 7. Proces / Metoda — `data-anim="method"`
- **Original:** listă de 5 pași cu iconițe 3D; IX2 `Scroll Progress` pe `.sticky-wrap-2` (bara crește cu scroll-ul, gradient lime → line).
- **Nou:** secțiune fixată (`pin`, durată `+=250%`), un pas pe ecran: număr mare (`01`–`05`), titlu, text, etichete. Pasul curent iese cu `yPercent −30` + opacitate, următorul intră din mască (0.6 `expo.out`, cu snap pe pași). Un rând de 5 indicatori jos; cel activ e lime. Bara de progres e păstrată din original.
- **Sursă:** `inspiratie.md` → `03-metoda` (studiors „La Méthode”). Fișiere: `metoda.png`, `prima metoda.png`, `doua metoda.png`, `treia metoda.png`, `patra metoda.png`. Capturi: `live/studiors-03-metoda/`.
- **Plugin / trigger:** ScrollTrigger `pin`, `scrub 0.5`, `snap: 1/4`.
- **Mobil:** fără pin: pașii în listă verticală, fiecare cu `line-reveal` pe titlu.
- **Reduced motion:** listă verticală statică, toți pașii vizibili.

### 8. Echipa — `data-anim="parallax"`
- **Original:** `slideInBottom`/`fadeIn 0.4` (600 ms `outCubic`), fundal cu linii.
- **Nou:** portretul lui Stefan Pintea cu parallax `yPercent −8 → 8`, scrub. Lista de puncte forte fără animație.
- **Plugin / trigger:** ScrollTrigger scrub.
- **Mobil:** dezactivat.
- **Reduced motion:** dezactivat.

### 9. FAQ — `data-anim="accordion"`
- **Original:** IX2 `Accordion Click Open/Close` (înălțime + rotirea săgeții diagonale).
- **Nou:** `<details>` nativ. Înălțime animată 0.4 `expo.out`, săgeata diagonală se rotește 45°, un singur item deschis odată.
- **Plugin / trigger:** GSAP pe `toggle`.
- **Mobil:** identic.
- **Reduced motion:** deschidere instant (comportament nativ).

### 10. CTA final — `data-anim="marquee"`
- **Original:** IX2 `Partner [Loop]`: `.partner_list x 0 → −100%` în 50 000 ms, buclă liniară; mască fade la margini.
- **Nou:** bandă continuă (cele 12 mesaje), viteză de bază lentă. Viteza și direcția urmăresc scroll-ul (`velocity` din ScrollTrigger, accelerare temporară, revenire în 0.8). Separatoarele dintre mesaje sunt simbolul „b”, nu puncte.
- **Sursă:** `inspiratie.md` → `07-footer` („banda cu mișcare mai fluidă, legată de scroll”). Captură: `footer.png` (prezentă în folder, nelistată în `inspiratie.md`).
- **Plugin / trigger:** GSAP `ticker` + ScrollTrigger `onUpdate`.
- **Mobil:** viteză de bază, fără legătura cu scroll-ul.
- **Reduced motion:** banda statică, mesajele pe 2–3 rânduri, fără mișcare.

### 11. Footer — `data-anim="wordmark"`
- **Original:** wordmark „Bolders” contur + plin cu gradient; IX2 `Footer Gradient Animation` (gradientul urmărește mouse-ul); bară cu blur peste wordmark.
- **Nou:** wordmark-ul urcă din mască legat de scroll (`yPercent 60 → 0`, scrub, `end bottom bottom`). Fără gradient pe mouse. Meniul rămâne static.
- **Implementare (Etapa 3):** `start top bottom`, `end bottom bottom`, `scrub: true`; pe mobil `yPercent 40 → 0`. Footerul e persistent: trigger-ul se recalculează la `ScrollTrigger.refresh()` după fiecare navigare.
- **Sursă:** `inspiratie.md` → `07-footer` (footer-ul actual Bolders: „spațiere și ierarhie mai clară”). Captură: `footer.png`.
- **Plugin / trigger:** ScrollTrigger scrub.
- **Mobil:** identic, distanță mai mică.
- **Reduced motion:** wordmark static.

### Titluri între secțiuni — `data-anim="title-settle"`
- **Original:** nu există.
- **Nou:** pentru 1–2 titluri de trecere pe pagină (ex. „Proiectele noastre de succes”, „Întrebări frecvente”), literele pornesc cu `y` și `rotate` aleatoare deterministe (seed per literă, max. ±40px, ±12°) și se așază pe linie pe măsură ce secțiunea intră în ecran (scrub 0.8).
- **Sursă:** capturile `text-intre sectiuni.png`, `text intre sectiuni 2.png`, `text intre sectiuni 3 .png` (guillaumezhu.com, manifest + „My journey”; capturi: `live/guillaumezhu-06-poveste-titlu/`). Nu au intrare proprie în `inspiratie.md`, deci trebuie confirmate de client.
- **Plugin:** SplitText (`chars`), ScrollTrigger scrub.
- **Mobil:** amplitudine la jumătate.
- **Reduced motion:** titlu static.

---

## Departamente

- **Original:** aceleași secțiuni ca homepage + secțiunea de servicii detaliate cu `slideInLeft/Right/Bottom` (100px, 1000 ms `outQuart`), cerc Lottie „Rotund” rotit la scroll (`Lottie Circle`), parallax pe imagini (`[Home] Portfolio Parallax`), `growBigIn` pe cerc.
- **Nou:** pagina are listă cu cele trei departamente — `data-anim="service-list"` (singurul loc unde se folosește): listă mare (Marketing Digital, Web-design, Branding), fiecare cu descriere scurtă și link spre secțiunea proprie. La hover/focus, rândul activ rămâne `paper`, celelalte trec la `paper-dim` (0.3, prin `opacity`). Descrierea se deschide sub titlu (înălțime 0 → auto, 0.4 `expo.out`, declanșată de utilizator, nu de scroll), iar titlul se deplasează `x 1.5rem`. Sursă: `inspiratie.md` → `04-servicii` (studiors „Prestations”, fără serviciul de WebGL). Fișier: `servicii.png`. Capturi: `live/studiors-04-servicii/`. Mobil: toate descrierile vizibile, fără hover. Reduced motion: fără deplasare, doar schimbare de culoare. Apoi câte o secțiune per departament: titlu cu `line-reveal` și sub-servicii (Website / Landing page / Webshop / Suport web) ca listă numerotată (secvență reală de produse). Cercul Lottie se înlocuiește cu un cerc de text SVG rotit lent la scroll (scrub, `rotate 0 → 180`).
- **Mobil:** fără rotație legată de scroll.
- **Reduced motion:** totul static.

## Agenție (pagină nouă)

### Povestea agenției — `data-anim="story"`
- **Original:** nu există.
- **Nou:** secțiune fixată (`pin`, `+=300%`). Frazele apar pe bucăți: „Întâi…”, „Apoi…”, „Azi…”. Fiecare fragment are cuvântul-ancoră mare și restul frazei care se așază literă cu literă (`title-settle` intern), apoi fragmentul se estompează la `paper-dim` când apare următorul.
- **Sursă:** `inspiratie.md` → `06-poveste` (guillaumezhu „My journey”). Ce NU preiau: logo-ul 3D, toolkit-ul cu iconițe, playground-ul, tot ce e Three.js. Fișier: `07-poveste.mov` (listat în `inspiratie.md`, lipsește din repo). Capturi: `live/guillaumezhu-06-poveste/`.
- **Plugin / trigger:** SplitText (`words, chars`), ScrollTrigger `pin` + `scrub 0.8`.
- **Mobil:** fără pin. Fiecare fragment e un bloc separat cu `title-settle` scurt.
- **Reduced motion:** cele trei paragrafe statice.
- **Conținut:** textele „Întâi / Apoi / Azi” nu există încă (`reference/continut.md`, „Lipsesc”).

## Contact (pagină + secțiune) — `data-anim="form-steps"`

- **Original:** formular simplu în footer (nume, e-mail, mesaj, bifă), fără animații.
- **Nou:** formular în 3 pași (1. cine ești, 2. ce vrei + buget, 3. mesaj), indicator `01 / 03`, bară de progres lime (`data-anim-progress`, `scaleX`, 0.5 `expo.out`). Pașii trec cu `xPercent 8` + opacitate, 0.4. Focusul se mută pe primul câmp al pasului. Lângă formular: timpul de răspuns și „un loc liber în acest trimestru”.
- **Sursă:** `inspiratie.md` → `05-contact` (doar logica, nimic de design). Fișier: `contact.png`. Capturi: `live/studiors-05-contact/`.
- **Plugin / trigger:** GSAP timeline la click „Continuă”/„Înapoi”.
- **Mobil:** identic.
- **Reduced motion:** schimbare instant de pas, bara fără tranziție.

## Ce NU se preia din original

`splash-effect-8.js` (WebGL), cursorul custom, glow-ul butoanelor, `Scrolling through panels` (rotații 3D), animațiile Instagram din template, bucla infinită a silabelor din hero, Lottie (înlocuit cu SVG), jQuery, SplitType (înlocuit cu SplitText), finsweet attributes.
