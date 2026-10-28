import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";

import { MEDIA_CONDITIONS, readConditions } from "@/scripts/animations/conditions";
import { onHeroReady } from "@/scripts/animations/hero-syllables";
import type { AnimationFactory } from "@/scripts/animations/types";

// Valori măsurate pe original (IX2 „heading [scroll in - change txt]”, ANIMATIONS.md „smoke-text”).
// Originalul animă 7 silabe la 80px; aici literele, cu deplasarea și blur-ul convertite în em,
// deci scad odată cu titlul pe mobil.
const SMOKE = {
  /** dispariția: blur 0 → 8px, x +160% din silabă (≈ 1.5em), opacitate 1 → 0 */
  exit: { duration: 0.5, blur: "blur(0.1em)", x: "1.5em" },
  /** reapariția: din y −100% (un rând), blur 6px → 0, opacitate 0 → 1 */
  enter: { duration: 0.4, blur: "blur(0.075em)", yPercent: -100 },
  ease: "circ.out",
  /** 100 ms pe silabă în original ≈ 50 ms pe literă */
  stagger: 0.05,
  /** textul complet pe ecran între două treceri */
  hold: 3,
} as const;

const SHARP = "blur(0em)";
const WILL_CHANGE = "transform, opacity, filter";

/**
 * Fum pe „strălucești!”: literele se dizolvă stânga → dreapta (blur, transparență, derivă spre dreapta),
 * apoi revin din ceață de sus, în aceeași ordine; pauză cu textul complet, apoi loop.
 * Pornește după intrarea hero-ului; se oprește când textul iese din ecran sau tab-ul e ascuns.
 */
export const smokeText: AnimationFactory = (el, { mm }) => {
  const hero = el.closest<HTMLElement>('[data-anim="hero-syllables"]');

  mm.add(MEDIA_CONDITIONS, (context) => {
    const { reduceMotion } = readConditions(context);
    if (reduceMotion) return;

    let timeline: gsap.core.Timeline | undefined;
    let chars: Element[] = [];
    let inView = true;

    const update = (): void => {
      if (!timeline) return;
      if (inView && !document.hidden) {
        timeline.resume();
      } else {
        timeline.pause();
        gsap.set(chars, { willChange: "auto" });
      }
    };

    // pornește asincron (după intrare): context.add înregistrează split-ul și timeline-ul în context,
    // ca revert-ul de la astro:before-swap / schimbarea condițiilor să le curețe
    const build = (): void => {
      // aria: "hidden" — literele generate sunt aria-hidden; numele accesibil e pe H1 (aria-label).
      // ș, ț, ă sunt caractere precompuse (U+0219, U+021B, U+0103), deci rămân câte o literă.
      const split = SplitText.create(el, { type: "chars", aria: "hidden" });
      chars = split.chars;

      timeline = gsap
        .timeline({ repeat: -1, delay: SMOKE.hold, paused: true })
        // will-change doar pe durata trecerii; în pauza cu textul complet straturile se eliberează
        .set(chars, { willChange: WILL_CHANGE })
        .fromTo(
          chars,
          // fără randare imediată: în pauza dinaintea primei treceri literele rămân fără filter
          { opacity: 1, x: 0, filter: SHARP, immediateRender: false },
          {
            opacity: 0,
            x: SMOKE.exit.x,
            filter: SMOKE.exit.blur,
            duration: SMOKE.exit.duration,
            ease: SMOKE.ease,
            stagger: SMOKE.stagger,
          },
        )
        .set(chars, { x: 0, yPercent: SMOKE.enter.yPercent, filter: SMOKE.enter.blur })
        .to(chars, {
          opacity: 1,
          yPercent: 0,
          filter: SHARP,
          duration: SMOKE.enter.duration,
          ease: SMOKE.ease,
          stagger: SMOKE.stagger,
        })
        .set(chars, { filter: "none", willChange: "auto" })
        .to({}, { duration: SMOKE.hold });

      update();
    };
    const start = (): void => {
      context.add(build);
    };

    const observer = new IntersectionObserver(([entry]) => {
      inView = entry?.isIntersecting ?? true;
      update();
    });
    observer.observe(el);
    document.addEventListener("visibilitychange", update);

    // fără hero (alt context), bucla pornește direct
    const cancelWait = hero ? onHeroReady(hero, start) : (start(), () => undefined);

    return () => {
      cancelWait();
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  });

  return undefined;
};
