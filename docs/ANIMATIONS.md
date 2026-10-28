# ANIMATIONS – Bolders

Surse: `reference/webflow/ix2/ix2-site.json` (140 de evenimente IX2, rezumat în `IX2-SUMMARY.md`), codul GSAP inline din `reference/webflow/custom-code/home.custom.txt` (GSAP 3.11 + ScrollTrigger + SplitType), `reference/inspiratie/inspiratie.md` și capturile live (locale, în afara git: `.screenshots/etapa-1/inspiratie-live/`; trimiterile `live/…` de mai jos se referă la acest folder).
Capturile stărilor originale: `reference/screenshots/<pagina>/scroll-1440|375/` și `home/hero-timeline/`.

## Principii

- **Un singur modul central** (`src/scripts/animations/`) citește `data-anim` și pornește animația. Componentele nu importă GSAP direct.
- Reguli de mișcare: `docs/DESIGN.md` §4 (doar `transform`, `opacity`, `clip-path`; scrub și măști înaintea aparițiilor simple; 60 fps pe mobil). Excepții strict limitate: `filter: blur()` doar în `smoke-text.ts`, canvas/WebGL doar în `fluid.ts` (vezi „Efecte reactivate”).
- Nimic din original nu se elimină fără confirmarea lui Adi (DESIGN §6).
- Un singur moment orchestrat per ecran. Restul secțiunilor primesc animații discrete sau niciuna. Fără fade-up generic pe fiecare secțiune.
- Pluginuri: `gsap`, `ScrollTrigger`, `SplitText` (gratuit din GSAP 3.13), `Flip` doar dacă e nevoie. Lenis pentru smooth scroll, sincronizat cu `ScrollTrigger.update`.
- Durate (secunde): `fast 0.2` · `base 0.5` · `slow 0.9` · `slower 1.4`. Easing implicit `expo.out`; `power4.out` la intrări mari; `none` la scrub.
- Mobil (`< 768px`): fără pinning lung (max. 1 secțiune fixată pe pagină), scrub mai scurt, fără efecte dependente de hover.
- `prefers-reduced-motion: reduce`: Lenis dezactivat (scroll nativ), fără scrub, pin și marquee. Conținutul apare direct în starea finală. Se păstrează doar tranzițiile de stare declanșate de utilizator (acordeon, meniu, pași formular), ca schimbare instant sau crossfade ≤ 150 ms.
- View Transitions (`<ClientRouter />`): la `astro:before-swap` se apelează cleanup-ul, `mm.revert()` și `ctx.revert()` pe toate contextele GSAP ale paginii (ceea ce omoară și ScrollTrigger-ele lor), apoi `lenis.destroy()`. Dacă nu există elemente persistente, se omoară și orice ScrollTrigger rămas (`ScrollTrigger.getAll()`). La `astro:page-load` se reinițializează și se apelează `ScrollTrigger.refresh()`. Elementele persistente (`transition:persist`: header, footer) își păstrează contextul și nu se reanimează. Implementare: `src/scripts/animations/index.ts`.

## Atribute `data-anim`

| Atribut | Ce face | Unde |
|---|---|---|
| `data-anim="hero-syllables"` | pill, titlu, silabe mascate pe rând, subtitlu și buton; la final emite `hero:ready` pentru `smoke-text` | secțiunea hero |
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
| `data-anim="smoke-text"` | literele se dizolvă în fum stânga → dreapta și se rescriu, în loop | „strălucești!” (hero; „să” rămâne fix) |
| `data-anim="cursor"` | cursor custom care urmărește mouse-ul | global (`ui/Cursor.astro`), doar mouse + hover, fără reduced motion |
| `data-anim="fluid"` | fum WebGL la cursor/atingere | global (canvas fix) |
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
- **Nou:** **reactivate** (confirmat de Adi, 28.10): `data-anim="cursor"` și `data-anim="fluid"`, vezi „Efecte reactivate”.

