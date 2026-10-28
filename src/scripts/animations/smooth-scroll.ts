import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

import { prefersReducedMotion } from "@/scripts/animations/capabilities";

let lenis: Lenis | null = null;

function tick(time: number): void {
  // gsap.ticker dă secunde, Lenis așteaptă milisecunde
  lenis?.raf(time * 1000);
}

/** O singură instanță; la reduced motion rămâne scroll-ul nativ. */
export function startSmoothScroll(): Lenis | null {
  if (lenis || prefersReducedMotion()) return lenis;

  lenis = new Lenis({
    lerp: 0.1,
    wheelMultiplier: 1,
    syncTouch: false,
    autoRaf: false,
  });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add(tick);
  // fără lag smoothing, scrub-ul rămâne sincron cu poziția Lenis după un cadru lent
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

/**
 * Instanța curentă. Elementele persistente (header) o citesc la momentul acțiunii, nu la montare:
 * Lenis se recreează la fiecare navigare, deci referința primită la montare devine învechită.
 */
export function getLenis(): Lenis | null {
  return lenis;
}

export function stopSmoothScroll(): void {
  if (!lenis) return;
  gsap.ticker.remove(tick);
  gsap.ticker.lagSmoothing(500, 33);
  lenis.destroy();
  lenis = null;
}
