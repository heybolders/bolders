# COMPONENTS

Primitivele din `src/components/ui/`. Secțiunile (`home/`, `global/`, paginile) le compun și nu scriu direct butoane, linkuri, titluri, containere sau pill-uri. Regulile: `.claude/rules/components.md`; verificarea: `npm run audit:rules`.

**Convenții comune**
- `interface Props` tipată, valori implicite; atributele HTML (`aria-*`, `data-*`, `id`) trec prin `...attrs` pe elementul principal.
- Variantele sunt obiecte `const` mapate pe utilitare Tailwind (doar tokeni). Clasele se combină cu `class:list`.
- `class` acceptă **doar poziționare în layout**: margin, grid, order, vizibilitate pe breakpoint (`mt-8`, `lg:col-span-5`, `lg:hidden`). Culoarea, textul, padding-ul și fundalul sunt variante.
- `data-*` fără valoare se scriu `data-x=""` (prin props, un boolean devine `="true"` în HTML).
- Componentele interactive (`Button`, `TextLink`) au inelul `focus-visible` (2 px lime, offset 2 px) și ținta de 44 px incluse.

## Button

`<a>` când primește `href`, altfel `<button>`. Are `data-cursor="button"` (starea cursorului custom). Punctul lime, umplerea din punct la hover/focus (`.btn` / `.btn-fill`, `global.css`), punctul ink la `:active` și glow-ul static (`shadow-glow`) sunt incluse în variantele pill.

| Prop | Tip | Implicit | |
|---|---|---|---|
| `variant` | `"header" \| "cta" \| "footer" \| "icon"` | `"cta"` | |
| `href` | `string` | – | randează `<a>` |
| `type` | `"button" \| "submit" \| "reset"` | `"button"` | doar pentru `<button>` |
| `class` | `string` | – | poziționare |

| Variantă | Aspect | Țintă |
|---|---|---|
| `header` | pill compact, `ink-soft/50` + blur nav, `text-lead` | `min-h-11` |
| `cta` | pill mare, `ink-soft`, `text-lead` | `min-h-14` |
| `footer` | pill mare, lățime plină sub `sm`, `text-body` | `min-h-14` |
| `icon` | fără chenar, punct, umplere sau glow; `group` pentru iconița din interior | `size-11` |

```astro
<Button href={HERO.cta.href}>{HERO.cta.label}</Button>
<Button variant="footer" type="submit">{FORM.submit}</Button>
<Button variant="icon" data-nav-toggle="" aria-expanded="false" aria-label={HEADER_TEXT.menuToggle} class="lg:hidden">
  <Icon name="menu" />
</Button>
```

**Când:** orice acțiune sau link cu aspect de buton. Butoane fără text vizibil doar cu `variant="icon"` și `aria-label`.

## TextLink

Orice link care nu arată ca un buton. Are `data-cursor="link"` (starea cursorului custom). Starea paginii curente vine din `aria-current="page"` (varianta `current:`).

| Prop | Tip | Implicit |
|---|---|---|
| `href` | `string` (obligatoriu) | – |
| `variant` | `"nav" \| "menu" \| "footer" \| "legal" \| "logo" \| "skip"` | `"footer"` |
| `class` | `string` | poziționare |

| Variantă | Unde | Hover / activ |
|---|---|---|
| `nav` | pill-ul din header, `text-lead` 500, `min-h-11` | `mist` / `lime` |
| `menu` | meniul mobil, `text-h2` 500, `py-1.25` (≈ 45 px pe telefoane) | – / `lime` |
| `footer` | meniul din footer (mărimea vine din listă), `min-h-11` | `mist` / `lime` |
| `legal` | linkurile legale, `min-h-11` | `paper` / `lime` |
| `logo` | simbolul din header, 56 × 44 | – |
| `skip` | „Sari la conținut”, ascuns până la focus | – |

```astro
<TextLink href={href} variant="nav" data-nav-link="" aria-current={ariaCurrent(href)}>{label}</TextLink>
```

