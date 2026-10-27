# Bolders – site de prezentare

Site static pentru agenția **Bolders S.R.L.** (web, marketing digital, branding).
Rescrie https://bolders1.webflow.io/ cu aceeași identitate și structură, modernizat, fără aspect generic.

## Stack

Astro (ultima versiune, output `static`) · TypeScript strict · Tailwind CSS v4 (`@theme`) · GSAP (ScrollTrigger, SplitText) · Lenis · View Transitions (`<ClientRouter />`).
Node: versiunea din `.nvmrc`.

## Comenzi

Se completează la Etapa 2.

- `npm run dev`: _TBD_
- `npm run build`: _TBD_
- `npm run preview`: _TBD_
- `npm run lint` / `npm run format`: _TBD_

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
