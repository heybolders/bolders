import { normalizePath } from "@/config/navigation";

// Headerul și footerul au transition:persist, deci HTML-ul lor nu se re-randează la navigare:
// starea „pagina curentă” trebuie sincronizată pe client după fiecare swap.
function syncCurrentLinks(): void {
  const current = normalizePath(window.location.pathname);
  document.querySelectorAll<HTMLAnchorElement>("a[data-nav-link]").forEach((link) => {
    const isCurrent = normalizePath(new URL(link.href).pathname) === current;
    if (isCurrent) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
}

let started = false;

/** Se apelează o singură dată, din layout. */
export function startCurrentPage(): void {
  if (started) return;
  started = true;
  document.addEventListener("astro:page-load", syncCurrentLinks);
}
