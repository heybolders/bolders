# DESIGN – Bolders

Sursa tokenilor: `reference/webflow/css/bolders1.webflow.shared.css` (`:root`, linia ~2077), stilurile calculate în Playwright la 375/768/1440 și embed-ul `global-styles` din `reference/webflow/custom-code/home.custom.txt`.
Referințe vizuale: `reference/screenshots/`, `reference/inspiratie/` (+ `live/`).

## 1. Tokeni extrași din Webflow

### Culori (`:root`)

| Variabilă Webflow | Valoare | Utilizare observată |
|---|---|---|
| `--black` | `#0d0d0d` | fundal pagină (`body`) |
| `--grey` | `#141414` | suprafețe ridicate (rar) |
| `--gray-bg` | `#252525` | fundal câmpuri, carduri |
| — | `#1d1d1d` (rgb 29,29,29) | nav pill `rgba(29,29,29,.5)`, hover buton, carduri testimoniale `/.38` |
| `--border` | `#312e2e` | borduri, fundal butoane și tag-uri (21 de utilizări) |
| `--gradient-grey` | `#d0d0d0` | bordura butoanelor, gradient text |
| `--white` | `#ffffff` | text principal |
| `--white-transparent` | `#ffffffc9` | text secundar |
| — | `rgba(255,255,255,.7)` | paragrafe (`text-color-secondary`) |
| `--accent` | `#aaf22d` | accent lime: link activ în meniu, punctul din butoane, eticheta CTA, separatorul „/” din meniul footerului |
| `--light-green` | `#9eeb21` | variantă accent (hover) |
| `--transparent-green` | `#49691099` | umbră verde pe carduri |
| `--shadow` | `#ddd6d633` | umbra pill-ului din hero |

Gradienturi folosite: `linear-gradient(180deg, accent 24%, border 83%)` (bară proces), fade orizontal `black → transparent 25% … 75% → black` (marquee), `#0d0d0dbf` (overlay).

### Fonturi

- **Manrope Variable** (`Manrope-VariableFont_wght.ttf`, axa `wght` 200–800), font unic pentru tot site-ul. Fișier: `reference/webflow/fonts/`.
- Poppins 400/500 se încarcă prin WebFont.js, dar apare într-o singură regulă (de template). **Nu se preia.**
- Greutăți folosite: 400 (text), 500 (titluri, butoane), 600 (meniu footer), 700 (wordmark, titlu formular).

### Scară tipografică (valori la 1440 px, unde 1rem = 16px)

| Rol | Element | Mărime / line-height | Greutate |
|---|---|---|---|
| Display hero | `.heading-3`, `.heading-move` | 5rem (80px) / 110% | 500 |
| Text storytelling | `.about-content [text-split]` | 60px / 75px, ls −0.32px | 400 |
| H2 secțiune | `h2` | 4rem (64px) / 110% | 500 |
| Bandă CTA | `.section_cta a` | 4rem / 150% | 500 |
| Meniu footer | `.footer-menu-link` | 2rem / 150% | 600 |
| H3 | `h3` | 1.5rem (24px) / 130% | 500 |
| Text mare | `.text-size-medium` | 1.13rem (18px) / 150% | 400 |
| Body | `body` | 1rem / 1.5 | 400 |
| Tag / mic | `.tag` | .88rem (14px) / 150% | 400 |

Scalare fluidă: `html { font-size: calc(.8127rem + .2081vw) }` sub 1440 px, `calc(.7495rem + .8368vw)` sub 479 px (≈ 15px la 375, 14.6px la 768, 16px la 1440). Pe mobil, H2 ajunge la ≈ 30px. Hero-ul scade sub 28px, de unde ritmul slab pe mobil semnalat în inspirație.

### Spațiere și layout

| Token | Valoare |
|---|---|
| `padding-global` (gutter lateral) | 2.5rem (40px) desktop → ≈ 36px tabletă → ≈ 19px mobil |
| `padding-section-large` | 8rem (128px) desktop → ≈ 88px tabletă → ≈ 60px mobil |
| `container-large` | 81rem (1296px) |
| lățimi de text | 64rem, 50rem, 45rem, 20rem |
| `padding` buton | .5rem 2rem |
| `padding` tag | 1rem 2rem |

### Raze

`5rem` / `62.5rem` (pill: butoane, meniu, tag), `2rem` (carduri mari, testimoniale), `1.25rem`, `1rem`, `.7rem`, `.5rem` (imagini portofoliu), `50%` (avatare, punct).

### Umbre și efecte

- Tag hero (pill „Construim viitorul tău digital!”): `2px 2px 14px 6px #ddd6d633` = **glow-ul butoanelor și al pill-ului**, vezi §8
- Card verde: `4px 2px 6px 0 #49691099`
- Buton meniu (hover, ascuns în original): `0 0 60px #ffffff4d, 0 0 20px #ffffff80, 0 0 5px #ffffff80`. Nu se preia.
- Buton „glowing” (`.glowing-wrapper-button`): dungă de lumină care se rotește pe border + gradient radial alb la bază. **Eliminate** (decizie Adi, 28.10); glow-ul nou e umbra pill-ului din hero, vezi §8.
- Blur: nav `backdrop-filter: blur(11px)`, overlay-uri `blur(10px)` și `blur(30px)`

### Breakpoint-uri Webflow (desktop-first)

`≤ 991px` tabletă · `≤ 767px` mobil landscape · `≤ 479px` mobil. Pragul fluid de sus: 1440 / 1920.

### Durate și easing