### Butoane
- **Original:** hover IX2: fundal `#1d1d1d`, umbra interioară dispare, cursorul se mărește; varianta „glowing”: dungă de lumină rotativă pe border (2.5 s, loop) + gradient alb la bază, aprins la hover.
- **Nou:** umplerea lime crește din poziția punctului până acoperă butonul (clip-path cerc, 0.4 `expo.out`), textul se inversează la ink; punctul rămâne lime pe fundal lime, deci dispare. La apăsare (`:active`) punctul devine ink. Doar CSS (`transition`). Glow-ul e **static** (`shadow-glow`, umbra pill-ului din hero, fără `data-anim`), vezi DESIGN.md §8; dunga rotativă de pe border e eliminată.
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
- **Nou:** hero centrat (DESIGN §3). Silabele urcă din mască (`clip-path` pe cuvânt cât durează intrarea, `yPercent 130 → 0`), stagger 0.06, 0.9 `expo.out`, după pill (0.3) și „Acum este momentul” (`line-reveal`). Fără blur la intrare. După intrare, „strălucești!” trece la `data-anim="smoke-text"` (fum în loop, vezi „Efecte reactivate”), care **a înlocuit respirația** 700 → 200 → 700 (confirmat de Adi, 28.10; implementat la pasul 4). Subtitlul și butonul: opacitate 0 → 1, 0.5, delay 0.9.
- **Sursă:** `inspiratie.md` → `01-hero` (hero actual Bolders, „intrarea literelor mai fluidă, cu mască, tipografie mai mare, ritm mai bun pe mobil”). Fișier: `hero.png`.
- **Plugin:** SplitText (`lines` pentru prima linie), GSAP timeline.
- **Trigger:** `astro:page-load` (o singură dată pe sesiune la prima vizită; la navigare înapoi, varianta scurtă de 0.4 s).
- **Mobil:** titlul pe 3–4 rânduri, silabele rămân pe un rând propriu, stagger 0.04.
- **Reduced motion:** text static complet, fără fum.
- **Implementare (Etapa 4):** `data-anim="hero-syllables"` stă pe `<section>`, nu pe titlu, pentru că orchestrează și pill-ul, subtitlul și butonul. Ținte: `data-hero-part="pill|line|word|after"`, `data-hero-syllable` (intrare din mască: „să” + cele 7 silabe). Numele accesibil e `aria-label` pe `h1` (pasul 4; înainte era un `sr-only`), partea vizuală e `aria-hidden`, textul rămâne în HTML.
  - Secvența completă: pill `opacity 0 → 1` + `yPercent 40 → 0` (0.5) la 0 s; „Acum este momentul” SplitText `lines` cu mască, `yPercent 130 → 0`, 0.9 `expo.out`, stagger 0.08 (mobil 0.06) la 0.3 s; silabele `yPercent 130 → 0`, 0.9 `expo.out`, stagger 0.06 (mobil 0.04) la 0.55 s; subtitlu și buton `opacity` 0.5 la 1.2 s (0.9 după începutul titlului). La finalul silabelor, masca (`clip-path: inset(0)` pe cele două cuvinte, pusă din JS) se scoate și secțiunea primește `data-hero-ready` + evenimentul `hero:ready`, după care pornește `smoke-text`. Pornirea de la 130 (nu 110) e din același motiv ca la `line-reveal` (masca `.line-mask` lărgită).
  - O dată pe sesiune: `sessionStorage["bolders:hero-intro"]`. La revenire (reload sau navigare înapoi pe `/`): toate părțile `opacity 0 → 1`, 0.4, apoi `hero:ready`.
  - **Fără flash și LCP:** modulul ajunge după primul paint pe rețele lente, deci nu poate ascunde singur textul fără flash. Un script inline (`is:inline`, excepție documentată) din `Hero.astro` rulează doar la încărcarea inițială a documentului (`readyState === "loading"`), înaintea primului paint: pune clasa `hero-pending` pe `<html>` (CSS: `[data-hero-part]` la `opacity 0`) și o scoate singur la **1 s de la începutul navigării**. Dacă modulul ajunge înainte, își setează starea inițială sincron (`from()` randează imediat), scoate clasa și rulează intrarea. Dacă bugetul a expirat, textul e deja vizibil: modulul nu-l mai ascunde și emite direct `hero:ready` (rulează doar fumul). La navigarea prin router, `astro:page-load` rulează înaintea primului cadru, deci modulul ascunde și animă direct. Fără JS sau la reduced motion clasa nu se pune.
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
- **Nou:** wordmark-ul urcă din mască legat de scroll (`yPercent 60 → 0`, scrub, `end bottom bottom`). Gradient orizontal static (fără urmărirea mouse-ului), literele din dreapta în contur; panoul cu blur peste jumătatea de jos rămâne static (DESIGN §2). Meniul rămâne static.
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

