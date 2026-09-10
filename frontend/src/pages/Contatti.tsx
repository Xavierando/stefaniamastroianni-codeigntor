import { Hero } from "@/components/ui/Hero";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { SEO } from "@/components/common/SEO";
import { ContactForm } from "@/components/ui/ContactForm";
import { Mail, MapPin, Instagram, Facebook } from "lucide-react";
import { useContactCta } from "@/hooks/useContactCta";
import { useHashScroll } from "@/hooks/useHashScroll";
import { sectionBackground } from "@/lib/sectionBackground";

// lucide-react non include piu le icone dei brand: il glifo WhatsApp e inline.
function WhatsAppGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
    </svg>
  );
}

export function Contatti() {
  const { whatsappEnabled, contactTarget } = useContactCta();
  useHashScroll(true);

  // Le sezioni alternano gli sfondi: senza il blocco WhatsApp, quello dei
  // contatti scala di una posizione e si riprende il bianco.
  const contactSectionBg = sectionBackground(whatsappEnabled ? 2 : 1);
  const formCardBg = whatsappEnabled ? "bg-white" : "bg-brand-base";

  return (
    <>
      <SEO
        title="Contatti" 
        description="Contatta Stefania Mastroianni per informazioni su percorsi, trattamenti o workshop. Prenota la tua consulenza o richiedi maggiori dettagli."
      />
      <div className="flex flex-col min-h-screen bg-brand-base">
      <Hero
        imageSrc="/images/contatti/contatti-hero.webp"
        imageAlt="Due donne in un abbraccio silenzioso attorno a un albero in un bosco autunnale"
      />

      <section className="w-full pb-24 pt-6 md:py-24 px-4 bg-brand-base text-center relative overflow-hidden">
        <div className="container mx-auto flex flex-col items-center max-w-6xl">
          <h1 className="font-serif mb-8 leading-tight text-4xl md:text-5xl text-brand-contrast">
            Entriamo in contatto
          </h1>

          {/* Su mobile il testo appare allo scroll; il titolo resta visibile */}
          <RevealOnScroll className="flex flex-col items-center w-full">
            <div className="text-brand-contrast/80 leading-relaxed font-light text-lg md:text-xl space-y-6 max-w-4xl">
              <p>
                <strong className="font-semibold text-brand-contrast">
                  Ogni percorso inizia con un incontro gratuito:
                </strong>{" "}
                uno spazio sicuro,<br /> in cui {" "}
                <strong className="font-semibold text-brand-contrast">
                  conoscerci e capire insieme di cosa hai bisogno ora
                </strong>
                .
              </p>
              <p>
                Non devi avere le idee chiare. Basta{" "}
                <strong className="font-semibold text-brand-contrast">
                  il desiderio di iniziare
                </strong>
                .
                <br />
                Compila il modulo qui sotto.
              </p>
              <strong className="font-semibold text-brand-contrast"><p className="italic">Grazie</p></strong>
            </div>

            <blockquote className="mt-12 max-w-3xl border-l-2 border-brand-secondary/40 pl-6 text-left">
              <p className="font-serif italic font-semibold text-2xl md:text-3xl text-brand-primary leading-snug">
                «Non si puo raggiungere l'alba
                <br />
               senza passare per i sentieri della notte.»
              </p>
              <footer className="mt-4 text-base md:text-lg text-brand-contrast/70 not-italic">
                —{" "}
                <strong className="font-semibold text-brand-contrast">
                  Khalil Gibran
                </strong>
                , poeta e filosofo Sufi
              </footer>
            </blockquote>
          </RevealOnScroll>
        </div>
      </section>
      {whatsappEnabled && (
        <section className="w-full py-24 px-4 bg-white">
          <div className="container mx-auto max-w-3xl flex flex-col items-center text-center">
            <h2 className="font-serif text-3xl md:text-4xl text-brand-primary mb-6">
              Contattami su WhatsApp
            </h2>
            <p className="text-lg md:text-xl text-brand-contrast/80 leading-relaxed font-light mb-10">
              Preferisci scrivere due righe invece di compilare un modulo? Mandami
              un messaggio su WhatsApp: ti rispondo appena mi libero.
            </p>
            <a
              href={
                contactTarget(
                  "Ciao Stefania! Ti scrivo dal sito, vorrei qualche informazione.",
                ).href
              }
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 rounded-full font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary bg-accent-green-dark text-white hover:bg-accent-green-dark/90 h-14 px-10 text-lg shadow-sm"
            >
              <WhatsAppGlyph className="h-6 w-6" />
              Scrivimi su WhatsApp
            </a>
          </div>
        </section>
      )}

      <section className={`py-24 px-4 ${contactSectionBg} overflow-hidden relative`}>
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
            {/* Contact Info Side */}
            <div className="lg:col-span-2 space-y-12">
              <div className="space-y-6">
                <div className="flex items-start gap-4 text-brand-contrast">
                  <div className="bg-white p-3 rounded-full shadow-sm text-brand-secondary">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h4 className="font-medium text-lg">Email</h4>
                    <a
                      href="mailto:info@stefaniamastroianni.com"
                      className="opacity-80 hover:text-brand-secondary transition-colors"
                    >
                      info@stefaniamastroianni.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 text-brand-contrast">
                  <div className="bg-white p-3 rounded-full shadow-sm text-brand-secondary">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="font-medium text-lg">Studio Olistico</h4>
                    <p className="opacity-80">
                      Ricevo su appuntamento a Saint-Christophe e in vari altri
                      studi della Valle d'Aosta.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-brand-contrast/10">
                <h4 className="font-medium text-brand-contrast mb-4">
                  Seguimi sui social
                </h4>
                <div className="flex gap-4">
                  <a
                    href="#"
                    className="bg-white p-3 rounded-full shadow-sm text-brand-secondary hover:bg-brand-secondary hover:text-white transition-colors"
                    aria-label="Instagram"
                  >
                    <Instagram size={20} />
                  </a>
                  <a
                    href="#"
                    className="bg-white p-3 rounded-full shadow-sm text-brand-secondary hover:bg-brand-secondary hover:text-white transition-colors"
                    aria-label="Facebook"
                  >
                    <Facebook size={20} />
                  </a>
                </div>
              </div>
            </div>

            {/* Form Side */}
            <div
              id="modulo"
              className={`lg:col-span-3 ${formCardBg} p-8 md:p-12 rounded-[2rem] shadow-soft relative overflow-hidden scroll-mt-24`}
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent-green/10 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/3" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-secondary/5 rounded-full blur-3xl -z-10 -translate-x-1/3 translate-y-1/3" />

              <h3 className="font-serif text-2xl text-brand-primary mb-8 text-center md:text-left">
                Scrivimi un messaggio
              </h3>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}
