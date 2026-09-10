import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";

interface RevealOnScrollProps {
  children: ReactNode;
  className?: string;
}

/**
 * Avvolge il testo introduttivo che su mobile appare allo scroll.
 * Il titolo della sezione va lasciato fuori: resta sempre visibile.
 */
export function RevealOnScroll({ children, className }: RevealOnScrollProps) {
  const revealed = useRevealOnScroll();

  return (
    <motion.div
      className={className}
      initial={false}
      animate={{ opacity: revealed ? 1 : 0, y: revealed ? 0 : 24 }}
      // Nascondere e istantaneo (accade prima del paint), apparire e animato.
      transition={
        revealed ? { duration: 0.9, ease: "easeOut" } : { duration: 0 }
      }
    >
      {children}
    </motion.div>
  );
}
