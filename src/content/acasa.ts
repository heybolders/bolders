// Texte homepage. Sursa: reference/continut.md, „Homepage”.
import { ROUTES } from "@/config/navigation";

export const HERO = {
  pill: "Construim viitorul tău digital!",
  title: {
    /** Manrope 700, ca tot H1-ul hero */
    light: "Acum este momentul",
    /** Manrope 700; cuvântul accentuat e împărțit în silabele originale */
    bold: "să",
    syllables: ["st", "ră", "lu", "ce", "șt", "i", "!"],
  },
  subtitle: "Afacerea ta merită mai mult decât să fie doar un nume pe internet.",
  cta: { label: "Hai să discutăm!", href: ROUTES.contact },
} as const;

/** Titlul complet, pentru screen readere (rândurile vizuale sunt împărțite în silabe). */
export const HERO_TITLE = `${HERO.title.light} ${HERO.title.bold} ${HERO.title.syllables.join("")}`;
