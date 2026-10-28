import type { AnimationConditions } from "@/scripts/animations/types";

// 768px = --breakpoint-md; sub el se aplică regulile de mobil din ANIMATIONS.md
export const MEDIA_CONDITIONS = {
  isDesktop: "(min-width: 48rem)",
  isMobile: "(max-width: 47.99rem)",
  reduceMotion: "(prefers-reduced-motion: reduce)",
} as const satisfies Record<keyof AnimationConditions, string>;

export function readConditions(context: gsap.Context): AnimationConditions {
  const c = context.conditions ?? {};
  return {
    isDesktop: c["isDesktop"] === true,
    isMobile: c["isMobile"] === true,
    reduceMotion: c["reduceMotion"] === true,
  };
}
