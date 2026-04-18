import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "Chi Sono", href: "/chi-sono" },
  { name: "Maternità", href: "/maternita" },
  { name: "Trattamenti", href: "/trattamenti" },
  { name: "Consulenze", href: "/consulenze" },
  { name: "Yoga", href: "/yoga-e-meditazione" },
  { name: "Eventi", href: "/laboratori-eventi" },
  { name: "Blog", href: "/blog" },
  { name: "Contatti", href: "/contatti" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const pathname = location.pathname;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed z-50 left-0 right-0 mx-auto px-4 sm:px-6 w-full max-w-7xl transition-all duration-700 ease-in-out flex justify-end xl:justify-center",
        scrolled ? "top-2" : "top-6",
      )}
    >
      <div
        className={cn(
          "relative flex items-center rounded-full transition-all duration-700 ease-in-out overflow-hidden shadow-soft h-14",
          scrolled || isOpen
            ? "w-full px-6 bg-brand-base/95 backdrop-blur-lg shadow-md border border-brand-contrast/5"
            : "w-[56px] bg-brand-base/80 backdrop-blur-md border border-transparent xl:w-full xl:px-6 xl:py-2",
        )}
      >
        {/* Logo / Wordmark (Expands behind the bolted hamburger) */}
        <Link
          to="/"
          className={cn(
            "flex items-center transition-all duration-700 ease-in-out hover:opacity-80 overflow-hidden shrink-0",
            scrolled || isOpen
              ? "max-w-[400px] gap-3 md:gap-4 opacity-100 pr-12 xl:pr-0"
              : "max-w-0 gap-0 opacity-0 xl:max-w-[400px] xl:gap-3 xl:md:gap-4 xl:opacity-100",
          )}
        >
          {/* Logo icon */}
          <div
            className="w-10 h-10 md:w-11 md:h-11 flex-shrink-0 bg-brand-primary"
            style={{
              WebkitMaskImage: "url(/images/logo.webp)",
              WebkitMaskSize: "contain",
              WebkitMaskRepeat: "no-repeat",
              WebkitMaskPosition: "center",
              maskImage: "url(/images/logo.webp)",
              maskSize: "contain",
              maskRepeat: "no-repeat",
              maskPosition: "center",
            }}
          />
          {/* Wordmark */}
          <div className="flex flex-col items-start justify-center flex-shrink-0">
            <span className="font-serif text-[1.05rem] md:text-xl leading-none text-brand-primary tracking-wide">
              Stefania
            </span>
            <span className="font-sans text-[0.6rem] md:text-xs leading-none text-brand-contrast/60 tracking-[0.25em] mt-1.5 uppercase font-medium">
              Mastroianni
            </span>
          </div>
          <div className="w-5 h-10 md:w-11 md:h-11 flex-shrink-0 " />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                "px-4 py-2.5 rounded-full text-[13px] uppercase tracking-wider font-bold transition-all duration-300",
                pathname === link.href
                  ? "bg-white shadow-sm text-brand-primary"
                  : "text-brand-contrast/60 hover:bg-white/50 hover:text-brand-contrast",
              )}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Mobile menu toggle (Calculated absolute center for 0px shift) */}
        <button
          className="absolute right-1 top-1 w-12 h-12 flex items-center justify-center text-brand-contrast focus:outline-none hover:bg-white/50 rounded-full transition-colors xl:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation Drawer (Floating) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 12 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute top-full left-4 right-4 bg-brand-base/98 backdrop-blur-xl border border-brand-contrast/5 rounded-[2rem] p-6 shadow-xl flex flex-col items-center gap-2 z-50 overflow-hidden"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "w-full text-center px-6 py-3 rounded-full text-lg font-bold transition-all duration-300",
                  pathname === link.href
                    ? "bg-white text-brand-primary shadow-sm"
                    : "text-brand-contrast/70 hover:bg-white/50 hover:text-brand-contrast",
                )}
              >
                {link.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
