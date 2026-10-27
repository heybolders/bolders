// Durate din docs/ANIMATIONS.md (Principii), în secunde.
export const DURATION = {
  fast: 0.2,
  base: 0.5,
  slow: 0.9,
  slower: 1.4,
} as const;

/** Citește un modificator numeric `data-anim-*`; valoarea implicită dacă lipsește sau e invalid. */
export function readNumber(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  return value === undefined || Number.isNaN(parsed) ? fallback : parsed;
}
