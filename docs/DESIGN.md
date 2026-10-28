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

- Tag hero: `2px 2px 14px 6px #ddd6d633`
- Card verde: `4px 2px 6px 0 #49691099`
- Buton „glowing”: `0 0 60px #ffffff4d, 0 0 20px #ffffff80, 0 0 5px #ffffff80` (**reactivat**, vezi §6; se reface ca pseudo-element cu gradient, nu ca `box-shadow` animat)
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
  --text-display: clamp(3.25rem, 1rem + 9vw, 9rem); --text-display--line-height: 0.95;

  --font-weight-light: 200;
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;

  --tracking-tight: -0.02em;
  --tracking-display: -0.04em;

  --spacing: 0.25rem;
  --spacing-gutter: clamp(1.25rem, 0.8rem + 2vw, 2.5rem); /* padding-global */
  --spacing-section: clamp(4rem, 2.5rem + 6vw, 8rem);     /* padding-section-large */
  --container-site: 81rem;  /* container-large */
  --container-prose: 45rem;

  --radius-media: 0.5rem;
  --radius-card: 1.25rem;
  --radius-panel: 2rem;
  --radius-pill: 999px;

  --shadow-tag: 2px 2px 14px 6px #ddd6d633;
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
}
```

Duratele GSAP stau în modulul de animații (`docs/ANIMATIONS.md`), nu în CSS: `fast 0.2`, `base 0.5`, `slow 0.9`, `slower 1.4`.

Corespondența cu scara din §1: `text-tag` = Tag, `text-body` = Body, `text-lead` = Text mare, `text-h3` = H3, `text-h2-sm` = Meniu footer / H2 mic, `text-h2` = H2 și bandă CTA, `text-story` = storytelling, `text-display` = hero. Wordmark-ul din footer nu are token de text: e un SVG care scalează la lățimea containerului (vezi mai jos). `--text-*: initial` elimină scara implicită (`text-xs`, `text-lg` etc. nu există).

### Clase de componente și variante (Etapa 3)

Cazuri în care utilitarele nu ajung și se scrie CSS în `@layer components` din `global.css` (fără valori arbitrare în markup):

- `.btn`, `.btn-lg`, `.btn-fill` (componenta `ui/Button.astro`): punctul lime (`size-2`, element propriu) stă în fața textului; umplerea lime crește din centrul lui. `--btn-pad` (6 sau 8 × `--spacing`) dă atât padding-ul lateral, cât și poziția punctului (`--btn-dot-x = --btn-pad + --spacing`). Repaus: `clip-path: circle(0 at --btn-dot-x 50%)`; hover/focus-visible: `circle(150% …)`, 0.4s `--ease-out-expo`; textul trece la `ink`, punctul rămâne lime pe fundal lime, deci dispare. Apăsat (`:active`): punctul devine `ink`. Toate variantele. Reduced motion: fără tranziție. Variante: `header` (compact, `ink-soft/50` + blur nav), `cta` (mare, `text-lead`), `footer` (mare, lățime plină sub `sm`, poate fi `<button type="submit">`).
- `.line-mask`: masca SplitText a `line-reveal`, cu `padding-block: .12em .2em` și margine negativă egală (zona de clip mai mare, layout neschimbat).
- `@custom-variant current` (`[aria-current="page"]`): `current:text-lime` pentru linkul paginii curente.
- Wordmark footer (Etapa 4): `<svg>` cu `<text>` Manrope 700, `tracking-display`, `font-size` 1000 și `viewBox="70 -735 3319 750"` = conturul literelor „Bolders” măsurat cu fontul real (stânga 70, dreapta 3389, ascendent 735, descendent 15). SVG-ul are `w-full h-auto`, deci literele ating exact marginile containerului la orice lățime, fără JS la resize și fără CLS (înălțimea vine din raportul viewBox-ului). **Gradient orizontal static, ca în original** (corecturi Etapa 4): umplerea `paper → mist/75% → transparent` de la stânga la dreapta, plus un contur (`stroke`, 1.5 px `non-scaling-stroke`) `mist` care apare spre dreapta, deci „B o l” sunt pline, „e r s” rămân în contur. Culorile vin din tokeni (`stop-color="currentColor"` + `text-*`). Decorativ, `aria-hidden`. Dacă se schimbă fontul, textul sau tracking-ul, viewBox-ul și `--aspect-wordmark-half` se remăsoară.
- Panoul footerului (corecturi Etapa 4): grilă cu trei rânduri peste wordmark. Rândul 1 = jumătatea de sus a wordmark-ului (`aspect-wordmark-half`), deci panoul începe exact la mijlocul înălțimii literelor la orice lățime, fără JS; rândul 3 (`h-8`) prelungește panoul sub linia de bază. Panoul: `rounded-card` (mobil) / `rounded-panel`, `border-line`, `bg-ink-soft/60`, `backdrop-blur-panel`. Conține © anul + Bolders Srl, linkurile legale (`text-body`, ținte de 44 px) și locul gol pentru iconițele sociale (`data-slot="social"`).
- Separatorul „/” din meniul footerului: `span` lime poziționat în spațiul (`gap`) din stânga fiecărui link; lista are `overflow-clip`, deci separatorul primului link de pe fiecare rând vizual (inclusiv după wrap pe mobil) cade în afara listei și nu se vede. Rezultat: „/” doar între linkuri de pe același rând, niciodată la capăt.
- `.hero-pending [data-hero-part]` (Etapa 4): `opacity: 0` cât timp scriptul inline din Hero ține hero-ul ascuns pentru intrare (ANIMATIONS.md, „hero-syllables”). Fără JS clasa nu există.
- `.hero-grid` (Etapa 4): `mask-image` radial pe fundalul cu liniile de construcție, ca liniile să se stingă spre margini.
- Fundalul hero (`home/HeroGrid.astro`): verticalele sunt marginile reale ale coloanelor din `container-site` (4 pe mobil, 12 de la `md`), `border-dashed border-line`. Construcția lui „b” (cerc + 2 diagonale paralele la ≈ 56°, a doua tangentă la cerc + 3 orizontale: vârful tijei, umărul, linia de bază) stă într-un pătrat de 4 coloane pe mobil și 6 coloane (4–9) de la `md`, deci tangentele verticale ale cercului cad pe linii de coloană. SVG desenat de la zero (nu e copiat fișierul din `reference/media`), `vector-effect: non-scaling-stroke`, `stroke-line`. Fără WebGL, fără canvas.

**Regulă de greutate:** Manrope 200 (`font-light`) se folosește **doar** cu `text-display`, niciodată la o mărime randată sub ~3rem. Sub acest prag, greutatea minimă e 400.

## 3. Direcția de modernizare

**Subiect:** agenție mică româno-austriacă (web, marketing, branding), condusă de fondator, pentru antreprenori și IMM-uri care vor „să strălucească” online. Prima sarcină a site-ului: încredere și o discuție inițiată („Hai să discutăm!”).

**Ce rămâne neschimbat (identitate):** fundal ink `#0d0d0d`, Manrope, accentul lime, simbolul „b”, wordmark-ul uriaș „Bolders” din footer, separatorul „/” lime din meniul footerului, pill-ul „Construim viitorul tău digital!”, punctul lime din butoane, textele.

