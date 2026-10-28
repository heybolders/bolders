import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

import { startAnchorScroll } from "@/scripts/animations/anchor-scroll";
import { registry } from "@/scripts/animations/registry";
import { startSmoothScroll, stopSmoothScroll } from "@/scripts/animations/smooth-scroll";
import type { Cleanup } from "@/scripts/animations/types";

export {
  hasFinePointer,
  isLowEndDevice,
  prefersReducedMotion,
  supportsWebGL,
} from "@/scripts/animations/capabilities";

interface Instance {
  ctx: gsap.Context;
  mm: gsap.MatchMedia;
  cleanup: Cleanup | undefined;
  persistent: boolean;
}

const instances = new Map<HTMLElement, Instance>();
let started = false;

function isPersistent(el: HTMLElement): boolean {
  return el.closest("[data-astro-transition-persist]") !== null;
}

function mount(el: HTMLElement): void {
  // elementele cu transition:persist supraviețuiesc swap-ului și nu se reanimează
  if (instances.has(el)) return;

  const name = el.dataset["anim"] ?? "";
  const factory = registry[name];
  if (!factory) {
    if (import.meta.env.DEV) console.warn(`[anim] data-anim="${name}" nu există în registry`, el);
    return;
  }

  const mm = gsap.matchMedia(el);
  const lenis = startSmoothScroll();
  let cleanup: Cleanup | undefined;
  const ctx = gsap.context(() => {
    cleanup = factory(el, { mm, lenis });
  }, el);

  instances.set(el, { ctx, mm, cleanup, persistent: isPersistent(el) });
}

function unmount(el: HTMLElement, instance: Instance): void {
  instance.cleanup?.();
  instance.mm.revert();
  instance.ctx.revert();
  instances.delete(el);
}

function init(): void {
  startSmoothScroll();
  document.querySelectorAll<HTMLElement>("[data-anim]").forEach(mount);
  ScrollTrigger.refresh();
}

function teardown(): void {
  for (const [el, instance] of instances) {
    if (!instance.persistent) unmount(el, instance);
  }
  // plasă de siguranță pentru trigger-e create în afara contextelor, doar dacă nu există
  // elemente persistente ale căror trigger-e trebuie să supraviețuiască swap-ului
  if (instances.size === 0) ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  stopSmoothScroll();
}

/** Se apelează o singură dată, din layout. Ciclul de viață urmează <ClientRouter />. */
export function startAnimations(): void {
  if (started) return;
  started = true;

  gsap.registerPlugin(ScrollTrigger, SplitText);

  document.addEventListener("astro:page-load", init);
  document.addEventListener("astro:before-swap", teardown);
  startAnchorScroll();

  // schimbarea preferinței în timpul sesiunii: Lenis pornește/se oprește, matchMedia se ocupă de restul
  window.matchMedia("(prefers-reduced-motion: reduce)").addEventListener("change", (event) => {
    if (event.matches) stopSmoothScroll();
    else startSmoothScroll();
  });
}
