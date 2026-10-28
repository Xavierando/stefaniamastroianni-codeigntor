import { SEO } from "@/components/common/SEO";
import { INSTAGRAM_URL, buildWhatsappUrl } from "@/config/site";
import { useSiteSettings } from "@/context/SiteSettingsContext";

/**
 * Mostrata al posto di qualunque pagina pubblica quando la manutenzione e
 * attiva dall'admin. Fuori dal MainLayout: niente menu ne footer, che
 * porterebbero a pagine comunque chiuse.
 */
export function Maintenance() {
  const { whatsappEnabled, whatsappHandle } = useSiteSettings();

  return (
    <>
      <SEO title="Sito in manutenzione" noindex />
      <main className="min-h-screen flex flex-col items-center justify-center bg-brand-base text-brand-contrast px-4 text-center">
        {/* Il logo e una maschera, come nella Navbar: prende il colore dello sfondo. */}
        <div
          role="img"
          aria-label="Stefania Mastroianni"
          className="w-20 h-20 mb-4 bg-brand-primary"
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
        <p className="font-serif text-xl tracking-wide text-brand-primary">Stefania</p>
        <p className="font-sans text-xs tracking-[0.25em] uppercase text-brand-primary/70 mb-12">
          Mastroianni
        </p>
        <h1 className="font-serif text-3xl md:text-4xl mb-4 text-brand-primary">
          Sito in manutenzione
        </h1>
        <p className="max-w-md mb-8 text-brand-contrast/80">
          Stiamo facendo qualche lavoro dietro le quinte. Il sito torna disponibile a breve:
          grazie per la pazienza.
        </p>
        <div className="flex flex-col items-center gap-2 text-brand-contrast/80">
          <a href="mailto:info@stefaniamastroianni.com" className="hover:text-brand-primary transition-colors">
            info@stefaniamastroianni.com
          </a>
          {whatsappEnabled && whatsappHandle && (
            <a
              href={buildWhatsappUrl(whatsappHandle)}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-brand-primary transition-colors"
            >
              Scrivimi su WhatsApp
            </a>
          )}
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-brand-primary transition-colors"
          >
            Instagram
          </a>
        </div>
      </main>
    </>
  );
}