**Decizii Etapa 4:**
- **Separatorul „/” lime redevine element de identitate** (corecturi Etapa 4, revine asupra deciziei din hero): în meniul footerului stă între linkurile de pe același rând, nu după ultimul link din rând.
- **Footerul urmează originalul:** wordmark cu gradient orizontal și literele din dreapta în contur, panou rotunjit cu blur peste jumătatea de jos a literelor.
- **Logo-ul rămâne fără cerc**: în header și oriunde apare, simbolul „b” din `brand/logo.svg` stă singur, fără cercul de contur din original. Cercul apare doar ca linie de construcție în fundalul hero-ului.

**Ce se schimbă:**

1. **Un singur moment îndrăzneț: tipografia ca obiect.** Contrastul vine din *greutatea* aceluiași font, nu din al doilea font. Display-ul se scrie cu Manrope 200 (ExtraLight) la dimensiuni foarte mari, iar cuvintele-cheie în același rând cu 700. Varianta studiors (serif italic + grotesk) devine la noi „Manrope subțire + Manrope gros”. Silabele din „st·ră·lu·ce·ști!” rămân semnătura hero-ului, cu mască (`overflow: clip` pe linie).
2. **Lime-ul e semnal, nu decor.** Apare numai acolo unde ceva e activ sau acționabil: punctul din butoane, linkul curent, pasul curent din metodă, progresul formularului. Singura excepție decorativă e separatorul „/” din meniul footerului (identitate din original). Maximum ~3% din suprafața unui ecran. Fără titluri lime și fără fundaluri lime.
3. **Hero centrat, secțiunile editoriale asimetrice.** Hero-ul rămâne **centrat**, ca în original: pill, titlu, subtitlu, buton, în această ordine, toate centrate pe axa paginii. Titlul display ocupă lățimea containerului, iar pe mobil se rupe pe silabe la ≥ 3.25rem. Restul secțiunilor folosesc o grilă de 12 coloane în `container-site`: titlurile pornesc din coloana 1, textul de susținere stă decalat în coloanele 7–12 (cf. `sectiune sub hero.png`). Contrastul dintre hero-ul centrat și secțiunile aliniate la stânga e intenționat.
4. **Liniile de construcție ale lui „b” ca motiv structural.** Liniile subțiri `line` din fundalul hero-ului și din `resurse/card-bolders-linii-constructie.svg` devin o grilă de fundal vizibilă doar în hero și în metodă, aliniată la coloanele reale. Nu e textură decorativă: arată grila pe care stă conținutul.
5. **Ierarhie de raze, nu una singură:** pill pentru tot ce se apasă, `panel` (2rem) pentru suprafețele mari (formular, cardurile departamentelor), `media` (0.5rem) pentru capturile de proiect. Testimonialele devin citate tipografice pe fundal ink, fără card.
6. **Secțiuni noi din inspirație, în identitatea Bolders:** proiecte în slider orizontal cu contor `01 / 04` (pe dark, nu pe crem), metodă fixată în 5 pași (secvență reală, numerotarea e justificată), departamente ca listă mare cu hover (doar pe pagina Departamente), formular în 3 pași, povestea agenției cu text care se așază la scroll.

