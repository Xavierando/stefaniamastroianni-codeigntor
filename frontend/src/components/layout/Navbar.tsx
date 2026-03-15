import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

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
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <header className="fixed top-0 z-50 w-full border-b border-brand-base/10 bg-brand-base/60 backdrop-blur-md transition-all">
      <div className="container mx-auto flex h-20 items-center justify-between">
        
        {/* Logo / Immagine */}
        <Link to="/" className="flex items-center gap-2 transition-transform hover:scale-105">
          <div className="relative w-16 h-16 md:w-20 md:h-20 flex-shrink-0">
            <img 
              src="/images/logo.webp" 
              alt="Stefania Mastroianni Logo" 
              className="w-full h-full object-contain filter invert brightness-0 opacity-80"
            />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center h-full">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                "h-full flex items-center px-4 text-base font-medium transition-colors duration-300",
                pathname === link.href 
                  ? "bg-brand-primary text-brand-base" 
                  : "text-brand-contrast hover:bg-brand-primary/10 hover:text-brand-primary"
              )}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Mobile menu toggle */}
        <button
          className="lg:hidden text-brand-contrast focus:outline-none hover:bg-brand-primary/10 p-2 rounded-full transition-colors"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {isOpen && (
        <div className="lg:hidden bg-brand-base/98 backdrop-blur-md absolute top-20 left-0 w-full h-[calc(100vh-5rem)] border-t border-brand-contrast/10 flex flex-col items-center pt-8 gap-4 shadow-xl overflow-y-auto pb-12">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setIsOpen(false)}
              className={cn(
                "px-8 py-3 rounded-full text-xl font-medium transition-all duration-300",
                pathname === link.href 
                  ? "bg-brand-primary text-brand-base shadow-sm" 
                  : "text-brand-contrast hover:bg-brand-primary/10 hover:text-brand-primary"
              )}
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