- Tranziții CSS: `.2s` (opacitate, culoare, filtru), `.3s` și `.4s` (transform, padding), `.5s` (height), `1s`
- IX2: 200 / 300 / 400 / 500 / 600 / 800 / 1000 ms. Bucle marquee: 50 000 ms
- GSAP custom: 0.5s `back.out(2)`, 1.4s `power4.out`, scrub 2
- Easing: `inOutQuint` (meniu), `outCirc` (titlu hero), `outQuart` (slide-in), `outCubic` (fade), `ease`

## 2. Maparea la `@theme` (Tailwind v4)

Mobile-first, cu prefixul `--color-` etc., ca să genereze utilitarele standard. Numele descriu rolul, nu valoarea.

```css
@theme {
  /* reset: doar tokenii noștri */
  --color-*: initial;

  --color-ink: #0d0d0d;          /* --black */
  --color-ink-raised: #141414;   /* --grey */
  --color-ink-soft: #1d1d1d;     /* nav, carduri */
  --color-surface: #252525;      /* --gray-bg */
  --color-line: #312e2e;         /* --border */
  --color-mist: #d0d0d0;         /* --gradient-grey */
  --color-paper: #ffffff;        /* --white */
  --color-paper-muted: #ffffffb3;/* text secundar (≈ .7) */
  --color-paper-dim: #ffffff33;  /* text „stins” înainte de reveal (.2, ca în IX2) */
  --color-lime: #aaf22d;         /* --accent */
  --color-lime-deep: #9eeb21;    /* --light-green */
  --color-lime-shade: #49691099; /* --transparent-green */
  --color-transparent: transparent;
  --color-current: currentColor;
  --color-halo: var(--color-paper-dim); /* vârful luminii originale (centerbackground.png), ≈ 20% alb */
  --color-glow: #ddd6d6;              /* nuanța glow-ului (§8): umbra pill-ului din hero-ul original */
  --color-cursor: var(--color-paper);  /* punctul cursorului (§9), alb ca în original */

  /* --font-sans: în `@theme inline { --font-sans: var(--font-manrope); }` – Fonts API din Astro
     generează un nume de familie cu hash și un fallback cu metrici ajustate, deci nu se scrie "Manrope" literal */

  /* scară fluidă: clamp(mobil, preferat, 1440+) – înlocuiește scalarea html.
     Nume proprii (nu xs/sm/lg…), ca să nu se confunde cu scara standard Tailwind. */
  --text-*: initial;
  --text-tag: 0.875rem;          --text-tag--line-height: 1.5;
  --text-body: 1rem;             --text-body--line-height: 1.5;
  --text-lead: 1.125rem;         --text-lead--line-height: 1.5;
  --text-h3: 1.5rem;             --text-h3--line-height: 1.3;
  --text-h2-sm: clamp(1.5rem, 1.2rem + 1vw, 2rem);  --text-h2-sm--line-height: 1.3;
  --text-h2: clamp(2rem, 1.4rem + 2.4vw, 4rem);     --text-h2--line-height: 1.1;
  --text-story: clamp(1.75rem, 1rem + 3.2vw, 3.75rem); --text-story--line-height: 1.25;
  --text-display: clamp(1.75rem, min(8.4vw - 0.375rem, 3.125rem + 2.083vw), 6.5rem); --text-display--line-height: 1.1;

  --font-weight-light: 200;
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;

  --tracking-tight: -0.02em;
  --tracking-display: -0.04em;

  --spacing: 0.25rem;
  --spacing-gutter: clamp(1.25rem, 0.8rem + 2vw, 2.5rem); /* padding-global */
  --spacing-section: clamp(4rem, 2.5rem + 6vw, 8rem);     /* padding-section-large */
  --spacing-halo: 32rem;    /* diametrul haloului pe mobil (raza vizibilă originală ≈ 255px la 375) */
  --spacing-halo-lg: 60rem; /* diametrul de la md (≈ 475px rază la 1440) */
  --spacing-cursor: 1rem;        /* punctul cursorului (§9), .cursor-element 1rem */
  --spacing-cursor-glow: 10.5rem; /* lumina cursorului pe linkuri (§9): 6rem + estompare 15px ≈ 84px rază */
  --container-site: 81rem;  /* container-large */
  --container-text: 65ch;  /* măsura de lectură (max-w-text); ch se calculează din fontul elementului */

  --radius-media: 0.5rem;
  --radius-card: 1.25rem;
  --radius-panel: 2rem;
  --radius-pill: 999px;

  --shadow-glow: var(--glow-offset) var(--glow-offset) var(--glow-blur) var(--glow-spread)
    color-mix(in srgb, var(--color-glow) var(--glow-opacity), transparent); /* = 2px 2px 14px 6px #ddd6d633 (§8) */
  --shadow-lime: 4px 2px 6px 0 #49691099;

  --blur-nav: 11px;
  --blur-panel: 30px;       /* panoul footerului (overlay-urile originale, blur 30px) */

  --aspect-wordmark-half: 3319 / 375; /* jumătatea de sus a wordmark-ului (raportul viewBox / 2) */

  --breakpoint-sm: 30rem;   /* 480  (Webflow ≤479) */
  --breakpoint-md: 48rem;   /* 768  (≤767) */
  --breakpoint-lg: 62rem;   /* 992  (≤991) */
  --breakpoint-xl: 90rem;   /* 1440 (plafon fluid) */
  --breakpoint-2xl: 120rem; /* 1920 */

  --ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1);
  --ease-out-circ: cubic-bezier(0, 0.55, 0.45, 1);
  --ease-in-out-quint: cubic-bezier(0.83, 0, 0.17, 1);
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);

  --default-transition-duration: 200ms;

  --z-index-cursor: 100;    /* cursorul (§9), peste header (z-50) și skip link (z-60); original 100000 */
}

/* straturile lui --shadow-glow (§8), măsurate pe pill-ul din hero-ul original; fără namespace Tailwind */
@theme static {
  --glow-offset: 2px;
  --glow-blur: 14px;
  --glow-spread: 6px;
  --glow-opacity: 20%;
}

/* cursorul (§9), citite din JS de cursor.ts */
@theme static {
  --cursor-follow-duration: 150ms; /* urmărirea, plafonată (original ≈ 375 ms) */
  --cursor-state-duration: 200ms;  /* hover in/out, ca în IX2 */
  --cursor-button-scale: 0.3;      /* lumina pe butoane: punctul estompat cu 10px */
  --cursor-button-opacity: 0.27;
}
```

