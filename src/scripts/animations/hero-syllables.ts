import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";

import { MEDIA_CONDITIONS, readConditions } from "@/scripts/animations/conditions";
import { DURATION } from "@/scripts/animations/timing";
import type { AnimationFactory } from "@/scripts/animations/types";

const SESSION_KEY = "bolders:hero-intro";
/** Clasa pusă de scriptul inline din Hero.astro înaintea primului paint. */
const PENDING_CLASS = "hero-pending";

// Repere ale secvenței complete (secunde de la montare), ANIMATIONS.md Homepage §1
const AT = {
  line: 0.3,
  syllables: 0.55,
  // subtitlul și butonul: 0.9 după începutul titlului
  after: 1.2,
  breath: 4,
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

/** O singură respirație 700 → 200 → 700; lățimea e rezervată de copia invizibilă la 700. */
function breathe(targets: NodeListOf<HTMLElement>, delay: number): void {
  gsap.fromTo(
    targets,
    { fontVariationSettings: "'wght' 700" },
    {
      fontVariationSettings: "'wght' 200",
      duration: DURATION.base,
      ease: "sine.inOut",
      stagger: 0.05,
      repeat: 1,
      yoyo: true,
      delay,
      immediateRender: false,
      clearProps: "fontVariationSettings",
    },
  );
}

/**
 * Pill → „Acum este momentul” (rânduri din mască) → silabele din mască → subtitlu și buton,
 * apoi o singură respirație pe axa wght. Secvența completă rulează o dată pe sesiune;
 * la revenire, un crossfade scurt.
 */
export const heroSyllables: AnimationFactory = (el, { mm }) => {
  const root = document.documentElement;
  const pill = el.querySelector<HTMLElement>('[data-hero-part="pill"]');
  const line = el.querySelector<HTMLElement>('[data-hero-part="line"]');
  const parts = el.querySelectorAll<HTMLElement>("[data-hero-part]");
  const after = el.querySelectorAll<HTMLElement>('[data-hero-part="after"]');
  const syllables = el.querySelectorAll<HTMLElement>("[data-hero-syllable]");
  const breath = el.querySelectorAll<HTMLElement>("[data-hero-breath]");

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
      // hero static: rămâne doar respirația, care nu ascunde nimic
      breathe(breath, Math.max(DURATION.base, AT.breath - performance.now() / 1000));
      return;
    }

    if (short) {
      gsap.from(parts, { opacity: 0, duration: SHORT_DURATION, ease: "power2.out" });
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

    gsap.from(syllables, {
      // 130: silaba pornește complet sub zona de clip lărgită de .line-mask
      yPercent: 130,
      duration: DURATION.slow,
      ease: "expo.out",
      stagger: isMobile ? 0.04 : 0.06,
      delay: AT.syllables,
    });

    gsap.from(after, { opacity: 0, duration: DURATION.base, ease: "power2.out", delay: AT.after });

    breathe(breath, AT.breath);
  });

  // starea inițială e setată sincron mai sus (from() randează imediat), deci se poate scoate masca globală
  root.classList.remove(PENDING_CLASS);

  return () => root.classList.remove(PENDING_CLASS);
};