## Efecte reactivate (confirmat de Adi, 28.10)

Ordinea implementării: 1 fundația (documentație, reguli, audit, `capabilities.ts`) · 2 halouri (static, fără `data-anim`, vezi DESIGN.md §7) · 3 glow pe butoane (static, fără `data-anim`, vezi DESIGN.md §8) · 4 `smoke-text` · 5 `cursor` · 6 `fluid`. Iconițele 3D: amânate până la fișierele originale.

Toate pornesc din modulul central și verifică `capabilities.ts` (`prefersReducedMotion()`, `hasFinePointer()`, `hasHover()`, `supportsWebGL()`, `isLowEndDevice()`). Fără JS sau la reduced motion, pagina arată ca acum (efectele lipsesc, conținutul rămâne vizibil).

### `smoke-text` — fum pe „strălucești!” ✅ (pasul 4)
- **Ce face:** după intrarea hero-ului, literele din „strălucești!” se dizolvă în fum de la stânga la dreapta, apoi revin din ceață în aceeași ordine; pauză cu textul complet, apoi loop. **Doar pe acest cuvânt**; „să” rămâne fix. A înlocuit respirația 700 → 200 → 700.
- **Măsurat pe original** (Playwright pe bolders1.webflow.io, 1440, stiluri calculate la 50 ms, verificat cu IX2 `a-67` „heading [ scroll in - change txt ]”, evenimentele `e-172`/`e-301`, `loop: true`):
  - unitatea animată: cele **7 silabe** `.heading-move._1…_7` (st · ră · lu · ce · șt · i · !), 80 px / line-height 110% / 500;
  - **dispariție:** opacitate 1 → 0, `blur` 0 → **8 px** (0.1em), `x` 0 → **+160 %** din lățimea silabei (st: +120.6 px ≈ 1.5em; !: +40 px), `y` 0, **fără scale**; **500 ms `outCirc`**, decalaj **100 ms** pe silabă;
  - **reapariție:** salt instant la `y −100 %` (−88 px = un rând), `x 0`, `blur 6 px` (0.075em), opacitate 0; apoi `y → 0`, `blur → 0`, opacitate → 1; **400 ms `outCirc`**, decalaj **100 ms**;
  - **pauză** cu textul complet: **3000 ms** (de la ultima silabă așezată la prima care pleacă); ciclul complet ≈ **5.1 s** (1.1 s dispariție + 1.0 s reapariție + 3.0 s pauză), măsurat 4.86 s → 9.96 s între două plecări ale primei silabe;
  - comportamentul descris de Adi se potrivește în ordine și direcție; „se mărește ușor” și „plutește în sus” nu există în original (scale 1, y 0 la dispariție): impresia vine din blur. Am reprodus valorile măsurate, nu descrierea.
- **Implementare (`src/scripts/animations/smoke-text.ts`):** SplitText `chars` (`aria: "hidden"`) pe cuvânt, la `hero:ready`; timeline GSAP `repeat: -1`, întâi pauza de 3 s (intrarea hero-ului ține locul primei reapariții):
  - dispariție: `opacity 0`, `x 1.5em`, `filter: blur(0.1em)`, 0.5 `circ.out`, stagger **0.05** pe literă (100 ms pe silabă ≈ 50 ms pe literă; trecerea completă 0.55 s față de 0.6 s);
  - reset: `x 0`, `yPercent −100`, `blur(0.075em)`;
  - reapariție: `opacity 1`, `yPercent 0`, `blur(0em)`, 0.4 `circ.out`, stagger 0.05; apoi `filter: none`;
  - pauză 3 s.
  - Blur și deplasare în `em`: la 1440 sunt exact valorile originalului (8 px / 120 px); pe mobil scad odată cu titlul (28 px → blur 2.8 px, derivă 42 px).
