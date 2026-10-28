import {
  hasFinePointer,
  isLowEndDevice,
  prefersReducedMotion,
  supportsWebGL,
} from "@/scripts/animations/capabilities";
import { MEDIA_CONDITIONS } from "@/scripts/animations/conditions";
import type { AnimationFactory, Cleanup } from "@/scripts/animations/types";

// Intrarea `data-anim="fluid"` din registry. Simularea (fluid.ts, singurul fișier cu WebGL) intră într-un chunk
// separat, cerut cu import() abia după LCP, deci bundle-ul inițial conține doar această verificare.

/**
 * LCP-ul final e de regulă un element care apare după o animație de intrare (subtitlul hero, ≈ 1.3 s), nu
 * primul candidat raportat, iar pauza dintre ei depășește 1 s. Încărcarea pornește după LCP_QUIET_MS fără
 * candidați noi, cel mult LCP_MAX_WAIT_MS după `load` (tab deschis în fundal: LCP nu se raportează).
 * Altfel chunk-ul fluid ar intra înaintea LCP-ului final și l-ar întârzia pe rețele lente.
 */
const LCP_QUIET_MS = 2000;
const LCP_MAX_WAIT_MS = 5000;
/** Browsere fără LCP în PerformanceObserver (Safari): după `load`, aceeași fereastră ca intrarea hero-ului. */
const NO_LCP_DELAY_MS = 2000;
/** requestIdleCallback: termenul maxim. Fallback-ul (Safari, fără rIC) doar cedează firul: LCP-ul e deja așteptat. */
const IDLE_TIMEOUT_MS = 2000;
const IDLE_FALLBACK_MS = 50;
/** FPS-ul nu s-a recuperat nici la rezoluția redusă: efectul rămâne oprit până se închide tab-ul. */
const SESSION_KEY = "bolders:fluid-off";
/** Opusul lui MEDIA_CONDITIONS.reduceMotion. */
const MOTION_OK = "(prefers-reduced-motion: no-preference)";

let offForSession = readSessionFlag();

function readSessionFlag(): boolean {
  try {
    return window.sessionStorage.getItem(SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

function turnOffForSession(): void {
  offForSession = true;
  try {
    window.sessionStorage.setItem(SESSION_KEY, "1");
  } catch {
    // stocarea blocată (navigare privată): rămâne doar flag-ul din memorie, valabil până la reîncărcare
  }
}

/** `load` + LCP stabilizat (vezi LCP_QUIET_MS), apoi un moment liber. Întoarce anularea. */
function afterLcpIdle(run: () => void): Cleanup {
  let cancelled = false;
  let idleId = 0;
  let timeoutId = 0;
  let capId = 0;
  let observer: PerformanceObserver | undefined;

  const idle = (): void => {
    if (cancelled) return;
    window.clearTimeout(timeoutId);
    window.clearTimeout(capId);
    observer?.disconnect();
    observer = undefined;
    // lib.dom declară requestIdleCallback mereu, dar Safari nu îl are
    if (typeof window.requestIdleCallback === "function") {
      idleId = window.requestIdleCallback(run, { timeout: IDLE_TIMEOUT_MS });
    } else {
      timeoutId = window.setTimeout(run, IDLE_FALLBACK_MS);
    }
  };

  const afterLoad = (): void => {
    if (cancelled) return;
    if (!PerformanceObserver.supportedEntryTypes.includes("largest-contentful-paint")) {
      timeoutId = window.setTimeout(idle, NO_LCP_DELAY_MS);
      return;
    }
    // fiecare candidat nou repornește fereastra de liniște; buffered: și cei de dinainte de abonare
    const restartQuiet = (): void => {
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(idle, LCP_QUIET_MS);
    };
    observer = new PerformanceObserver(restartQuiet);
    observer.observe({ type: "largest-contentful-paint", buffered: true });
    restartQuiet();
    capId = window.setTimeout(idle, LCP_MAX_WAIT_MS);
  };

  if (document.readyState === "complete") afterLoad();
  else window.addEventListener("load", afterLoad, { once: true });

  return () => {
    cancelled = true;
    window.removeEventListener("load", afterLoad);
    observer?.disconnect();
    window.clearTimeout(timeoutId);
    window.clearTimeout(capId);
    if (idleId !== 0) window.cancelIdleCallback(idleId);
  };
}

/**
 * Fumul WebGL pe toată pagina (ANIMATIONS.md „fluid”). Elementul e persistent (transition:persist), deci se
 * montează o singură dată pe sesiune; matchMedia îl oprește complet la activarea reduced motion și îl repornește
 * la dezactivare.
 */
export const fluid: AnimationFactory = (el, { mm }) => {
  // interogare simplă, nu obiect de condiții: gsap rulează callback-ul doar când condiția se potrivește și îl
  // anulează (cleanup-ul de mai jos) când nu mai e adevărată
  mm.add(MOTION_OK, () => {
    if (offForSession || prefersReducedMotion() || !supportsWebGL() || isLowEndDevice()) return;

    let active = true;
    let stop: Cleanup | undefined;
    const halt = (): void => {
      stop?.();
      stop = undefined;
    };

    const cancelWait = afterLcpIdle(() => {
      import("@/scripts/animations/fluid")
        .then(({ startFluid }) => {
          if (!active) return;
          stop = startFluid(el, {
            isMobile: () =>
              window.matchMedia(MEDIA_CONDITIONS.isMobile).matches || !hasFinePointer(),
            onGiveUp: () => {
              turnOffForSession();
              halt();
            },
          });
        })
        .catch((error: unknown) => {
          // chunk-ul nu s-a încărcat (rețea): pagina rămâne fără fum
          if (import.meta.env.DEV) console.warn("[fluid] modulul nu s-a încărcat:", error);
        });
    });

    return () => {
      active = false;
      cancelWait();
      halt();
    };
  });

  return undefined;
};
