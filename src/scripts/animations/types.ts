import type Lenis from "lenis";

export interface AnimationConditions {
  isDesktop: boolean;
  isMobile: boolean;
  reduceMotion: boolean;
}

export interface AnimationContext {
  mm: gsap.MatchMedia;
  lenis: Lenis | null;
}

export type Cleanup = () => void;

/** Contract din docs/ANIMATIONS.md: `registry[name](el, { mm, lenis }) => cleanup`. */
export type AnimationFactory = (el: HTMLElement, ctx: AnimationContext) => Cleanup | undefined;