- **Fără layout shift:** literele sunt `inline-block` (SplitText), cuvântul are `font-kerning: none` (`.no-kerning`) de la primul paint, deci lățimea nu se schimbă la split (măsurat: 451.91 → 451.94 px la 1440, rotunjire subpixel). Doar `opacity`, `transform`, `filter`.
- **Fără tăiere:** masca intrării e `clip-path` pus din JS doar cât rulează intrarea (nu `overflow-clip` în markup), deci literele pot urca un rând și pot ieși spre dreapta. Haloul e un strat `absolute -z-10`, nu container; secțiunea are `overflow-clip` doar la marginile ei (fără scroll orizontal la 375).
- **Performanță:** `will-change: transform, opacity, filter` doar pe durata trecerii (setat la început, `auto` după reapariție și la pauză). Bucla e pe pauză când cuvântul iese din ecran (`IntersectionObserver`) sau tab-ul e ascuns (`visibilitychange`). Pornește după intrare, deci nu atinge LCP.
- **Accesibilitate:** `aria-label` pe `h1` (titlul complet), partea vizuală și literele generate `aria-hidden`; textul rămâne în HTML.
- **View Transitions:** split-ul și timeline-ul sunt create în contextul `matchMedia`, deci `astro:before-swap` le revertează (SplitText revine la HTML-ul inițial); `astro:page-load` le recreează.
- **Mobil:** identic (valorile în em scad cu titlul).
- **Reduced motion:** nu se montează: fără split, text static complet.

### Glow pe butoane ✅ (pasul 3): static, fără `data-anim`
Decizie Adi (28.10): halou **static** uniform pe contur (umbra pill-ului din hero-ul original, `shadow-glow`), mereu vizibil, pe toate butoanele și la toate rezoluțiile. **Nu e animație**: nu există `data-anim="glow"` și nici `glow.ts` (`audit:rules`, regula `glow-static`). Dunga de lumină care se rotește pe border în original e eliminată definitiv. Valori și implementare: DESIGN.md §8.

### `cursor` — cursor custom ✅ (pasul 5)
- **Ce face:** punct alb (1rem) care urmărește mouse-ul cu o întârziere mică, inversat față de fundal (`mix-blend-difference`, ca în original). Pe butoane (`Button`) se estompează într-o lumină mică și slabă; pe linkuri (`TextLink`) într-o lumină de 6rem. Fără stare la click (nici originalul nu are). Valorile măsurate pe original și abaterile: DESIGN.md §9.
- **Element:** `src/components/ui/Cursor.astro`, o singură dată în `BaseLayout`, `data-anim="cursor"`, `transition:persist="cursor"`, `aria-hidden`, `pointer-events-none`, `z-cursor`. Ascuns în markup (`opacity-0`): e decor, nu conținut, deci fără JS nu apare.
- **Modul:** `src/scripts/animations/cursor.ts`, în registry.
  - Activ doar dacă `hasFinePointer()`, `hasHover()` și `!prefersReducedMotion()` (`capabilities.ts`). Condițiile stau în `gsap.matchMedia` (`POINTER_CONDITIONS` din `conditions.ts`: `(pointer: fine)`, `(hover: hover)`, reduced motion), deci modulul se montează/demontează la schimbare (mouse conectat la o tabletă, reduced motion activat în timpul sesiunii).
  - **Progressive enhancement:** clasa `has-custom-cursor` pe `<html>` (`cursor: none`, `global.css`) se pune **la prima mișcare a mouse-ului**, când punctul poate înlocui cursorul sistemului. Fără JS, pe touch sau la reduced motion clasa nu există.
  - **Urmărire:** `gsap.quickTo` pe `x`/`y` ale wrapper-ului, **150 ms `power2.out`** (`--cursor-follow-duration`): ajunge exact la poziția mouse-ului la 150 ms după ultima mișcare. Doar `transform`; ascultători `pointermove` pasivi pe `document`.
  - **Apariție:** la prima mișcare punctul sare direct sub mouse (`quickTo(value, start)`), apoi apare (opacitate, 200 ms); niciodată din colțul 0,0. La ieșirea din fereastră (`pointerout` cu `relatedTarget` null) dispare; la revenire sare din nou sub mouse.
  - **Stări prin delegare:** un singur `pointerover` pe `document` citește `closest("[data-cursor]")`: `data-cursor="button"` e pus de `Button`, `data-cursor="link"` de `TextLink`. Tranziții 200 ms `power1.out` (`--cursor-state-duration`, „ease” din IX2), doar `opacity` și `scale` pe punct și pe lumină.
    - implicit: punct opacitate 1; lumina opacitate 0, `scale .3`;
    - `button`: punct 0; lumina opacitate **.27**, `scale .3` (`--cursor-button-*`);
    - `link`: punct 0; lumina opacitate 1, `scale 1` (6rem estompat).
  - **Cursorul sistemului revine** (punctul se ascunde): pe `input`, `textarea`, `select`, `[contenteditable]` (CSS: `cursor: auto` sub `.has-custom-cursor`), peste `iframe` și cât timp se selectează text cu mouse-ul apăsat (`selectionchange` cu selecție neconsumată → clasa `is-selecting-text` pe `<html>`, scoasă la `pointerup`).
  - **Touch pe dispozitive hibride:** evenimentele `pointerType: "touch"` sunt ignorate; o atingere ascunde punctul.