Schiță homepage (desktop):

```
┌ logo ───────── Agenție  Departamente  Proiecte  Contact ─────── (● Contact) ┐
│                 (pill) Construim viitorul tău digital!                      │
│                         Acum este momentul                                  │
│                        să st|ră|lu|ce|șt|i!                                 │
│               ← display 200/700, centrat, silabe mascate →                  │
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
- Fără animații care modifică layout-ul în timpul scroll-ului: `width`, `height`, `margin`, `padding`, `top`/`left`, `font-size`. Excepții documentate în `ANIMATIONS.md`: axa `wght` pe silabele hero (lățime rezervată, fără reflow; dispare la pasul 4 al reactivării, odată cu respirația) și înălțimea acordeonului/descrierilor, declanșate de utilizator, nu de scroll.
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
| Cursor custom | `.cursor-element` (IX2 `MOUSE_MOVE`) | `cursor` | reactivat, pasul 5 |
| Glow pe butoane | butonul „glowing” | `glow` | reactivat, pasul 3 |
| Halouri de lumină difuză în spatele textelor | fundalul hero (omis la recreare) | `halo` | nou adăugat, pasul 2 |
| Fum pe „să strălucești!” (în loop) | silabele din hero (intrare cu blur, buclă) | `smoke-text` | reactivat, pasul 4; înlocuiește respirația 700 → 200 → 700 |
| Iconițe 3D (glob, puzzle, mail, calendar, monede) | secțiunile homepage | — | **amânate, fișiere de la Adi** |

Rămân eliminate (confirmat de Adi): poze stock, preloader cu procent, contoare animate.

Constrângeri vizuale:
- **Lime rămâne semnal** (max. ~3% din suprafața unui ecran). Glow-ul și halourile nu sunt lime.
- Glow-ul și halourile folosesc **doar tokeni din `@theme`** (culori, blur, raze). Valorile originale (`#ffffff4d`, `#ffffff80`, `#ddd6d633`) se mapează la tokeni noi, adăugați întâi aici, la pasul respectiv.
- Comportamentul fiecărui efect (proprietăți animate, mobil, reduced motion, limite de performanță): `ANIMATIONS.md`, „Efecte reactivate”.

