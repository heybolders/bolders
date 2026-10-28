// Durate din docs/ANIMATIONS.md (Principii), în secunde.
export const DURATION = {
  fast: 0.2,
  base: 0.5,
  slow: 0.9,
  slower: 1.4,
} as const;

/**
 * Cursorul custom (DESIGN.md §9, ANIMATIONS.md „cursor”). Urmărirea e plafonată la 150 ms (originalul ajunge
 * la poziția finală în ≈ 375 ms); power2.out e cea mai apropiată curbă de apropierea exponențială din IX2
 * care ajunge exact la țintă. Stările: 200 ms, „ease” din IX2.
 */
export const CURSOR_TIMING = {
  follow: 0.15,
  followEase: "power2.out",
  state: DURATION.fast,
  stateEase: "power1.out",
} as const;

/** Citește un modificator numeric `data-anim-*`; valoarea implicită dacă lipsește sau e invalid. */
export function readNumber(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  return value === undefined || Number.isNaN(parsed) ? fallback : parsed;
}
