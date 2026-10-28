import { gsap } from "gsap";

import { hasFinePointer, hasHover, prefersReducedMotion } from "@/scripts/animations/capabilities";
import { POINTER_CONDITIONS } from "@/scripts/animations/conditions";
import { CURSOR_TIMING } from "@/scripts/animations/timing";
import type { AnimationFactory } from "@/scripts/animations/types";

// Valori măsurate pe original (IX2 „Cursor”, „Link Hover In/Out”): DESIGN.md §9.
// Duratele: CURSOR_TIMING (timing.ts); dimensiunile și culoarea: tokenii din @theme (Cursor.astro).

/** Zonele unde rămâne cursorul sistemului; aceeași listă ca excepția .has-custom-cursor din global.css. */
const NATIVE_CURSOR =
  'input, textarea, select, [contenteditable]:not([contenteditable="false"]), iframe';
const ROOT_ACTIVE = "has-custom-cursor";
const ROOT_SELECTING = "is-selecting-text";

type Hover = "default" | "button" | "link";

function readHover(target: Element | null): Hover {
  const kind = target?.closest<HTMLElement>("[data-cursor]")?.dataset["cursor"];
  return kind === "button" || kind === "link" ? kind : "default";
}

/**
 * Punctul alb care urmărește mouse-ul (desktop, mouse + hover, fără reduced motion). Pe butoane dispare
 * (feedback-ul e punctul lime al butonului), pe linkuri se estompează într-o lumină de 6rem.
 * Cursorul sistemului se ascunde doar după inițializare, la prima mișcare a mouse-ului (clasa de pe <html>),
 * și revine pe câmpuri de formular, text editabil, iframe-uri și în timpul selecției.
 * Elementul e persistent (transition:persist), deci se montează o singură dată pe sesiune.
 */
