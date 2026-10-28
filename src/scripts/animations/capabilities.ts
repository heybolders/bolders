import { MEDIA_CONDITIONS } from "@/scripts/animations/conditions";

// Capabilitățile dispozitivului, citite de efectele reactivate (ANIMATIONS.md, „Efecte reactivate”)
// înainte să se monteze. Fiecare citire e ieftină și se face la apel, nu la import.

// Device Memory API există doar în browserele Chromium; lib.dom nu îl declară.
interface NavigatorWithDeviceMemory extends Navigator {
  readonly deviceMemory?: number;
}

const LOW_END_MEMORY_GB = 2;
const LOW_END_CORES = 4;

export function prefersReducedMotion(): boolean {
  return window.matchMedia(MEDIA_CONDITIONS.reduceMotion).matches;
}

/** Mouse sau trackpad: singurul caz în care are sens cursorul custom. */
export function hasFinePointer(): boolean {
  return window.matchMedia("(pointer: fine)").matches;
}

let webglSupport: boolean | undefined;

/**
 * WebGL2, cu fallback la WebGL1. Excepție documentată (.claude/rules/animations.md): singurul canvas
 * din afara fluid.ts, creat temporar doar pentru detecție, fără randare. Rezultatul se memorează,
 * ca să nu se creeze câte un context la fiecare apel.
 */
export function supportsWebGL(): boolean {
  if (webglSupport !== undefined) return webglSupport;
  try {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    webglSupport = context !== null;
    // eliberează contextul imediat; browserele limitează numărul de contexte active
    context?.getExtension("WEBGL_lose_context")?.loseContext();
  } catch {
    webglSupport = false;
  }
  return webglSupport;
}

/**
 * Dispozitiv slab: `deviceMemory ≤ 2` GB sau `hardwareConcurrency ≤ 4`, doar când valoarea e definită.
 * O valoare lipsă nu înseamnă dispozitiv slab: Safari și Firefox nu expun deviceMemory, iar iPhone-urile
 * nu trebuie excluse doar pentru că API-ul lipsește.
 */
export function isLowEndDevice(): boolean {
  const { deviceMemory, hardwareConcurrency } = navigator as NavigatorWithDeviceMemory;
  if (typeof deviceMemory === "number" && deviceMemory <= LOW_END_MEMORY_GB) return true;
  // hardwareConcurrency e 0 sau lipsește în unele medii restrânse: tratat ca necunoscut
  return (
    typeof hardwareConcurrency === "number" &&
    hardwareConcurrency > 0 &&
    hardwareConcurrency <= LOW_END_CORES
  );
}