Duratele GSAP stau în modulul de animații (`docs/ANIMATIONS.md`), nu în CSS: `fast 0.2`, `base 0.5`, `slow 0.9`, `slower 1.4`. Excepție: cursorul (§9), ale cărui durate și dimensiuni sunt tokeni `@theme static`, citiți de `cursor.ts` (cerință la pasul 5).

Corespondența cu scara din §1: `text-tag` = Tag, `text-body` = Body, `text-lead` = Text mare, `text-h3` = H3, `text-h2-sm` = Meniu footer / H2 mic, `text-h2` = H2 și bandă CTA, `text-story` = storytelling, `text-display` = hero. Wordmark-ul din footer nu are token de text: e un SVG care scalează la lățimea containerului (vezi mai jos). `--text-*: initial` elimină scara implicită (`text-xs`, `text-lg` etc. nu există).

### Clase de componente și variante (Etapa 3)

Cazuri în care utilitarele nu ajung și se scrie CSS în `@layer components` din `global.css` (fără valori arbitrare în markup):

- `.btn`, `.btn-lg`, `.btn-fill` (componenta `ui/Button.astro`): punctul lime (`size-2`, element propriu) stă în fața textului; umplerea lime crește din centrul lui. `--btn-pad` (6 sau 8 × `--spacing`) dă atât padding-ul lateral, cât și poziția punctului (`--btn-dot-x = --btn-pad + --spacing`). Repaus: `clip-path: circle(0 at --btn-dot-x 50%)`; hover/focus-visible: `circle(150% …)`, 0.4s `--ease-out-expo`; textul trece la `ink`, punctul rămâne lime pe fundal lime, deci dispare. Apăsat (`:active`): punctul devine `ink`. Toate variantele. Reduced motion: fără tranziție. Glow static: utilitarul `shadow-glow` pe buton (§8), neschimbat la hover și `:active`. Variante: `header` (compact, `ink-soft/50` + blur nav), `cta` (mare, `text-lead`), `footer` (mare, lățime plină sub `sm`, poate fi `<button type="submit">`), `icon` (fără punct, umplere sau glow: toggle-ul meniului). API complet: `docs/COMPONENTS.md`.
- `.line-mask`: masca SplitText a `line-reveal`, cu `padding-block: .12em .2em` și margine negativă egală (zona de clip mai mare, layout neschimbat).
- `@custom-variant current` (`[aria-current="page"]`): `current:text-lime` pentru linkul paginii curente.
- Wordmark footer (Etapa 4): `<svg>` cu `<text>` Manrope 700, `tracking-display`, `font-size` 1000 și `viewBox="70 -735 3319 750"` = conturul literelor „Bolders” măsurat cu fontul real (stânga 70, dreapta 3389, ascendent 735, descendent 15). SVG-ul are `w-full h-auto`, deci literele ating exact marginile containerului la orice lățime, fără JS la resize și fără CLS (înălțimea vine din raportul viewBox-ului). **Gradient orizontal static, ca în original** (corecturi Etapa 4): umplerea `paper → mist/75% → transparent` de la stânga la dreapta, plus un contur (`stroke`, 1.5 px `non-scaling-stroke`) `mist` care apare spre dreapta, deci „B o l” sunt pline, „e r s” rămân în contur. Culorile vin din tokeni (`stop-color="currentColor"` + `text-*`). Decorativ, `aria-hidden`. Dacă se schimbă fontul, textul sau tracking-ul, viewBox-ul și `--aspect-wordmark-half` se remăsoară.
- Panoul footerului (corecturi Etapa 4): grilă cu trei rânduri peste wordmark. Rândul 1 = jumătatea de sus a wordmark-ului (`aspect-wordmark-half`), deci panoul începe exact la mijlocul înălțimii literelor la orice lățime, fără JS; rândul 3 (`h-8`) prelungește panoul sub linia de bază. Panoul: `rounded-card` (mobil) / `rounded-panel`, `border-line`, `bg-ink-soft/60`, `backdrop-blur-panel`. Conține © anul + Bolders Srl, linkurile legale (`text-body`, ținte de 44 px) și locul gol pentru iconițele sociale (`data-slot="social"`).
- Separatorul „/” din meniul footerului: `span` lime poziționat în spațiul (`gap`) din stânga fiecărui link; lista are `overflow-clip`, deci separatorul primului link de pe fiecare rând vizual (inclusiv după wrap pe mobil) cade în afara listei și nu se vede. Rezultat: „/” doar între linkuri de pe același rând, niciodată la capăt.
- `.hero-pending [data-hero-part]` (Etapa 4): `opacity: 0` cât timp scriptul inline din Hero ține hero-ul ascuns pentru intrare (ANIMATIONS.md, „hero-syllables”). Fără JS clasa nu există.
- `.no-kerning` (reactivare efecte, pasul 4): `font-kerning: none` pe „strălucești!”, ca împărțirea în litere `inline-block` (SplitText, `smoke-text`) să nu schimbe lățimea cuvântului.
- `.hero-grid` (Etapa 4): `mask-image` radial pe fundalul cu liniile de construcție, ca liniile să se stingă spre margini.
- Fundalul hero (`home/HeroGrid.astro`): verticalele sunt marginile reale ale coloanelor din `container-site` (4 pe mobil, 12 de la `md`), `border-dashed border-line`. Construcția lui „b” (cerc + 2 diagonale paralele la ≈ 56°, a doua tangentă la cerc + 3 orizontale: vârful tijei, umărul, linia de bază) stă într-un pătrat de 4 coloane pe mobil și 6 coloane (4–9) de la `md`, deci tangentele verticale ale cercului cad pe linii de coloană. SVG desenat de la zero (nu e copiat fișierul din `reference/media`), `vector-effect: non-scaling-stroke`, `stroke-line`. Fără WebGL, fără canvas.

