import { normalizePath } from "@/config/navigation";
import { getLenis } from "@/scripts/animations/smooth-scroll";

// spațiu liber sub header, ca ținta să nu se lipească de pill
const GAP = 16;

function headerOffset(): number {
  const bar = document.querySelector<HTMLElement>("[data-nav-bar]");
  return (bar?.getBoundingClientRect().height ?? 0) + GAP;
}

function findSamePageTarget(event: MouseEvent): { target: HTMLElement; hash: string } | null {
  if (event.defaultPrevented || event.button !== 0) return null;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return null;
  if (!(event.target instanceof Element)) return null;

  const link = event.target.closest("a[href*='#']");
  if (!(link instanceof HTMLAnchorElement)) return null;
  const url = new URL(link.href);
  if (!url.hash || url.origin !== window.location.origin) return null;
  if (normalizePath(url.pathname) !== normalizePath(window.location.pathname)) return null;

  const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
  return target ? { target, hash: url.hash } : null;
}

/**
 * Linkurile cu ancoră din aceeași pagină trec prin Lenis (cu offset pentru header); fără Lenis
 * (reduced motion) saltul e instant. Rulează în capture, înaintea routerului Astro.
 */
function onClick(event: MouseEvent): void {
  const found = findSamePageTarget(event);
  if (!found) return;
  event.preventDefault();

  const { target, hash } = found;
  const offset = headerOffset();
  const lenis = getLenis();
  if (lenis) lenis.scrollTo(target, { offset: -offset });
  else window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset });

  // replaceState: routerul Astro își ține indexul de navigare în history.state
  history.replaceState(history.state, "", hash);
  // focusul urmează ancora (skip link, cuprins), fără un al doilea salt
  if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
  target.focus({ preventScroll: true });
}

export function startAnchorScroll(): void {
  document.addEventListener("click", onClick, { capture: true });
}