**Când:** linkuri de navigație și linkuri din text. Linkurile care pornesc o acțiune principală sunt `Button`.

## Heading

Semantica (`as`) e separată de aspect (`size`).

| Prop | Tip | Implicit |
|---|---|---|
| `as` | `"h1"`…`"h6" \| "p"` | `"h2"` |
| `size` | `"display" \| "story" \| "h2" \| "h2-sm" \| "h3"` (tokenii `text-*`) | `"h2"` |
| `weight` | `"light" \| "normal" \| "medium" \| "bold"` | moștenit |
| `tracking` | `"tight" \| "display"` | normal |
| `tone` | `"paper" \| "muted"` | moștenit |
| `balance` | `boolean` (`text-balance`) | `false` |
| `split` | `boolean`: titlul e împărțit de SplitText (`line-reveal`); `flow-root` oprește colapsul marginilor măștii (CLS) | `false` |
| `class` | `string` | poziționare |

```astro
<Heading as="h1" size="display" weight="light" tracking="display" balance split data-anim="line-reveal">
  {titlu}
</Heading>
<Heading as="p" size="display" weight="light" tracking="display" tone="muted" aria-hidden="true">404</Heading>
```

**Când:** orice titlu. `as="p"` pentru text decorativ cu aspect de titlu (codul „404”). Un singur `h1` per pagină; nivelul urmează ierarhia, nu mărimea. `light` doar cu `display` (DESIGN.md §2).

## Container

| Prop | Tip | Implicit | |
|---|---|---|---|
| `size` | `"site" \| "text"` | `"site"` | |
| `fill` | `boolean` | `false` | `h-full` pe ambele niveluri (straturi absolute, ex. `HeroGrid`) |
| `measure` | `"body" \| "lead"` | `"body"` | doar `text`: mărimea textului din paragraf |
| `class` | `string` | – | poziționare |

- `site`: două elemente, `px-gutter` (exterior) + `mx-auto w-full max-w-site` (interior). Gutter-ul stă în afara lățimii maxime, deci conținutul are exact `--container-site` la ecranele late.
- `text`: un element `max-w-text` (tokenul `--container-text` = `65ch`, calculat din font), fără gutter. `measure` trebuie să fie mărimea textului din `<p>`, altfel lățimea iese din fontul de bază.

```astro
<Section spacing="screen">
  <Container>…</Container>
</Section>
<Container size="text" measure="lead" class="mt-8 md:mt-10">
  <p class="text-lead text-paper-muted">{HERO.subtitle}</p>
</Container>
```

**Când:** orice conținut aliniat la grila site-ului și orice paragraf cu măsură de lectură. `max-w-site` / `max-w-text` nu apar în afara lui; `max-w-prose` nu se folosește deloc.

## Section

Spațierea verticală; lățimea și gutter-ul vin din `Container`.

| Prop | Tip | Implicit |
|---|---|---|
| `as` | `"section" \| "footer" \| "div"` | `"section"` |
| `spacing` | `"default" \| "screen" \| "hero" \| "footer"` | `"default"` |
| `layers` | `boolean`: `relative isolate`, context pentru `Halo` / straturi decorative | `false` |
| `clip` | `boolean`: `overflow-clip` (halouri, wordmark, fără scroll orizontal) | `false` |
| `class` | `string` | poziționare |

| Spacing | Clase | Unde |
|---|---|---|
| `default` | `py-section` | secțiunile din pagini (Storytelling, Departamente, Proiecte, Metoda, FAQ, CTA) |
| `screen` | `flex min-h-svh items-end pt-32 pb-section` | stub-uri, 404 |
| `hero` | `flex min-h-svh items-center pt-24 pb-16 md:pt-28` | hero-ul homepage-ului |
| `footer` | `pt-section pb-4 md:pb-6` | footerul global |

```astro
<Section data-anim="hero-syllables" spacing="hero" layers clip>
  <Halo position="center" />
  <Container>…</Container>
</Section>
```

Directivele Astro trec prin componentă (`<Section as="footer" transition:persist="footer">`).

## Pill

