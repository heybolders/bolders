# Capturi de ecran

- Orice captură de ecran, video sau output Playwright (MCP, `test-results/`, `playwright-report/`, trace-uri) se salvează **exclusiv** în `.screenshots/<etapa>/<subiect>/` (ex. `.screenshots/etapa-efecte/h1-700/`).
- Niciodată în `reference/`, `docs/`, `src/`, `public/` sau în alt folder urmărit de git. `.screenshots/` e în `.gitignore`; capturile rămân doar local.
- În `docs/PROGRESS.md` capturile se citează cu calea din `.screenshots/` (sunt locale, nu se comit).
- `npm run audit:rules` dă eroare pentru orice `png`/`jpg`/`jpeg`/`webp`/`webm`/`mp4` urmărit de git în afara `src/`, `public/` și a nivelului direct din `reference/inspiratie/` (imaginile manuale de inspirație). Excepții explicite în `scripts/audit-rules.mjs` (`TRACKED_MEDIA_ALLOW`): referințele din Etapa 1 ale site-ului original (`reference/media/`, `reference/screenshots/{home,departamente,privacy-policy-and-terms}/`). Textura de dithering a fumului (`LDR_LLL1_0.png`) stă în `src/assets/fluid/` din pasul 6, fără excepție.
- Folderul `.screenshots/` local se șterge la Etapa 8.
