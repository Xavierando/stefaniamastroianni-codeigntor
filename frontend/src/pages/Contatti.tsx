import { Hero } from "@/components/ui/Hero";
import { SEO } from "@/components/common/SEO";
import { ContactForm } from "@/components/ui/ContactForm";
import { Mail, MapPin, Instagram, Facebook } from "lucide-react";

export function Contatti() {
  return (
    <>
      <SEO 
        title="Contatti" 
        description="Contatta Stefania Mastroianni per informazioni su percorsi, trattamenti o workshop. Prenota la tua consulenza o richiedi maggiori dettagli."
      />
      <div className="flex flex-col min-h-screen bg-brand-base">
      <Hero
        imageSrc="/images/contatti/mt-sample-background.webp"
        
      />

      <section className="w-full pb-24 pt-6 md:py-24 px-4 bg-brand-base text-center relative overflow-hidden">
        <div className="container mx-auto flex flex-col items-center max-w-6xl">
          <h1 className="font-serif mb-8 leading-tight text-4xl md:text-5xl text-brand-contrast">
            Entriamo in contatto
          </h1>

          <div className="text-brand-contrast/80 leading-relaxed font-light text-xl md:text-2xl space-y-6 max-w-4xl">
            <p>
              <strong className="font-semibold text-brand-contrast">
                Ogni percorso inizia con un incontro gratuito:
              </strong>{" "}
              uno spazio sicuro, in cui<br />
              <strong className="font-semibold text-brand-contrast">
                conoscerci e capire insieme di cosa hai bisogno ora
              </strong>
              .
            </p>
            <p>
              Tante possibilità diverse, tra cui sessioni individuali,
              trattamenti,
              <br />
              corsi di yoga, laboratori e tanto altro.
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
            <p className="italic">Grazie</p>
          </div>

          <blockquote className="mt-12 max-w-3xl border-l-2 border-brand-secondary/40 pl-6 text-left">
            <p className="font-serif italic font-semibold text-2xl md:text-3xl text-brand-primary leading-snug">
              «Non siamo fatti per rimanere nella sofferenza.
              <br />
              Siamo fatti per guarire.»
            </p>
            <footer className="mt-4 text-base md:text-lg text-brand-contrast/70 not-italic">
              —{" "}
              <strong className="font-semibold text-brand-contrast">
                Clarissa Pinkola Estés
              </strong>
              , scrittrice e psicoanalista messicana
            </footer>
          </blockquote>
        </div>
      </section>
      <section className="py-24 px-4 bg-white overflow-hidden relative">
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
            <div className="lg:col-span-3 bg-brand-base p-8 md:p-12 rounded-[2rem] shadow-soft relative overflow-hidden">
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
