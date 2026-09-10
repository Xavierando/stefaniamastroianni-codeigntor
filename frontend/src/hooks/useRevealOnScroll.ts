import { useEffect, useLayoutEffect, useState } from "react";

const MOBILE_QUERY = "(max-width: 767px)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const SCROLL_THRESHOLD = 8;

// Il prerender gira senza DOM: la variante layout esiste solo lato client.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function isMobileViewport() {
  return window.matchMedia(MOBILE_QUERY).matches;
}

export function prefersReducedMotion() {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

export function isAtPageTop() {
  return window.scrollY <= SCROLL_THRESHOLD;
}

/**
 * Su mobile nasconde il contenuto al caricamento e lo rivela al primo scroll.
 * Una volta rivelato non torna piu invisibile. Su desktop, con reduced motion
 * o se la pagina apre gia scrollata, il contenuto e visibile da subito.
 */
export function useRevealOnScroll() {
  // Il primo render (server e client) e visibile: l'effetto di layout nasconde
  // prima del paint, cosi non c'e flash e il prerender resta leggibile.
  const [hidden, setHidden] = useState(false);

  useIsomorphicLayoutEffect(() => {
    if (!isMobileViewport() || prefersReducedMotion() || !isAtPageTop()) return;

    setHidden(true);

    const onScroll = () => {
      if (isAtPageTop()) return;
      setHidden(false);
      window.removeEventListener("scroll", onScroll);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return !hidden;
}