**`text-display` măsurat pe original** (reactivare efecte, pasul 4, 28.10; `.heading-move` / `.heading-3`, Playwright):

| Lățime | Original font-size | `text-display` | line-height | letter-spacing |
|---|---|---|---|---|
| 375 | 27.99 px | 28 px | 110 % | normal |
| 390 | 28.22 px | 28 px | 110 % | normal |
| 412 | 28.56 px | 28.6 px | 110 % | normal |
| 768 | 58.41 px | 58.5 px | 110 % | normal |
| 1440 | 80 px | 80 px | 110 % | normal |
| 1920 | 90 px | 90 px | 110 % | normal |
| 2560 | 103.3 px | 103.3 px | 110 % | normal |

Originalul crește în trepte (breakpoint-urile Webflow): între 479 și 767 rămâne ≈ 32–33 px, apoi sare la 58 px; la 992 are 75.3 px. Tokenul e continuu (`min()` între panta de mobil 412 → 768 și panta de desktop 1440 → 1920), deci coincide în punctele de mai sus și diferă între trepte (600: 44 vs 33 px; 992: 70.7 vs 75.3 px). Hero-ul nu mai folosește `tracking-display` (originalul are letter-spacing normal).

**Hero:** tot H1-ul („Acum este momentul” + „să strălucești!”) e Manrope **700** (`font-bold`), alb (`paper`), la toate rezoluțiile (decizie Adi, 28.10).

**Regulă de greutate (alte titluri display):** Manrope 200 (`font-light`) se folosește **doar** cu `text-display` și doar peste ~3rem. Nu se aplică pe hero. Pentru orice alt text, sub ~3rem greutatea minimă e 400.

## 3. Direcția de modernizare

**Subiect:** agenție mică româno-austriacă (web, marketing, branding), condusă de fondator, pentru antreprenori și IMM-uri care vor „să strălucească” online. Prima sarcină a site-ului: încredere și o discuție inițiată („Hai să discutăm!”).

**Ce rămâne neschimbat (identitate):** fundal ink `#0d0d0d`, Manrope, accentul lime, simbolul „b”, wordmark-ul uriaș „Bolders” din footer, separatorul „/” lime din meniul footerului, pill-ul „Construim viitorul tău digital!”, punctul lime din butoane, textele.

**Decizii Etapa 4:**
- **Separatorul „/” lime redevine element de identitate** (corecturi Etapa 4, revine asupra deciziei din hero): în meniul footerului stă între linkurile de pe același rând, nu după ultimul link din rând.
- **Footerul urmează originalul:** wordmark cu gradient orizontal și literele din dreapta în contur, panou rotunjit cu blur peste jumătatea de jos a literelor.
- **Logo-ul rămâne fără cerc**: în header și oriunde apare, simbolul „b” din `brand/logo.svg` stă singur, fără cercul de contur din original. Cercul apare doar ca linie de construcție în fundalul hero-ului.

**Ce se schimbă:**

1. **Un singur moment îndrăzneț: tipografia ca obiect.** Contrastul vine din *greutatea* aceluiași font, nu din al doilea font. Display-ul se scrie cu Manrope 200 (ExtraLight) la dimensiuni foarte mari, iar cuvintele-cheie în același rând cu 700. Excepție: H1-ul hero e în întregime 700, alb (§2). Varianta studiors (serif italic + grotesk) devine la noi „Manrope subțire + Manrope gros”. Silabele din „st·ră·lu·ce·ști!” rămân semnătura hero-ului: intră din mască, apoi literele trec prin fum în loop (`smoke-text`).
2. **Lime-ul e semnal, nu decor.** Apare numai acolo unde ceva e activ sau acționabil: punctul din butoane, linkul curent, pasul curent din metodă, progresul formularului. Singura excepție decorativă e separatorul „/” din meniul footerului (identitate din original). Maximum ~3% din suprafața unui ecran. Fără titluri lime și fără fundaluri lime.
3. **Hero centrat, secțiunile editoriale asimetrice.** Hero-ul rămâne **centrat**, ca în original: pill, titlu, subtitlu, buton, în această ordine, toate centrate pe axa paginii. Titlul display are mărimea originalului (28 px pe mobil → 80 px la 1440); pe mobil stă pe două rânduri („Acum este momentul” / „să strălucești!”), cuvântul accentuat nu se rupe. Restul secțiunilor folosesc o grilă de 12 coloane în `container-site`: titlurile pornesc din coloana 1, textul de susținere stă decalat în coloanele 7–12 (cf. `sectiune sub hero.png`). Contrastul dintre hero-ul centrat și secțiunile aliniate la stânga e intenționat.
4. **Liniile de construcție ale lui „b” ca motiv structural.** Liniile subțiri `line` din fundalul hero-ului și din `resurse/card-bolders-linii-constructie.svg` devin o grilă de fundal vizibilă doar în hero și în metodă, aliniată la coloanele reale. Nu e textură decorativă: arată grila pe care stă conținutul.
5. **Ierarhie de raze, nu una singură:** pill pentru tot ce se apasă, `panel` (2rem) pentru suprafețele mari (formular, cardurile departamentelor), `media` (0.5rem) pentru capturile de proiect. Testimonialele devin citate tipografice pe fundal ink, fără card.
6. **Secțiuni noi din inspirație, în identitatea Bolders:** proiecte în slider orizontal cu contor `01 / 04` (pe dark, nu pe crem), metodă fixată în 5 pași (secvență reală, numerotarea e justificată), departamente ca listă mare cu hover (doar pe pagina Departamente), formular în 3 pași, povestea agenției cu text care se așază la scroll.

