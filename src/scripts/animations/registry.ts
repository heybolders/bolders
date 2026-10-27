import { lineReveal } from "@/scripts/animations/line-reveal";
import { nav } from "@/scripts/animations/nav";
import type { AnimationFactory } from "@/scripts/animations/types";
import { wordmark } from "@/scripts/animations/wordmark";

// Numele permise sunt cele din docs/ANIMATIONS.md; câte un fișier per data-anim.
export const registry: Record<string, AnimationFactory> = {
  "line-reveal": lineReveal,
  nav,
  wordmark,
};