- **View Transitions:** elementul persistă (același nod DOM), instanța e persistentă în `index.ts`, deci nu se remontează și nu adaugă ascultători la navigare; poziția continuă fără salt. `ClientRouter` înlocuiește atributele de pe `<html>`, deci la `astro:after-swap` modulul repune `has-custom-cursor` (și `is-selecting-text`) și resetează starea de hover.
- **Cleanup:** scoate ascultătorii și clasele, oprește tween-urile și curăță stilurile inline (`clearProps`): tween-urile create în handler-e nu sunt în context, deci `revert()` singur nu le-ar anula.
- **Performanță (trace la 1440, 3 s de mișcare continuă):** 0 `Layout`, 0 long tasks (max 3.6 ms), aceleași paint-uri ca fără cursor. `transform`-ul scris din JS produce câte un recalcul de stil pe **un singur element** per cadru (≈ 0.04 ms; ≈ 11 ms în 3 s).
- **Mobil:** nu există (touch: `pointer: coarse`, fără hover).
- **Reduced motion:** nu se montează; rămâne cursorul sistemului.

### `fluid` — fum WebGL la cursor/atingere
- **Ce face:** canvas WebGL fix pe toată pagina (`pointer-events: none`), în spatele/peste conținut fără să blocheze interacțiunea; mișcarea cursorului sau atingerea lasă fum. Bazat pe **WebGL-Fluid-Simulation** de Pavel Dobryakov (licență MIT; notița de licență se păstrează în `fluid.ts`, verificată de `audit:rules`).
- **Limite (obligatorii):**
  - încărcare **după LCP**, cu `requestIdleCallback` (fallback `setTimeout`), prin `import()` dinamic, ca să nu intre în bundle-ul inițial;
  - rezoluție redusă pe mobil (simulare și dye la rezoluție mică, DPR limitat);
  - randarea se oprește când nu există mișcare (simularea s-a stins) și când tab-ul e ascuns (`visibilitychange`); repornește la următoarea mișcare;
  - ascultători touch/pointer **pasivi** (`{ passive: true }`): scroll-ul nu se blochează;
  - nu pornește la `prefers-reduced-motion`, fără WebGL (`supportsWebGL()`) sau pe dispozitiv slab (`isLowEndDevice()`: `deviceMemory ≤ 2` sau `hardwareConcurrency ≤ 2`, doar când valoarea e definită; valoare nedefinită = nu e slab). Pragul de nuclee e 2, nu 4: Safari limitează `hardwareConcurrency` la 4 sau 8 (anti-fingerprinting), deci ≤ 4 ar exclude iPhone-urile.
- **Proprietăți:** canvas-ul în sine nu se animă prin CSS; doar conținutul randat de WebGL.
- **Mobil:** activ (atingere), cu limitele de mai sus.
- **Reduced motion:** nu se montează.

## Ce NU se preia din original

`Scrolling through panels` (rotații 3D), dunga de lumină rotativă de pe border-ul butoanelor „glowing”, animațiile Instagram din template, Lottie (înlocuit cu SVG), jQuery, SplitType (înlocuit cu SplitText), finsweet attributes. Fumul, cursorul, glow-ul (static) și bucla de pe „să strălucești!” au fost reactivate (vezi „Efecte reactivate”).