Schiță homepage (desktop):

```
┌ logo ───────── Agenție  Departamente  Proiecte  Contact ─────── (● Contact) ┐
│                 (pill) Construim viitorul tău digital!                      │
│                         Acum este momentul                                  │
│                        să st|ră|lu|ce|șt|i!                                 │
│               ← display 700, centrat, silabe mascate →                      │
│     Afacerea ta merită mai mult decât să fie doar un nume pe internet.      │
│                         (● Hai să discutăm!)                                │
├─────────────────────────────────────────────────────────────────────────────┤
│ Garanția noastră este simplă… (story, cuvintele se aprind la scroll) col 1-9│
│ Departamente: stivă de carduri (fan)  Marketing Digital / Web-design / …    │
│ Fii Bolders + testimoniale (citate)                                         │
│ Resurse: 2 carduri, deschidere mascată legată de scroll                     │
│ Proiecte ─ slider orizontal ─ 01 / 04   (placeholder până la confirmare)    │
│ Metoda (pinned) 01 Solicită → 05 Livrare                                    │
│ Echipa · FAQ (acordeon) · CTA bandă de mesaje · footer wordmark             │
└─────────────────────────────────────────────────────────────────────────────┘
```

Verificare față de bilet: paleta ink + lime este identitatea existentă (impusă de brief), nu o alegere implicită. Ca să nu arate ca varianta generică „dark + acid green”, accentul e limitat la rolul de semnal, contrastul tipografic vine din axa de greutate Manrope, iar motivul de fundal derivă din construcția logo-ului. Etichetele all-caps și meta-urile cu puncte din studiors **nu** se preiau.

## 4. Reguli de mișcare

- Se animă **doar** `transform`, `opacity` și `clip-path`. Excepții strict limitate (§6): `filter: blur()` doar în modulul `smoke-text`; canvas/WebGL doar în modulul `fluid`.
- Fără animații care modifică layout-ul în timpul scroll-ului: `width`, `height`, `margin`, `padding`, `top`/`left`, `font-size`. Excepții documentate în `ANIMATIONS.md`: înălțimea acordeonului/descrierilor, declanșate de utilizator, nu de scroll.
- Preferință pentru **scrub legat de scroll** și **măști** (`overflow: clip`, `clip-path`) față de apariții simple (fade-in/fade-up la intrarea în viewport).
- Țintă: **60 fps pe mobil** (testat cu throttling CPU 4× în DevTools). Ce nu ține 60 fps se simplifică sau se dezactivează pe `isMobile`.

## 5. Lista anti-banal (nu folosim niciodată)

Excepțiile reactivate din original (fum WebGL, cursor custom, glow pe butoane, iconițe 3D) au fost scoase din listă și stau în §6.

- Gradient mov / albastru-mov, „aurora”, mesh gradients, blob-uri colorate
- Carduri cu glow, bordură luminoasă sau `box-shadow` neon (glow-ul e permis doar pe butoane, §6)
- Glassmorphism ca stil general (blur rămâne doar pe nav și pe panoul footerului, ambele din original)
- Emoji ca iconițe, iconițe svgrepo generice
- Poze stock, portrete generate AI, mockup-uri de device generice, fotografii cu oameni care arată la laptop
- Grile de carduri identice cu aceeași rază și aceeași umbră gri
- Preloader cu procent, ecran de încărcare, intro care blochează conținutul
- Three.js, shader-e sau canvas decorativ în afara modulului `fluid` (§6)
- Magnetic buttons
- Fade-and-slide-up identic pe fiecare secțiune
- Etichete ALL CAPS cu tracking mare deasupra fiecărui titlu; meta-uri legate cu „·”; „→” lipit de fiecare buton
- Accentuarea unui singur cuvânt din titlu cu altă culoare sau italic
- Numerotare 01/02/03 pe conținut care nu e secvență
- Contoare animate „0 → 349” și statistici decorative
- Badge-uri de parteneri sau tehnologie (Webflow Partner, Client First etc.)
- Fonturi suplimentare (Poppins, serif-uri de import) și monospace pentru etichete
- Parallax pe fiecare imagine, scroll-jacking în afara secțiunilor fixate planificate

## 6. Efecte reactivate din original (confirmat de Adi, 28.10)

