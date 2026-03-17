import { Link, useLocation } from "react-router-dom";
import { Instagram, Facebook, Mail } from "lucide-react";
import { useState } from "react";
import { apiFetch } from "@/lib/api";

export function Footer() {
  const location = useLocation();
  const pathname = location.pathname;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");

    try {
      await apiFetch("/newsletter", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      setMessage("Grazie per esserti iscritto!");
      (e.target as HTMLFormElement).reset();
    } catch (err: any) {
      setMessage(err.message || "Errore. Riprova più tardi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <>
      {/* Pre-Footer: Newsletter */}
      <section className="bg-brand-secondary text-brand-base py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto text-center">
            <h3 className="font-serif text-3xl font-semibold mb-4 text-brand-base">
              Rimaniamo in contatto
            </h3>
            <p className="text-base mb-8 opacity-90 font-medium">
              Iscriviti alla newsletter per ricevere aggiornamenti su nuovi
              percorsi, ritiri ed eventi speciali.
            </p>
            <form
              className="flex flex-col gap-2 max-w-md mx-auto"
              onSubmit={handleSubmit}
            >
              <div className="flex gap-2">
                <input
                  type="email"
                  name="email"
                  placeholder="La tua email"
                  className="flex-1 bg-white/10 border border-brand-base/20 rounded-md px-4 py-2 text-sm text-brand-base placeholder:text-brand-base/60 focus:outline-none focus:ring-2 focus:ring-brand-base/50"
                  required
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-brand-base hover:bg-white transition-colors text-brand-secondary px-6 py-2 rounded-md text-sm font-medium disabled:opacity-50"
                >
                  {isSubmitting ? "..." : "Iscriviti"}
                </button>
              </div>
              {message && (
                <p className="text-sm text-center mt-2 font-medium bg-white/40 p-2 rounded text-brand-contrast">
                  {message}
                </p>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* Main Footer Content */}
      <footer className="bg-brand-primary text-brand-base pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            {/* Column 1: Brand Info */}
            <div>
              <Link
                to="/"
                className="font-serif text-2xl font-semibold block mb-4"
              >
                Stefania Mastroianni
              </Link>
              <p className="text-sm opacity-80 mb-4 max-w-xs">
                Operatrice per la Salute e il Benessere. Ritrova il tuo
                equilibrio psicofisico attraverso percorsi consapevoli.
              </p>
              <p className="text-xs opacity-60">P.IVA: [INSERIRE_PIVA_QUI]</p>
            </div>

            {/* Column 2: Social & Contact */}
            <div>
              <h4 className="font-serif text-lg font-medium mb-4">Contatti</h4>
              <div className="flex flex-col gap-3">
                <a
                  href="mailto:info@stefaniamastroianni.com"
                  className="flex items-center gap-2 text-sm opacity-80 hover:opacity-100 transition-opacity"
                >
                  <Mail size={16} />
                  info@stefaniamastroianni.com
                </a>
                <div className="flex items-center gap-4 mt-2">
                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="opacity-80 hover:opacity-100 transition-opacity"
                    aria-label="Instagram"
                  >
                    <Instagram size={20} />
                  </a>
                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="opacity-80 hover:opacity-100 transition-opacity"
                    aria-label="Facebook"
                  >
                    <Facebook size={20} />
                  </a>
                </div>
              </div>
            </div>

            {/* Column 3: Quick Links */}
            <div>
              <h4 className="font-serif text-lg font-medium mb-4">Esplora</h4>
              <div className="flex flex-col gap-2 text-sm opacity-80">
                <Link
                  to="/"
                  className="hover:underline hover:text-brand-secondary w-fit"
                >
                  Home
                </Link>
                <Link
                  to="/chi-sono"
                  className="hover:underline hover:text-brand-secondary w-fit"
                >
                  Chi Sono
                </Link>
                <Link
                  to="/contatti"
                  className="hover:underline hover:text-brand-secondary w-fit"
                >
                  Contatti
                </Link>
                <div className="h-2" /> {/* Spacer */}
                <Link
                  to="/privacy-policy"
                  className="hover:underline text-xs opacity-80 w-fit"
                >
                  Privacy Policy
                </Link>
                <Link
                  to="/cookie-policy"
                  className="hover:underline text-xs opacity-80 w-fit"
                >
                  Cookie Policy
                </Link>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center text-xs opacity-50 pt-8 border-t border-white/10">
            <p>
              &copy; {new Date().getFullYear()} Stefania Mastroianni. Tutti i
              diritti riservati.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
