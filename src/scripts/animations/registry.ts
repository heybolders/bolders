import { cursor } from "@/scripts/animations/cursor";
import { fluid } from "@/scripts/animations/fluid-loader";
import { heroSyllables } from "@/scripts/animations/hero-syllables";
import { lineReveal } from "@/scripts/animations/line-reveal";
import { nav } from "@/scripts/animations/nav";
import { smokeText } from "@/scripts/animations/smoke-text";
import type { AnimationFactory } from "@/scripts/animations/types";
import { wordmark } from "@/scripts/animations/wordmark";

// Numele permise sunt cele din docs/ANIMATIONS.md; câte un fișier per data-anim.
export const registry: Record<string, AnimationFactory> = {
  cursor,
  // încărcătorul leneș: simularea WebGL (fluid.ts) vine cu import() după LCP
  fluid,
  "hero-syllables": heroSyllables,
  "line-reveal": lineReveal,
  nav,
  "smoke-text": smokeText,
  wordmark,
};
