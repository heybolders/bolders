# Bolders – site de prezentare

Site static pentru agenția **Bolders S.R.L.** (web, marketing digital, branding).
Rescrie https://bolders1.webflow.io/ cu aceeași identitate și structură, modernizat, fără aspect generic.

## Stack

Astro (ultima versiune, output `static`) · TypeScript strict · Tailwind CSS v4 (`@theme`) · GSAP (ScrollTrigger, SplitText) · Lenis · View Transitions (`<ClientRouter />`).
Node: versiunea din `.nvmrc`.

## Comenzi

- `npm run dev`: server de dev pe http://localhost:4321 (Astro 7 îl pornește ca daemon; oprire cu `npx astro dev stop`)
- `npm run build`: build static în `dist/`; **eșuează dacă găsește „lorem” în output** (`integrations/placeholder-guard.mjs`)
- `ALLOW_PLACEHOLDERS=1 npm run build`: doar local, transformă eroarea „lorem” în avertisment. **Scriptul de deploy nu setează niciodată acest flag.**
- `npm run preview`: servește `dist/`
- `npm run check`: `astro check` (TypeScript strictest + Astro)
- `npm run lint`: ESLint (typescript-eslint strict + eslint-plugin-astro)
- `npm run format` / `npm run format:check`: Prettier (pluginuri astro + tailwindcss)

Hook `.claude/hooks/format-lint.sh` (PostToolUse pe Edit/Write): Prettier + ESLint `--fix` pe fișierul modificat, apoi `astro check`.

## Structură

- `src/layouts/BaseLayout.astro`: `<html lang="ro">`, SEO, favicon, `<Font />` (preload), `<ClientRouter />`, skip link, Header + `<main>` + Footer, pornirea modulului de animații
- `src/config/navigation.ts`: sursa unică pentru rute și listele de linkuri (header, meniu mobil, footer); etichetele vin din `src/content/global.ts`
- `src/components/home/`: secțiunile homepage-ului (`Hero`, `HeroGrid`); textele în `src/content/acasa.ts`
- `src/components/global/`: `Header`, `Footer` (ambele `transition:persist`), `Seo`, `StubPage`; `src/components/ui/Button.astro`
- `src/scripts/navigation/current-page.ts`: `aria-current` sincronizat după navigare (header/footer persistente)
- URL-uri fără slash final (`/agentie`), build `format: "file"` → `dist/agentie.html`; `site: https://bolders.ro`
- `src/styles/global.css`: `@import "tailwindcss"` + `@theme` (DESIGN.md §2)
- `src/scripts/animations/`: `index.ts` (ciclu de viață), `registry.ts`, `smooth-scroll.ts` (Lenis, `getLenis()`), `conditions.ts` (matchMedia), `timing.ts` (durate), `anchor-scroll.ts`, câte un fișier per `data-anim`
- `src/content.config.ts` + `src/content/<colecție>/`: `pagini` (meta + titlu per pagină), `testimoniale`, `proiecte`, `faq`; `src/content/global.ts`: texte globale
- `src/assets/fonts/`: Manrope Variable woff2 (latin + latin-ext), încărcat prin Fonts API din `astro.config.mjs`
- Alias `@/*` → `src/*`

## Documentație (citește înainte de lucru)

- `docs/PROGRESS.md`: etapa curentă și ce urmează. **Sursa de adevăr pentru ce ai voie să faci.**
- `docs/DESIGN.md`: tokeni, mapare `@theme`, direcție vizuală, lista anti-banal
- `docs/ANIMATIONS.md`: animații per secțiune și atributele `data-anim`
- `reference/continut.md`: toate textele (singura sursă de conținut)
- `reference/media/INVENTAR.md`: imagini și marcajele „posibil stock/străin”
- `reference/screenshots/`: capturi ale site-ului original (375 / 768 / 1440)
- `reference/inspiratie/`: inspirație. Respectă „Ce NU preiau”.
- `reference/webflow/`: HTML/CSS/JS/IX2 original, **doar ca referință**, nu se copiază cod

## Reguli pe domenii (`.claude/rules/`)

- `code-style.md`: TypeScript, importuri, componente, denumiri
- `styling.md`: Tailwind, doar tokeni
- `animations.md`: modulul central `data-anim`, cleanup, reduced motion
- `content.md`: texte separate de cod, fără texte inventate
- `quality.md`: imagini, accesibilitate, verificare vizuală

## Securitate

- Nu citi, nu afișa și nu comite parole, chei, tokenuri sau fișiere `.env*`.
- Fără acces la servere, hosting, DNS, FTP/SSH sau panouri de administrare. Deploy-ul îl face omul.
- Fără servicii externe noi (analytics, formulare, CDN) fără acordul explicit al utilizatorului.
- Nu prelua cod, imagini sau texte de pe site-urile de inspirație.
- Rămășițele de template nu apar nicăieri: „Flow Design Agency”, lissanh95, Jotform, Stripe/Wise, 5fourdigital, minimdesign, heymara.

## Mod de lucru

- Lucrezi **strict pe etape**. Nu începi etapa următoare fără cerere explicită.
- La finalul fiecărei etape actualizezi `docs/PROGRESS.md` (ce s-a făcut, ce a rămas, neclarități).
- Comiți doar la cerere, cu mesaje de forma `tip: descriere` (`feat`, `fix`, `docs`, `chore`).
- Orice abatere de la DESIGN/ANIMATIONS se notează în PROGRESS.md cu motivul ei.
