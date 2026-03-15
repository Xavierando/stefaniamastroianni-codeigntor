import { useLocation, useOutlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { motion, AnimatePresence } from "framer-motion";

export function MainLayout() {
  const location = useLocation();
  const outlet = useOutlet();

  return (
    <div className="antialiased font-sans min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 w-full bg-brand-base relative z-10 flex flex-col overflow-hidden">
        <AnimatePresence mode="wait" onExitComplete={() => window.scrollTo(0, 0)}>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="w-full flex-1"
          >
            {outlet}
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}