**Regulă:** nimic din original nu se elimină fără confirmarea lui Adi. Orice eliminare sau înlocuire a unui element existent pe bolders1.webflow.io se notează în `PROGRESS.md` cu data confirmării.

| Efect | Original | `data-anim` | Stare |
|---|---|---|---|
| Fum la cursor/atingere pe toată pagina (inclusiv mobil) | `splash-effect-8.js` (fluid WebGL pe canvas fix) | `fluid` | reactivat, pasul 6 |
| Cursor custom | `.cursor-element` (IX2 `MOUSE_MOVE`) | `cursor` | ✅ pasul 5 (28.10): punct alb doar pe desktop (mouse + hover), valorile din §9 |
| Glow pe butoane | butonul „glowing” | — (decor static, §8) | ✅ pasul 3 (28.10, corectat): **halou static uniform pe contur** = umbra pill-ului din hero, pe toate butoanele și pe pill (decizie Adi); dunga rotativă de pe border eliminată |
| Halouri de lumină difuză în spatele textelor | fundalul hero (omis la recreare) | — (decor static, §7) | ✅ pasul 2 (28.10): **static, ca în original** (decizie Adi, pentru performanță) |
| Fum pe „să strălucești!” (în loop) | silabele din hero (intrare cu blur, buclă) | `smoke-text` | ✅ pasul 4 (28.10): valorile măsurate pe original, pe litere; a înlocuit respirația 700 → 200 → 700 |
| Iconițe 3D (glob, puzzle, mail, calendar, monede) | secțiunile homepage | — | **amânate, fișiere de la Adi** |

Rămân eliminate (confirmat de Adi): poze stock, preloader cu procent, contoare animate.

Constrângeri vizuale:
- **Lime rămâne semnal** (max. ~3% din suprafața unui ecran). Glow-ul și halourile nu sunt lime.
- Halourile și glow-ul butoanelor sunt **statice** (fără animație, fără `data-anim`), vezi §7 și §8.
- Glow-ul și halourile folosesc **doar tokeni din `@theme`** (culori, blur, raze). Valorile originale (`#ffffff4d`, `#ffffff80`, `#ddd6d633`) se mapează la tokeni noi, adăugați întâi aici, la pasul respectiv.
- Comportamentul fiecărui efect (proprietăți animate, mobil, reduced motion, limite de performanță): `ANIMATIONS.md`, „Efecte reactivate”.

## 7. Halouri de lumină (decor static)

Decizie Adi (28.10): haloul e **static, exact ca în original**, pentru performanță. Fără animație, fără `data-anim`, fără `will-change` și fără listeneri. `npm run audit:rules` (regula `halo-static`) respinge `data-anim="halo"` și un modul `src/scripts/animations/halo.ts`.

### Originalul (măsurat cu Playwright pe bolders1.webflow.io, 28.10)
- **Ce e:** imaginea `centerbackground.png` (1920×1500, `reference/media/decor/fundal-glow-centru.png`) pusă ca `background-image` (`cover`, `50% 50%`) pe containerul secțiunii. Static: opacitatea, transformul și poziția nu se schimbă (fără IX2/GSAP).
- **Formă și culoare:** o singură pată eliptică aproape circulară, centrată (centroid 49.5% / 49.7% din imagine). Pixelul cel mai luminos: `rgba(160, 168, 174, .37)` (neutru, ușor rece), adică ≈ 20% alb efectiv peste fundal (= `paper-dim`). Profil radial: 100% în centru, ≈ 53% la ¼ din rază, ≈ 22% la ½, ≈ 6% la ¾, 0 la margine.
- **Dimensiune:** rază vizibilă ≈ 475 px la 1440 (imaginea scalată la 0.75) și ≈ 255 px la 375 (secțiune 601 px înaltă, imagine scalată la 0.4).
- **Poziție față de text:** centrul luminii cade pe linia titlului (hero: centrul secțiunii = linia dintre „Acum este momentul” și „să strălucești!”), deasupra centrului blocului de conținut (pill → buton).

### Implementare
- **Componentă:** `src/components/ui/Halo.astro`: un singur `div` `aria-hidden`, `pointer-events-none`, `absolute -z-10`, centrat pe o ancoră (`position`: `center` 50/50, `top` 50/25, `bottom` 50/75, `left` 25/50, `right` 75/50, procente din părinte). `mobile={false}` îl ascunde sub `md`. Părintele: `relative isolate overflow-clip` (clip pe secțiune, nu pe body), adică `<Section layers clip>`. În DOM se pune înaintea celorlalte straturi decorative (grila hero), ca să stea sub ele, ca în original.
- **Gradient:** doar utilitare: `bg-radial from-halo via-halo/50 via-18% to-transparent to-70%` pe un pătrat `size-halo` / `md:size-halo-lg`. `bg-radial` e o elipsă `farthest-corner`; `to-70%` ≈ latura pătratului, deci gradientul ajunge la 0 la marginea elementului (fără muchie vizibilă). Opritorul `via` reproduce profilul original (50% la ¼ din rază). Fără `filter: blur`.
- **Tokeni (§2):** `--color-halo` (= `paper-dim`, intensitatea originalului), `--spacing-halo` 32rem, `--spacing-halo-lg` 60rem.
- **z-index:** Tailwind v4 nu are namespace de temă pentru `z-index`; `-z-10` în contextul `isolate` al secțiunii, ca `HeroGrid`; ordinea față de grilă vine din DOM.
- **Contrast:** în cel mai rău punct (centrul haloului), `paper-muted` are ≈ 6.3:1 (față de ≈ 9.6:1 pe `ink` simplu), peste AA; `paper` > 10:1.
- **Culoarea:** neutră (`paper-dim`), nu ușor rece ca originalul: cerința a fost o culoare din paleta existentă; diferența de ton e sub pragul vizibil la 20% alfa.