Capsule neinteractive.

| Prop | Tip | Implicit |
|---|---|---|
| `as` | `"p" \| "span" \| "div" \| "ul"` | `"p"` |
| `variant` | `"tag" \| "glass" \| "bar"` | `"tag"` |
| `class` | `string` | poziționare |

| Variantă | Aspect |
|---|---|
| `tag` | eticheta din hero: `ink-soft`, chenar `line`, `text-body`, glow static (`shadow-glow`, sursa glow-ului în original) |
| `glass` | capsulă translucidă `ink-soft/50` + blur nav, rând flex (lista din header) |
| `bar` | bara headerului: capsulă cu chenar pe mobil, dizolvată de la `lg` |

```astro
<Pill data-hero-part="pill">{HERO.pill}</Pill>
<Pill as="ul" variant="glass">…</Pill>
```

**Când:** etichete și capsule de grupare. Ce e clicabil e `Button` sau `TextLink`.

## Icon

Iconițe decorative, mereu `aria-hidden`; numele accesibil îl dă părintele interactiv.

| Prop | Tip | |
|---|---|---|
| `name` | `"logo" \| "menu"` | `logo`: simbolul „b” (`h-7`); `menu`: două linii care devin X prin `group-aria-expanded` |
| `class` | `string` | poziționare |

```astro
<Button variant="icon" aria-expanded="false" aria-label={…}><Icon name="menu" /></Button>
```

**Când:** iconițe de UI. `menu` cere un părinte `group` cu `aria-expanded` (`Button variant="icon"`). O iconiță nouă (ex. plus/minus pentru FAQ) se adaugă aici ca `name`, nu ca SVG în secțiune.

## Halo

Lumină difuză statică în spatele textelor (DESIGN.md §7). Fără animație.

| Prop | Tip | Implicit |
|---|---|---|
| `position` | `"center" \| "top" \| "bottom" \| "left" \| "right"` | `"center"` |
| `mobile` | `boolean`: `false` îl ascunde sub `md` | `true` |
| `class` | `string` | poziționare |

```astro
<Section spacing="hero" layers clip>
  <Halo position="center" />
  …
</Section>
```

**Când:** în spatele titlurilor, unde originalul avea `centerbackground.png`. Părintele e o `Section` cu `layers` și `clip`; haloul stă primul în DOM, sub celelalte straturi decorative.

## Cursor

Cursorul custom (DESIGN.md §9, ANIMATIONS.md „`cursor`”). Fără props. **Inclus o singură dată, în `BaseLayout`**; nu se folosește în secțiuni.

```astro
<Cursor />
```

- `data-anim="cursor"`, `transition:persist="cursor"`, `aria-hidden`, `pointer-events-none`, `z-cursor`, `mix-blend-difference`; ascuns (`opacity-0`) până la prima mișcare a mouse-ului.
- Stările de hover vin din `data-cursor` pe primitive: `Button` pune `data-cursor="button"`, `TextLink` pune `data-cursor="link"` (pe toate variantele). Un element interactiv nou primește starea doar dacă trece prin aceste primitive.

## Fluid

Fumul WebGL de pe toată pagina (DESIGN.md §10, ANIMATIONS.md „`fluid`”). Fără props. **Inclus o singură dată, în `BaseLayout`**; nu se folosește în secțiuni.

```astro
<Fluid />
```

- Gazdă goală: `data-anim="fluid"`, `transition:persist="fluid"`, `aria-hidden`, `pointer-events-none`, `fixed inset-x-0 top-0 h-lvh`, `z-fluid` (sub conținut, peste fundalul `body`).
- Canvas-ul îl adaugă `src/scripts/animations/fluid.ts` după LCP, doar cu WebGL, fără reduced motion și pe dispozitive care nu sunt slabe. Fără JS sau fără WebGL rămâne un `div` gol.
- Secțiunile nu au nevoie de nimic ca fumul să apară în spatele lor: e suficient să nu aibă fundal opac. Un fundal propriu (card, panou) acoperă fumul, ca în original.

