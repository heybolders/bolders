import { gsap } from "gsap";

import { MEDIA_CONDITIONS, readConditions } from "@/scripts/animations/conditions";
import type { AnimationFactory } from "@/scripts/animations/types";

/** Wordmark-ul din footer urcă din mască, legat de scroll. Footerul e persistent: se montează o dată. */
export const wordmark: AnimationFactory = (el, { mm }) => {
  const item = el.querySelector<HTMLElement>("[data-anim-item]");
  if (!item) return undefined;

  mm.add(MEDIA_CONDITIONS, (context) => {
    const { isMobile, reduceMotion } = readConditions(context);
    if (reduceMotion) return;

    gsap.from(item, {
      yPercent: isMobile ? 40 : 60,
      ease: "none",
      scrollTrigger: { trigger: el, start: "top bottom", end: "bottom bottom", scrub: true },
    });
  });

  return undefined;
};
