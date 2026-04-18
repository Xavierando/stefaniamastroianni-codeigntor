import { Hero } from "@/components/ui/Hero";
import { SEO } from "@/components/common/SEO";
import { PageIntroduction } from "@/components/sections/PageIntroduction";
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

      <PageIntroduction
        title="Mettiamoci in Contatto"
        description="Ogni percorso inizia con una semplice conversazione. Sono qui per ascoltarti e rispondere a qualsiasi dubbio o domanda sui trattamenti e sui percorsi disponibili. Puoi utilizzare il modulo di contatto per richiedere informazioni sui percorsi indivudali, per iscriverti ai laboratori, o semplicemente per esplorare assieme come posso accompagnarti nel tuo momento attuale."
      />
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
                      Ricevo su appuntamento ad Ancona e provincia.
                      <br />
                      Disponibile anche per sessioni online via Zoom.
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