### Unde apare haloul în original (de folosit la construirea secțiunilor)
| Secțiune nouă | Original | Text deasupra | Opacitate în original | `Halo` recomandat |
|---|---|---|---|---|
| 1. Hero | `.section_header` (fundal, 1440×901) | pill, „Acum este momentul să strălucești!” | 1 | ✅ `position="center"` (pe linia titlului) |
| 4. Fii Bolders + testimoniale | `.overlay` în `.section_servici`, `background-attachment: fixed`, întinsă pe toată secțiunea (≈ 2400 px la 1440, ≈ 3080 px la 375) | „Fii Bolders. Fii diferit!”, „Părerile celor care ne-au ales” | 0.4 (0.5 pe mobil) | câte un halou în spatele fiecărui titlu, cu clasa `opacity-40`; fundalul fix din original devine halouri în zone diferite (ex. `left` la titlu, `right` la testimoniale) |
| 10. CTA final | `.cta_wrapper` (card 1296×528, fundal) | tag „Construim viitorul tău digital!” + titlul CTA | 0.88 | `position="center"` în card (cardul are `overflow-clip`) |
| Departamente: „Iată de ce clienții aleg Bolders” | `.overlay` în `.section_servici` | titlul secțiunii | 0.4 | ca la secțiunea 4 |
| Departamente: lista de servicii (Branding, Webdesign…) | a doua `.overlay` (≈ 3680 px, fixă) | titlurile departamentelor | 0.4 | `mobile={false}`, câte unul la câteva titluri, alternând `left`/`right` |

Pe mobil originalul păstrează aceleași fundaluri; la noi, în secțiunile lungi, haloul suplimentar primește `mobile={false}` (mai puține halouri pe mobil).

## 8. Buton: glow static

Decizie Adi (28.10, corectură): glow-ul e **haloul pill-ului din hero-ul original** („Construim viitorul tău digital!”): lumină albă difuză, uniformă pe tot conturul pastilei, strânsă pe margini, fără spot dedesubt. Static, pe **toate butoanele** (`ui/Button.astro`, toate variantele, inclusiv „Contact” din header) și pe **pill-ul din hero**, la toate rezoluțiile. **Dunga de lumină care se rotește pe border e eliminată definitiv.** Fără animație, fără `data-anim`, fără JS; neschimbat la hover și `:active`. `npm run audit:rules` (regula `glow-static`) respinge `data-anim="glow"` și un modul `src/scripts/animations/glow.ts`.

Prima variantă (gradient radial sub buton, `.btn::before`, după `::after`-ul butonului „glowing”) a fost **eliminată**: concentra lumina sub buton.

### Originalul (computed style pe `.header_tag-wrapper`, Playwright, 28.10)

| | 375 | 1440 |
|---|---|---|
| `box-shadow` (un singur strat) | `rgba(221, 214, 214, 0.2) 2px 2px 14px 6px` | `rgba(221, 214, 214, 0.2) 2px 2px 14px 6px` |
| `background` | `rgb(49, 46, 46)` (`--border`), fără imagine | idem |
| `border` | niciunul (`0px none`) | idem |
| `border-radius` | 151.3 px (pill) | 160 px (pill) |
| dimensiune / padding | 201 × 35 px, `10.6px 15.1px` | 321 × 48 px, `16px 32px` |

Straturi: unul singur, offset x 2 px, offset y 2 px, blur 14 px, spread 6 px, culoare `#ddd6d6` la 20%. Spread-ul (6 px) e mai mare decât offset-ul (2 px), deci haloul se vede pe toate laturile, inclusiv sus (puțin mai lat în dreapta-jos).

### Implementare
- **Tokeni (§2):** `--color-glow` `#ddd6d6`; `@theme static`: `--glow-offset` 2px, `--glow-blur` 14px, `--glow-spread` 6px, `--glow-opacity` 20%; `--shadow-glow` le compune (`color-mix(in srgb, --color-glow --glow-opacity, transparent)` = `#ddd6d633`). Tailwind generează și fallback-ul `#ddd6d633` pentru browserele fără `color-mix`. `--shadow-tag` (aceeași valoare, nefolosit) a fost înlocuit de `--shadow-glow`.
- **Utilizare:** `shadow-glow` în clasele de bază din `ui/Button.astro` (variantele pill) și în varianta `tag` din `ui/Pill.astro` (pill-ul din hero). Fără CSS scris de mână, fără pseudo-element.
- Fundalul, border-ul (`border-line`), punctul lime, hover-ul și `:active` ale butonului sunt neschimbate. `box-shadow` exterior nu e tăiat de `overflow-clip`-ul butonului și nu afectează layout-ul sau zona de click.

### Abateri față de original
- Butoanele primesc umbra pill-ului (în original butoanele aveau dunga rotativă, iar „Contact” nu avea glow): decizia lui Adi.
- Offset-ul de 2 px păstrat exact ca în original (cerința: straturile exact ca în original); haloul e ușor mai lat în dreapta-jos, dar vizibil și sus.

## 9. Cursor custom

Decizie Adi (28.10): punct alb, doar desktop, fidel originalului. Cursorul sistemului se ascunde, dar revine pe câmpuri de formular, text editabil și cât timp se selectează text. Întârzierea rămâne mică, precizia nu se pierde.

### Originalul (Playwright pe bolders1.webflow.io la 1440 + IX2 `a-44`, `a-45`/`a-47`, `a-49`/`a-50`, 28.10)

