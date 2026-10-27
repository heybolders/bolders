import { debug } from "@/scripts/animations/debug";
import type { AnimationFactory } from "@/scripts/animations/types";

// Numele permise sunt cele din docs/ANIMATIONS.md; câte un fișier per data-anim.
export const registry: Record<string, AnimationFactory> = {
  debug,
};
