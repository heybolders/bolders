import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { prefersReducedMotion } from "@/scripts/animations/capabilities";
import { MEDIA_CONDITIONS, readConditions } from "@/scripts/animations/conditions";
import { getLenis } from "@/scripts/animations/smooth-scroll";
import { DURATION } from "@/scripts/animations/timing";
import type { AnimationFactory } from "@/scripts/animations/types";

// --breakpoint-lg: de aici în sus meniul mobil nu mai există
const DESKTOP_NAV = "(min-width: 62rem)";
const FOCUSABLE = "a[href], button:not([disabled])";

interface NavParts {
  bar: HTMLElement;
  toggle: HTMLButtonElement;
  menu: HTMLElement;
  logo: HTMLElement | null;
  logoMark: HTMLElement | null;
}

function queryParts(el: HTMLElement): NavParts | null {
  const bar = el.querySelector<HTMLElement>("[data-nav-bar]");
  const toggle = el.querySelector<HTMLButtonElement>("[data-nav-toggle]");
  const menu = el.querySelector<HTMLElement>("[data-nav-menu]");
  if (!bar || !toggle || !menu) return null;
  return {
    bar,
    toggle,
    menu,
    logo: el.querySelector<HTMLElement>("[data-nav-logo]"),
    logoMark: el.querySelector<HTMLElement>("[data-nav-logo-mark]"),
  };
}

/**
 * Header global (persistent): ascundere la scroll în jos, hover pe logo, meniul mobil.
 * Comportamentul meniului (ARIA, focus, Esc) funcționează și la reduced motion; doar mișcarea dispare.
 */
export const nav: AnimationFactory = (el, { mm }) => {
  const parts = queryParts(el);
  if (!parts) return undefined;
  const { bar, toggle, menu, logo, logoMark } = parts;

  const menuItems = Array.from(menu.querySelectorAll<HTMLElement>("[data-anim-item]"));
  const desktopQuery = window.matchMedia(DESKTOP_NAV);
  let menuOpen = false;
  let barHidden = false;

  function setBarHidden(hidden: boolean): void {
    if (hidden === barHidden) return;
    barHidden = hidden;
    gsap.to(bar, {
      yPercent: hidden ? -100 : 0,
      duration: DURATION.base,
      ease: "expo.out",
      overwrite: true,
    });
  }

  function resetBar(): void {
    barHidden = false;
    gsap.killTweensOf(bar);
    gsap.set(bar, { yPercent: 0 });
  }

  // restul paginii devine inert cât timp meniul e deschis; împreună cu capcana de Tab, focusul rămâne în header
  function setPageInert(inert: boolean): void {
    for (const child of Array.from(document.body.children)) {
      if (child !== el && child instanceof HTMLElement && child.tagName !== "SCRIPT")
        child.inert = inert;
    }
  }

  function lockScroll(locked: boolean): void {
    const lenis = getLenis();
    if (lenis) {
      if (locked) lenis.stop();
      else lenis.start();
    }
    // fără Lenis (reduced motion) scroll-ul nativ se oprește prin overflow
    document.documentElement.classList.toggle("overflow-hidden", locked && !lenis);
  }

  function openMenu(): void {
    if (menuOpen) return;
    menuOpen = true;
    toggle.setAttribute("aria-expanded", "true");
    menu.hidden = false;
    resetBar();
    setPageInert(true);
    lockScroll(true);

    gsap.killTweensOf([menu, ...menuItems]);
    if (prefersReducedMotion()) {
      gsap.set([menu, ...menuItems], { clearProps: "all" });
      return;
    }
    gsap.fromTo(menu, { autoAlpha: 0 }, { autoAlpha: 1, duration: DURATION.fast, ease: "none" });
    gsap.fromTo(
      menuItems,
      { yPercent: 110 },
      { yPercent: 0, duration: DURATION.slow, ease: "expo.out", stagger: 0.05, delay: 0.05 },
    );
  }

  function closeMenu({ instant = false, restoreFocus = false } = {}): void {
    if (!menuOpen) return;
    menuOpen = false;
    toggle.setAttribute("aria-expanded", "false");
    setPageInert(false);
    lockScroll(false);
    if (restoreFocus) toggle.focus();

    gsap.killTweensOf([menu, ...menuItems]);
    const hide = (): void => {
      menu.hidden = true;
      gsap.set([menu, ...menuItems], { clearProps: "all" });
    };
    if (instant || prefersReducedMotion()) hide();
    else gsap.to(menu, { autoAlpha: 0, duration: DURATION.fast, ease: "none", onComplete: hide });
  }

  function trapFocus(event: KeyboardEvent): void {
    const focusable = Array.from(el.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((node) =>
      node.checkVisibility(),
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (!first || !last) return;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  const onToggle = (): void => {
    if (menuOpen) closeMenu();
    else openMenu();
  };
  const onKeydown = (event: KeyboardEvent): void => {
    if (!menuOpen) return;
    if (event.key === "Escape") closeMenu({ restoreFocus: true });
    else if (event.key === "Tab") trapFocus(event);
  };
  // navigarea închide meniul înainte de swap, fără animație
  const onNavigate = (): void => closeMenu({ instant: true });
  const onDesktop = (event: MediaQueryListEvent): void => {
    if (event.matches) closeMenu({ instant: true });
  };
  // pagina nouă pornește de sus, deci headerul trebuie să fie vizibil
  const onSwap = (): void => resetBar();
  // tastatura nu trebuie să ajungă într-un header ascuns
  const onFocusIn = (): void => setBarHidden(false);

  toggle.addEventListener("click", onToggle);
  document.addEventListener("keydown", onKeydown);
  document.addEventListener("astro:before-preparation", onNavigate);
  document.addEventListener("astro:after-swap", onSwap);
  desktopQuery.addEventListener("change", onDesktop);
  el.addEventListener("focusin", onFocusIn);

  mm.add(MEDIA_CONDITIONS, (context) => {
    const { isDesktop, reduceMotion } = readConditions(context);
    if (reduceMotion) return;

    ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        if (menuOpen) return;
        setBarHidden(self.direction === 1 && self.scroll() > bar.offsetHeight);
      },
    });

    // hover pe logo: simbolul iese prin partea de sus a măștii și reintră de jos
    if (!isDesktop || !logo || !logoMark) return () => resetBar();
    const logoTl = gsap
      .timeline({ paused: true })
      .to(logoMark, { yPercent: -110, duration: 0.15, ease: "power2.in" })
      .set(logoMark, { yPercent: 110 })
      .to(logoMark, { yPercent: 0, duration: 0.3, ease: "expo.out" });
    const onLogoEnter = (): void => {
      if (!logoTl.isActive()) logoTl.restart();
    };
    logo.addEventListener("pointerenter", onLogoEnter);

    return () => {
      logo.removeEventListener("pointerenter", onLogoEnter);
      resetBar();
    };
  });

  return () => {
    closeMenu({ instant: true });
    toggle.removeEventListener("click", onToggle);
    document.removeEventListener("keydown", onKeydown);
    document.removeEventListener("astro:before-preparation", onNavigate);
    document.removeEventListener("astro:after-swap", onSwap);
    desktopQuery.removeEventListener("change", onDesktop);
    el.removeEventListener("focusin", onFocusIn);
  };
};
