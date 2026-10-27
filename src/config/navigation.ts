import { NAV_LABELS } from "@/content/global";

// Sursa unică pentru rute: header, meniul mobil și footerul citesc de aici.
// News lipsește intenționat până la minimum 3 articole (reference/continut.md).

export interface NavLink {
  href: string;
  label: string;
  /** pagina nu există încă: fără prefetch, altfel hover-ul produce 404 în consolă */
  pending: boolean;
}

export const ROUTES = {
  acasa: "/",
  agentie: "/agentie",
  departamente: "/departamente",
  proiecte: "/proiecte",
  contact: "/contact",
  intrebariFrecvente: "/intrebari-frecvente",
  confidentialitate: "/confidentialitate",
  termeni: "/termeni",
  cookies: "/cookies",
} as const satisfies Record<keyof typeof NAV_LABELS, string>;

type RouteKey = keyof typeof ROUTES;

// TODO(continut): paginile legale se construiesc la Etapa 5; atunci lista se golește
const PENDING_ROUTES: ReadonlySet<RouteKey> = new Set(["confidentialitate", "termeni", "cookies"]);

function link(key: RouteKey): NavLink {
  return { href: ROUTES[key], label: NAV_LABELS[key], pending: PENDING_ROUTES.has(key) };
}

/** Header desktop și meniul mobil. */
export const PRIMARY_NAV: readonly NavLink[] = [
  link("agentie"),
  link("departamente"),
  link("proiecte"),
  link("contact"),
];

export const HEADER_CTA = ROUTES.contact;

/** Meniul mare din footer, pe rânduri, ca în original (fără News). */
export const FOOTER_NAV: readonly (readonly NavLink[])[] = [
  [link("agentie"), link("departamente"), link("proiecte"), link("contact")],
  [link("intrebariFrecvente"), link("confidentialitate")],
  [link("termeni"), link("cookies"), link("acasa")],
];

export const LEGAL_NAV: readonly NavLink[] = [
  link("confidentialitate"),
  link("termeni"),
  link("cookies"),
];

/** `/agentie`, `/agentie/` și `/agentie.html` reprezintă aceeași pagină. */
export function normalizePath(path: string): string {
  const clean = path.replace(/\.html$/, "").replace(/\/index$/, "/");
  return clean.length > 1 ? clean.replace(/\/$/, "") : "/";
}
