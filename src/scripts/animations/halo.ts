import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { MEDIA_CONDITIONS, readConditions } from "@/scripts/animations/conditions";
import type { AnimationFactory } from "@/scripts/animations/types";

// Haloul pornește la opacitatea plină (= lumina statică din original, ce se vede și fără JS),
// deci nu există flash la montare: bucla doar îl stinge până la MIN_OPACITY și îl reaprinde.
const MIN_OPACITY = 0.35;
const SCALE = 1.08;
const DRIFT_PERCENT = 4;
const FALLBACK_CYCLE_S = 14;
// fracția din ciclu cu care se decalează halourile succesive (raportul de aur: faze care nu se repetă)
const PHASE_STEP = 0.618;

/** --halo-duration din @theme (global.css), în secunde. */
function readCycle(): number {
  const value = Number.parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue("--halo-duration"),
  );
  return Number.isNaN(value) || value <= 0 ? FALLBACK_CYCLE_S : value;
}

/**
 * Lumină difuză care se stinge și se reaprinde lent, cu derivă și scalare foarte lente.
 * Rulează doar cât haloul e în ecran și tab-ul e vizibil; will-change doar cât rulează.
 */
export const halo: AnimationFactory = (el, { mm }) => {
  const item = el.querySelector<HTMLElement>("[data-anim-item]");
  if (!item) return undefined;

  const index = Array.from(document.querySelectorAll('[data-anim="halo"]')).indexOf(el);
  const phase = (Math.max(index, 0) * PHASE_STEP) % 1;
  // direcții alternate, ca halourile vecine să nu derive în paralel
  const direction = index % 2 === 0 ? 1 : -1;

  mm.add(MEDIA_CONDITIONS, (context) => {
    const { isMobile, reduceMotion } = readConditions(context);
    // reduced motion: rămâne static, la opacitatea redusă din CSS (motion-reduce:opacity-60)
    if (reduceMotion) return;
    if (isMobile && el.hasAttribute("data-anim-desktop-only")) return;

    const cycle = readCycle();
    const half = cycle / 2;
    const timeline = gsap.timeline({
      paused: true,
      delay: phase * half,
      defaults: { ease: "sine.inOut", repeat: -1, yoyo: true },
    });
    // perioade diferite pentru opacitate, derivă și scalare: mișcarea nu se repetă identic la fiecare ciclu
    timeline
      .to(item, { opacity: MIN_OPACITY, duration: half }, 0)
      .to(
        item,
        {
          xPercent: DRIFT_PERCENT * direction,
          yPercent: -DRIFT_PERCENT * 0.6,
          duration: half * 1.7,
        },
        0,
      )
      .to(item, { scale: SCALE, duration: half * 1.3 }, 0);

    let inView = false;
    const update = (): void => {
      const running = inView && !document.hidden;
      if (running === !timeline.paused()) return;
      gsap.set(item, { willChange: running ? "transform, opacity" : "auto" });
      if (running) timeline.resume();
      else timeline.pause();
    };

    ScrollTrigger.create({
      trigger: el,
      start: "top bottom",
      end: "bottom top",
      onToggle: (self) => {
        inView = self.isActive;
        update();
      },
    });
    document.addEventListener("visibilitychange", update);

    return () => {
      document.removeEventListener("visibilitychange", update);
    };
  });

  return undefined;
};
