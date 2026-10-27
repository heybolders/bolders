---
paths:
  - "src/content/**"
  - "src/pages/**"
  - "src/components/**/*.astro"
---

# Conținut

- Textele stau separat de cod, în `src/content/` (fișiere TS tipate sau content collections). Componentele primesc textul prin props sau import, nu îl conțin hardcodat.
- Sursa unică a textelor este `reference/continut.md`. Textul se preia exact, inclusiv diacriticele.
- **Fără texte inventate.** Unde lipsește conținut (meta, Agenție, News, pagini legale, detalii proiecte, date de contact), se pune un placeholder vizibil marcat `TODO(continut): ...` și se notează în `docs/PROGRESS.md`.
- Corecturile din „Greșeli de confirmat” (continut.md) se aplică doar după confirmarea clientului.
- Rămășițele de template nu apar nicăieri: „Flow Design Agency”, „Hire me”, lissanh95, Jotform, Stripe/Wise, „Co-founder 5fourdigital”, „John D Saunders”, minimdesign, heymara, textele legale în engleză.
- Nu se preiau texte de pe studiors.be sau guillaumezhu.com.
- Limba site-ului: română (`lang="ro"`). Adresarea: „tu”.
- Fiecare pagină are meta title și description proprii (din `src/content/`, nu din layout).