export const cursor: AnimationFactory = (el, { mm }) => {
  const dot = el.querySelector<HTMLElement>("[data-cursor-dot]");
  const glow = el.querySelector<HTMLElement>("[data-cursor-glow]");
  if (!dot || !glow) return undefined;

  // matchMedia reevaluează la orice schimbare (mouse conectat la o tabletă, reduced motion activat)
  mm.add(POINTER_CONDITIONS, () => {
    if (!hasFinePointer() || !hasHover() || prefersReducedMotion()) return;

    const root = document.documentElement;
    const { follow, followEase, state: stateDuration, stateEase } = CURSOR_TIMING;
    // lumina pornește de la mărimea punctului (raportul tokenilor size-cursor / size-cursor-glow), ca pe linkuri
    // să crească din punct, ca în original (1rem → 6rem); citit o dată, la montare
    const restScale = dot.offsetWidth / glow.offsetWidth;

    // pe butoane punctul și lumina rămân în starea implicită: dispare tot wrapper-ul (syncVisibility), deci
    // peste umplerea lime nu ajunge nimic inversat de mix-blend-difference
    const DEFAULT = { dot: { opacity: 1 }, glow: { opacity: 0, scale: restScale } };
    const STATES = {
      default: DEFAULT,
      button: DEFAULT,
      link: { dot: { opacity: 0 }, glow: { opacity: 1, scale: 1 } },
    } as const satisfies Record<Hover, { dot: gsap.TweenVars; glow: gsap.TweenVars }>;

    gsap.set(dot, STATES.default.dot);
    gsap.set(glow, STATES.default.glow);
    const xTo = gsap.quickTo(el, "x", { duration: follow, ease: followEase });
    const yTo = gsap.quickTo(el, "y", { duration: follow, ease: followEase });

    let hover: Hover = "default";
    let inWindow = false;
    let native = false;
    let pressed = false;
    let selecting = false;
    let shown = false;
    let active = false;

    const setHover = (next: Hover): void => {
      if (next === hover) return;
      hover = next;
      const vars = { duration: stateDuration, ease: stateEase, overwrite: "auto" } as const;
      gsap.to(dot, { ...STATES[next].dot, ...vars });
      gsap.to(glow, { ...STATES[next].glow, ...vars });
    };

    const syncVisibility = (): void => {
      const next = inWindow && !native && !selecting && hover !== "button";
      if (next === shown) return;
      shown = next;
      gsap.to(el, {
        opacity: next ? 1 : 0,
        duration: stateDuration,
        ease: stateEase,
        overwrite: "auto",
      });
    };

    const onMove = (event: PointerEvent): void => {
      if (event.pointerType === "touch") return;
      const { clientX, clientY } = event;
      // prima mișcare (sau revenirea în fereastră): punctul apare direct sub mouse, fără să alunece din 0,0
      if (inWindow) {
        xTo(clientX);
        yTo(clientY);
      } else {
        xTo(clientX, clientX);
        yTo(clientY, clientY);
        inWindow = true;
      }
      // cursorul sistemului se ascunde abia când punctul îl poate înlocui (nu la încărcare, cu mouse-ul nemișcat)
      if (!active) {
        active = true;
        root.classList.add(ROOT_ACTIVE);
      }
      syncVisibility();
    };

    // delegare: un singur listener pentru toate butoanele și linkurile (data-cursor pe Button / TextLink)
    const onOver = (event: PointerEvent): void => {
      if (event.pointerType === "touch") return;
      const target = event.target instanceof Element ? event.target : null;
      native = target?.closest(NATIVE_CURSOR) != null;
      setHover(readHover(target));
      syncVisibility();
    };

    // relatedTarget null = mouse-ul a ieșit din document (fereastră sau iframe)
    const onOut = (event: PointerEvent): void => {
      if (event.relatedTarget !== null) return;
      inWindow = false;
      syncVisibility();
    };

    const onDown = (event: PointerEvent): void => {
      if (event.pointerType === "touch") {
        inWindow = false;
        syncVisibility();
        return;
      }
      pressed = true;
    };

    const onUp = (): void => {
      pressed = false;
      if (!selecting) return;
      selecting = false;
      root.classList.remove(ROOT_SELECTING);
      syncVisibility();
    };

    // selecție cu mouse-ul apăsat: cursorul de text al sistemului e mai precis decât punctul
    const onSelectionChange = (): void => {
      if (!pressed || selecting || document.getSelection()?.isCollapsed !== false) return;
      selecting = true;
      root.classList.add(ROOT_SELECTING);
      syncVisibility();
    };

    // ClientRouter înlocuiește atributele de pe <html> la fiecare navigare
    const onAfterSwap = (): void => {
      root.classList.toggle(ROOT_ACTIVE, active);
      root.classList.toggle(ROOT_SELECTING, selecting);
      // după un click pe buton, punctul ascuns reapare pe pagina nouă
      setHover("default");
      syncVisibility();
    };

    const passive = { passive: true } as const;
    document.addEventListener("pointermove", onMove, passive);
    document.addEventListener("pointerover", onOver, passive);
    document.addEventListener("pointerout", onOut, passive);
    document.addEventListener("pointerdown", onDown, passive);
    document.addEventListener("pointerup", onUp, passive);
    document.addEventListener("selectionchange", onSelectionChange);
    document.addEventListener("astro:after-swap", onAfterSwap);

    return () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerout", onOut);
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointerup", onUp);
      document.removeEventListener("selectionchange", onSelectionChange);
      document.removeEventListener("astro:after-swap", onAfterSwap);
      root.classList.remove(ROOT_ACTIVE, ROOT_SELECTING);
      // tween-urile din handler-e nu sunt înregistrate în context, deci revert-ul nu le anulează:
      // fără curățarea explicită, punctul ar rămâne vizibil peste cursorul sistemului (ex. reduced motion activat)
      gsap.killTweensOf([el, dot, glow]);
      gsap.set([el, dot, glow], { clearProps: "all" });
    };
  });

  return undefined;
};
