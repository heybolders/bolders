import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";

import { MEDIA_CONDITIONS, readConditions } from "@/scripts/animations/conditions";
import { DURATION, readNumber } from "@/scripts/animations/timing";
import type { AnimationFactory } from "@/scripts/animations/types";

/**
 * Rândurile urcă din mască. Titlurile de sus pornesc imediat (sunt deja trecute de `start`),
 * cele de mai jos la intrarea în ecran. Modificatori: data-anim-start, -delay, -stagger.
 */
export const lineReveal: AnimationFactory = (el, { mm }) => {
  const start = el.dataset["animStart"] ?? "top 90%";
  const delay = readNumber(el.dataset["animDelay"], 0);

  mm.add(MEDIA_CONDITIONS, (context) => {
    const { isMobile, reduceMotion } = readConditions(context);
    if (reduceMotion) return;

    const stagger = readNumber(el.dataset["animStagger"], isMobile ? 0.06 : 0.08);

    // autoSplit: rândurile se recalculează după încărcarea fontului și la redimensionare;
    // animația returnată e sincronizată de SplitText la fiecare re-split
    SplitText.create(el, {
      type: "lines",
      mask: "lines",
      // masca primește clasa `line-mask` (global.css)
      linesClass: "line",
      autoSplit: true,
      onSplit: (self) =>
        gsap.from(self.lines, {
          // 130: linia pornește complet sub zona de clip lărgită de .line-mask
          yPercent: 130,
          duration: DURATION.slow,
          ease: "expo.out",
          stagger,
          delay,
          scrollTrigger: { trigger: el, start, once: true },
        }),
    });
  });

  return undefined;
};
