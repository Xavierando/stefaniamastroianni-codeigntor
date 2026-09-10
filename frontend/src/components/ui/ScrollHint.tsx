import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  isAtPageTop,
  isMobileViewport,
  prefersReducedMotion,
} from "@/hooks/useRevealOnScroll";

const IDLE_DELAY_MS = 3000;

/**
 * Indicatore discreto di scroll: una pallina semitrasparente che simula il
 * gesto del dito. Solo mobile, compare dopo 3s di inattivita con la pagina in
 * cima e sparisce definitivamente al primo scroll.
 */
export function ScrollHint() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!isMobileViewport() || prefersReducedMotion() || !isAtPageTop()) return;

    const timer = setTimeout(() => setVisible(true), IDLE_DELAY_MS);

    const onScroll = () => {
      if (isAtPageTop()) return;
      clearTimeout(timer);
      setVisible(false);
      window.removeEventListener("scroll", onScroll);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="fixed inset-x-0 bottom-[18vh] z-30 flex justify-center pointer-events-none md:hidden"
        >
          <motion.span
            className="block h-11 w-11 rounded-full bg-brand-contrast/20 ring-1 ring-brand-contrast/10 backdrop-blur-[2px]"
            animate={{ y: [12, -24, -60], opacity: [0, 0.9, 0] }}
            transition={{
              duration: 1.6,
              times: [0, 0.45, 1],
              repeat: Infinity,
              repeatDelay: 0.8,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
