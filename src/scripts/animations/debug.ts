import { gsap } from "gsap";

import { MEDIA_CONDITIONS, readConditions } from "@/scripts/animations/conditions";
import type { AnimationFactory } from "@/scripts/animations/types";

/**
 * Temporar (Etapa 2): confirmă că modulul pornește, că matchMedia raportează condițiile
 * și că GSAP rulează. Se șterge odată cu pagina de test.
 */
export const debug: AnimationFactory = (el, { mm, lenis }) => {
  const output = el.querySelector<HTMLElement>("[data-anim-item]") ?? el;
  const initialText = output.textContent;

  mm.add(MEDIA_CONDITIONS, (context) => {
    const { isDesktop, isMobile, reduceMotion } = readConditions(context);
    const flags = [
      isDesktop && "isDesktop",
      isMobile && "isMobile",
      reduceMotion && "reduceMotion",
      lenis ? "Lenis activ" : "scroll nativ",
    ].filter(Boolean);

    el.dataset["animStatus"] = "ready";
    output.textContent = `Modulul de animații a pornit · ${flags.join(" · ")}`;
    if (!reduceMotion) gsap.from(output, { opacity: 0, duration: 0.5, ease: "expo.out" });

    return () => {
      el.dataset["animStatus"] = "reverted";
    };
  });

  return () => {
    output.textContent = initialText;
  };
};