| | Valoare |
|---|---|
| Elemente | `.cursor-wrapper` (`fixed`, `inset 0`, 100vw × 100vh, flex centrat, `z-index: 100000`, `pointer-events: none`, **`mix-blend-mode: difference`**) cu `.cursor-element` în centru |
| Punctul | **16 × 16 px** (1rem), `#ffffff`, `border-radius: 50%`, opacitate 1, fără umbră |
| Activ | IX2 doar pe breakpoint-ul `main` (≥ 992 px); `* { cursor: none }` în codul custom de la 992 px în sus, **inclusiv pe input-uri** (computed `none`); sub 991 px wrapper-ul e `display: none` |
| Urmărire | IX2 `MOUSE_MOVE` pe pagină, `x` −50vw → 50vw, `y` −50vh → 50vh, **smoothing 85**: la fiecare cadru poziția avansează cu 15% din distanța rămasă (exponențial, depinde de rata de cadre) |
| Întârziere măsurată (salt de 1000 px, 60 Hz) | 38% la 25 ms, 62% la 50 ms, 86% la 100 ms, **95% la ≈ 155 ms**, 99% la ≈ 240 ms, **poziția finală (< 0.5 px) la ≈ 375 ms**; constanta de timp ≈ 50 ms |
| Hover pe butoane (`.button`, `.footer_social-link`) | mărimea rămâne 1rem, `filter: blur(0 → 10px)`; **200 ms `ease`** |
| Hover pe linkuri (`.navbar_link`, `.footer_link`, logo, linkuri externe etc.) | mărimea **1rem → 6rem** (`width`/`height`), `blur(0 → 15px)`; **200 ms `ease`** |
| Ieșirea din hover | înapoi la 1rem, `blur(0)`, 200 ms `ease` |
| Click | **fără stare** (nicio acțiune IX2 pe `mousedown`; mărimea și filtrul nu se schimbă) |
| Ieșirea din fereastră | **punctul rămâne vizibil** la marginea unde a ieșit (opacitate 1) |
| Înainte de prima mișcare | stă în centrul ecranului (`restingState 50`) |
| Defect | IX2 folosește `mouseover`/`mouseout`, care se declanșează și la trecerea pe copiii linkului: lumina de 6rem pâlpâie (crește și revine la 1rem) când mouse-ul trece pe text |

### Implementare
- **Componentă:** `src/components/ui/Cursor.astro`, inclusă o dată în `BaseLayout`: wrapper `fixed top-0 left-0 z-cursor mix-blend-difference pointer-events-none opacity-0`, `aria-hidden`, `transition:persist="cursor"`. În el: punctul (`size-cursor rounded-pill bg-cursor`) și lumina (`size-cursor-glow`, `bg-radial from-cursor from-18% via-cursor/50 via-40% to-transparent to-64%`, `opacity-0`).
- **Lumina fără `filter`:** `filter: blur()` e interzis în afara `smoke-text` (§4), deci estomparea e un gradient radial static, cu profilul unui disc estompat: pentru 6rem + 15 px (σ), intensitatea e ≈ 100% până la ¼ din rază, 50% la 48 px, ≈ 0 la ≈ 76 px. `bg-radial` e elipsa `farthest-corner`, deci opritorii sunt din semidiagonală (rază × √2): 18% / 40% / 64%. Pe linkuri lumina are `scale 1`, opacitate 1; pe butoane `scale .3`, opacitate **.27** (punctul de 16 px estompat cu σ 10 px are ≈ 27% în centru și ≈ 25 px rază vizibilă). Punctul se stinge (opacitate 0) cât lumina e aprinsă.
- **Tokeni (§2):** `--color-cursor`, `--spacing-cursor`, `--spacing-cursor-glow`, `--z-index-cursor`; `@theme static`: `--cursor-follow-duration` 150ms, `--cursor-state-duration` 200ms, `--cursor-button-scale` .3, `--cursor-button-opacity` .27.
- Comportamentul (urmărire, stări, excepții, View Transitions): `ANIMATIONS.md`, „`cursor`”.

### Abateri față de original
- **Urmărirea plafonată la 150 ms** (original: ≈ 375 ms până la poziția finală, 95% la ≈ 155 ms): `gsap.quickTo`, 150 ms `power2.out`, ajunge exact la țintă la 150 ms după ultima mișcare. Curba e apropiată de original în primele 50 ms (42% / 70% la 25 / 50 ms față de 38% / 62%), apoi mai rapidă.
- **Estomparea e gradient, nu `filter: blur()`** (regulă de proiect); mărirea pe linkuri e `scale` pe lumină, nu `width`/`height` (fără layout). Punctul nu crește: se stinge, iar lumina crește din dimensiunea de pe buton.
- **Activ după capabilități, nu după lățime:** mouse (`pointer: fine`) + `hover: hover`, fără reduced motion, la orice lățime (originalul: ≥ 992 px). O tabletă cu mouse primește cursorul.
- **Cursorul sistemului revine** pe `input`, `textarea`, `select`, `[contenteditable]`, peste `iframe`-uri și în timpul selecției de text (originalul îl ascundea peste tot); punctul se ascunde acolo.
- **Dispare la ieșirea din fereastră** și reapare direct sub mouse la revenire (originalul rămânea la margine). Apare la prima mișcare, nu în centrul ecranului.
- **Fără pâlpâire pe linkuri:** starea se citește prin delegare (`pointerover` + `closest("[data-cursor]")`), deci trecerea pe copiii linkului nu o resetează.

