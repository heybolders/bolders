// Texte globale (header, meniu, footer, 404). Sursa: reference/continut.md, „Global”.
// Textele de interfață marcate TODO(continut) nu există pe site-ul original și așteaptă confirmarea clientului.

export const SITE = {
  name: "Bolders",
  company: "Bolders Srl",
  /** pill-ul din hero, folosit ca descriere implicită */
  tagline: "Construim viitorul tău digital!",
  locale: "ro_RO",
} as const;

export const NAV_LABELS = {
  acasa: "Bolders",
  agentie: "Agenție",
  departamente: "Departamente",
  proiecte: "Proiecte",
  contact: "Contact",
  intrebariFrecvente: "Întrebări Frecvente",
  confidentialitate: "Confidențialitate",
  termeni: "Termeni și Condiții",
  cookies: "Politica Cookies",
} as const;

export const HEADER_TEXT = {
  cta: "Contact",
  // TODO(continut): etichete de accesibilitate, fără echivalent pe site-ul original
  skipLink: "Sari la conținut",
  logoLabel: "Bolders, pagina principală",
  navLabel: "Navigație principală",
  menuToggle: "Meniu",
} as const;

export const FOOTER_TEXT = {
  wordmark: "Bolders",
  // TODO(continut): etichete de accesibilitate
  navLabel: "Navigație footer",
  legalLabel: "Informații legale",
} as const;

// TODO(continut): pagina 404 nu există pe site-ul original
export const NOT_FOUND_TEXT = {
  code: "404",
  title: "Pagina nu există",
  description: "Pagina pe care o cauți nu există sau a fost mutată.",
  cta: "Înapoi la pagina principală",
} as const;
