import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";

import { MEDIA_CONDITIONS, readConditions } from "@/scripts/animations/conditions";
import { DURATION } from "@/scripts/animations/timing";
import type { AnimationFactory } from "@/scripts/animations/types";

const SESSION_KEY = "bolders:hero-intro";
/** Emis pe secțiune când titlul e complet pe ecran; `smoke-text` pornește bucla după el. */
export const HERO_READY_EVENT = "hero:ready";
const READY_ATTR = "data-hero-ready";
/** Clasa pusă de scriptul inline din Hero.astro înaintea primului paint. */
const PENDING_CLASS = "hero-pending";

// Repere ale secvenței complete (secunde de la montare), ANIMATIONS.md Homepage §1
const AT = {
  line: 0.3,
  syllables: 0.55,
  // subtitlul și butonul: 0.9 după începutul titlului
  after: 1.2,
} as const;
const SHORT_DURATION = 0.4;

// Prima montare vine după încărcarea documentului; următoarele, după navigări prin router.
let initialMount = true;

function hasPlayed(): boolean {
  try {
    return sessionStorage.getItem(SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

function markPlayed(): void {
  try {
    sessionStorage.setItem(SESSION_KEY, "1");
  } catch {
    // stocare blocată: la următoarea vizită rulează din nou secvența completă
  }
}

/** Titlul e complet pe ecran (sau intrarea a fost sărită): atributul acoperă ascultătorii montați după. */
function markReady(el: HTMLElement): void {
  el.setAttribute(READY_ATTR, "");
  el.dispatchEvent(new CustomEvent(HERO_READY_EVENT));
}

/** Rulează `callback` după intrarea hero-ului; returnează funcția care anulează așteptarea. */
export function onHeroReady(hero: HTMLElement, callback: () => void): () => void {
  if (hero.hasAttribute(READY_ATTR)) {
    callback();
    return () => undefined;
  }
  hero.addEventListener(HERO_READY_EVENT, callback, { once: true });
  return () => hero.removeEventListener(HERO_READY_EVENT, callback);
}

/**
 * Pill → „Acum este momentul” (rânduri din mască) → silabele din mască → subtitlu și buton.
 * Secvența completă rulează o dată pe sesiune; la revenire, un crossfade scurt.
 * După intrare, „strălucești!” trece la `smoke-text` (HERO_READY_EVENT).
 */
export const heroSyllables: AnimationFactory = (el, { mm }) => {
  const root = document.documentElement;
  const pill = el.querySelector<HTMLElement>('[data-hero-part="pill"]');
  const line = el.querySelector<HTMLElement>('[data-hero-part="line"]');
  const parts = el.querySelectorAll<HTMLElement>("[data-hero-part]");
  const after = el.querySelectorAll<HTMLElement>('[data-hero-part="after"]');
  const words = el.querySelectorAll<HTMLElement>('[data-hero-part="word"]');
  const syllables = el.querySelectorAll<HTMLElement>("[data-hero-syllable]");

  // La încărcarea inițială, intrarea rulează doar dacă scriptul inline ține încă hero-ul ascuns.
  // Dacă bugetul a expirat, textul e deja pe ecran: ascunderea lui acum ar fi un flash.
  const intro = !initialMount || root.classList.contains(PENDING_CLASS);
  initialMount = false;
  const short = hasPlayed();
  // matchMedia rerulează callback-ul la trecerea pragului md: intrarea nu se repetă la resize
  let played = false;

  mm.add(MEDIA_CONDITIONS, (context) => {
    const { isMobile, reduceMotion } = readConditions(context);
    if (reduceMotion || played) return;
    played = true;

    if (!intro) {
      // hero static: textul e deja pe ecran, fumul poate porni
      markReady(el);
      return;
    }

    if (short) {
      gsap.from(parts, {
        opacity: 0,
        duration: SHORT_DURATION,
        ease: "power2.out",
        onComplete: () => markReady(el),
      });
      return;
    }

    markPlayed();

    if (pill)
      gsap.from(pill, { opacity: 0, yPercent: 40, duration: DURATION.base, ease: "expo.out" });

    if (line) {
      // autoSplit: rândurile se recalculează după încărcarea fontului; SplitText sincronizează
      // progresul animației returnate, deci re-split-ul nu repornește intrarea
      SplitText.create(line, {
        type: "lines",
        mask: "lines",
        // masca primește clasa `line-mask` (global.css)
        linesClass: "line",
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.lines, {
            yPercent: 130,
            duration: DURATION.slow,
            ease: "expo.out",
            stagger: isMobile ? 0.06 : 0.08,
            delay: AT.line,
          }),
      });
    }

    // Masca doar cât durează intrarea: clip-path (nu overflow), ca să nu atingă layout-ul, și scos la final,
    // ca fumul să poată ieși din rând (în sus la reapariție, spre dreapta la dispariție)
    gsap.set(words, { clipPath: "inset(0)" });
    gsap.from(syllables, {
      // 130: silaba pornește complet sub zona de clip lărgită de .line-mask
      yPercent: 130,
      duration: DURATION.slow,
      ease: "expo.out",
      stagger: isMobile ? 0.04 : 0.06,
      delay: AT.syllables,
      onComplete: () => {
        gsap.set(words, { clearProps: "clipPath" });
        markReady(el);
      },
    });

    gsap.from(after, { opacity: 0, duration: DURATION.base, ease: "power2.out", delay: AT.after });
  });

  // starea inițială e setată sincron mai sus (from() randează imediat), deci se poate scoate masca globală
  root.classList.remove(PENDING_CLASS);

  return () => root.classList.remove(PENDING_CLASS);
};
