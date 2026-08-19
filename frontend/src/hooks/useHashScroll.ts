import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Scrolls to the element matching the current URL hash (e.g. #servizio-xyz)
 * once the page is ready. Pages gate their content behind a loader and fetch
 * data async, so we can't rely on the browser's native hash scrolling — the
 * target element isn't in the DOM at navigation time. Call this with the
 * page's `isReady` flag: the scroll fires only after content is rendered.
 */
export function useHashScroll(ready: boolean) {
  const { hash } = useLocation();

  useEffect(() => {
    if (!ready || !hash) return;

    const id = decodeURIComponent(hash.slice(1));
    // Wait a frame so layout (and the opacity/height transition) is settled
    // before measuring the target's position.
    const raf = requestAnimationFrame(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });

    return () => cancelAnimationFrame(raf);
  }, [ready, hash]);
}
