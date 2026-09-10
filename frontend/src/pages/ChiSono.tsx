import { useEffect, useState } from "react";
import { Hero } from "@/components/ui/Hero";
import { ArrowRight, BookOpen, Sun } from "lucide-react";
import { SEO } from "@/components/common/SEO";
import { Link } from "react-router-dom";
import { apiFetch } from "@/lib/api";
import { useImagePreloader } from "@/hooks/useImagePreloader";
import { PageIntroduction } from "@/components/sections/PageIntroduction";
import { Category } from "../types";

// Each service belongs to a category; the card links to that category page.
const CATEGORY_ROUTES: Record<string, string> = {
  [Category.MATERNITA]: "/maternita",
  [Category.TRATTAMENTI]: "/trattamenti",
  [Category.CONSULENZE]: "/consulenze",
  [Category.YOGA]: "/yoga-e-meditazione",
  [Category.EVENTI]: "/laboratori-eventi",
  [Category.ALTRI]: "/contatti",
};

export function ChiSono() {
  const isHeroLoaded = useImagePreloader("/images/chi-sono/chi-sono-hero.webp");
  const [isPracticesHovered, setIsPracticesHovered] = useState(false);
  const [services, setServices] = useState<any[]>([]);

  const isReady = isHeroLoaded;

  useEffect(() => {
    let ignore = false;
    apiFetch("/services")
      .then((res) => {
        if (!ignore) setServices(res || []);
      })
      .catch((err) => console.error("Failed to fetch services:", err));
    return () => {
      ignore = true;
    };
  }, []);

  // Repeat the real services enough to fill wide screens, then duplicate the
  // whole set so the -50% marquee translation loops seamlessly (same technique
  // as the home MarqueeGallery).
  const serviceMultiplier = Math.max(1, Math.ceil(12 / (services.length || 1)));
  const servicesSet = Array.from({ length: serviceMultiplier }).flatMap(
    () => services,
  );
  const marqueeServices = [...servicesSet, ...servicesSet];

  return (
    <>
      <SEO 
        title="Chi Sono" 
        description="Conosci di più su Stefania Mastroianni, il suo percorso, la sua formazione e la visione olistica che guida il suo lavoro con le persone."
      />
      {!isReady && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-brand-base items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
        </div>
      )}
      <div
        className={`flex flex-col min-h-screen bg-brand-base transition-opacity duration-500 ${!isReady ? "opacity-0 h-screen overflow-hidden" : "opacity-100"}`}
      >
        {/* 1. Hero Section (Cover Layout) */}
        <Hero
          imageSrc="/images/chi-sono/chi-sono-hero.webp"
          imageAlt="Prato di montagna con spighe al vento, baita e vette sullo sfondo"
          imagePosition="center"
        />

        {/* Sezione Testo Hero */}
        <PageIntroduction
          title="La Mia Storia"
          description={
            <div className="space-y-6 max-w-3xl mx-auto">
              <p>
                <em className="text-brand-contrast">Amo perdermi nei boschi,</em>{" "}
                ascoltare il suono del vento tra le foglie, osservare la natura e{" "}
                <em className="text-brand-contrast">lasciarmi sorprendere</em>{" "}
                dalla sua saggezza.
              </p>
              <p>
                Sono{" "}
                <em className="text-brand-contrast">madre di due creature</em>{" "}
                che, fino ad ora, mi hanno insegnato tanto. Sono{" "}
                <em className="text-brand-contrast">appassionata di arte</em>,
                cultura e mistero, di simboli e rituali, di linguaggi e
                movimento.
              </p>
            </div>
          }
        />

        {/* 2. Introduzione */}
        <section className="w-full py-16 md:py-32 px-4 bg-brand-base">
          <div className="container mx-auto max-w-6xl flex flex-col md:flex-row gap-12 md:gap-24 items-center">
            <div className="w-full md:w-1/2 relative aspect-[3/4] rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-soft">
              <img
                src="/images/chi-sono/stefania-mare.webp"
                alt="Stefania Mastroianni seduta accanto a una porta di legno turchese"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div className="w-full md:w-1/2 flex flex-col justify-center px-4 md:px-0">
              <p className="text-lg md:text-xl text-brand-contrast/80 leading-relaxed font-light text-justify mb-8">
                I viaggi oltreoceano mi hanno aperto ad una nuova visione di{" "}
                <em className="text-brand-contrast">“stare nel presente”</em>,
                riportandomi all’<em className="text-brand-contrast">essenziale</em>{" "}
                e alla{" "}
                <em className="text-brand-contrast">
                  cura di me stessa come priorità.
                </em>
              </p>
              <p className="text-lg md:text-xl text-brand-contrast/80 leading-relaxed font-light text-justify mb-8">
                Lavoro da anni{" "}
                <em className="text-brand-contrast">
                  nell’ambito del sociale e del benessere,
                </em>{" "}
                con passione e dedizione. Credo in un{" "}
                <em className="text-brand-contrast">approccio integrale</em>, di
                relazione costante tra{" "}
                <em className="text-brand-contrast">corpo, mente e spirito</em>,
                che inizia con un{" "}
                <em className="text-brand-contrast">ascolto reale</em> della
                storia, dei bisogni e di ciò che sente chi ho di fronte. Per
                questo{" "}
                <em className="text-brand-contrast">
                  ogni percorso e ogni consulenza sono diversi
                </em>
                , così come ogni pratica di gruppo,{" "}
                <em className="text-brand-contrast">
                  Perché nascono come risposta al momento presente
                </em>
                , al contesto e al{" "}
                <em className="text-brand-contrast">dialogo vivo</em> di tutte
                le parti coinvolte.
              </p>
              <p className="text-lg md:text-xl text-brand-contrast/80 leading-relaxed font-light text-justify">
                Credo che{" "}
                <em className="text-brand-contrast">
                  ognuno abbia già le risorse di cui ha bisogno
                </em>
                : il mio compito è solo{" "}
                <em className="text-brand-contrast">
                  “ricordare” chi siamo e da dove veniamo
                </em>
                , offrendo tecniche, strategie e informazioni che facilitino
                questo{" "}
                <em className="text-brand-contrast">
                  “ritorno a casa”, nello spazio del Cuore
                </em>
                .
              </p>
            </div>
          </div>
        </section>

        {/* 3. La Vocazione (Editorial Quote) */}
        <section className="w-full py-24 px-4 bg-white border-y border-brand-contrast/5">
          <div className="container mx-auto max-w-4xl text-center flex flex-col items-center">
            <BookOpen
              className="text-brand-secondary mb-10 opacity-80"
              size={40}
            />
            <p className="font-serif italic text-2xl md:text-4xl text-brand-primary leading-relaxed md:leading-[1.4]">
              ""Solo nel silenzio che osa ascoltarsi,
        	l'anima svela le sue ferite: ed è lì, 
        	nel buio accogliente del sé, 
        	che il dolore inizia a sciogliersi in luce.""
            </p>
          </div>
        </section>

        {/* 4. Il Percorso e la Formazione */}
        <section className="w-full py-16 md:py-32 px-4 bg-brand-base">
          <div className="container mx-auto max-w-6xl flex flex-col-reverse md:flex-row gap-12 md:gap-24 items-center">
            <div className="w-full md:w-1/2 flex flex-col justify-center px-4 md:px-0">
              <h2 className="font-serif text-3xl md:text-5xl text-brand-contrast mb-8 leading-tight text-center md:text-left">
                Il Mio Percorso
              </h2>
              <p className="text-lg md:text-xl text-brand-contrast/80 leading-relaxed font-light mb-12 text-center md:text-left">
                La passione per la cura mi ha spinto a formarmi continuamente,
                integrando tradizioni millenarie con approcci corporei moderni.
              </p>
              <ul className="space-y-10">
                <li className="flex gap-4 md:gap-6 items-start">
                  <div className="bg-brand-neutral/30 p-3 rounded-full flex-shrink-0 mt-1">
                    <Sun className="text-brand-primary" size={24} />
                  </div>
                  <div>
                    <h4 className="font-serif text-xl sm:text-2xl text-brand-contrast mb-2">
                      Insegnante Yoga (RYT 500)
                    </h4>
                    <p className="text-brand-contrast/70 font-light text-base md:text-lg">
                      Specializzazione in Hatha Vinyasa e Yoga Pre/Post Parto.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4 md:gap-6 items-start">
                  <div className="bg-brand-neutral/30 p-3 rounded-full flex-shrink-0 mt-1">
                    <Sun className="text-brand-primary" size={24} />
                  </div>
                  <div>
                    <h4 className="font-serif text-xl sm:text-2xl text-brand-contrast mb-2">
                      Trattamenti Olistici
                    </h4>
                    <p className="text-brand-contrast/70 font-light text-base md:text-lg">
                      Massaggio Ayurvedico, Tecniche di rilascio miofasciale e
                      Riflessologia Plantare.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4 md:gap-6 items-start">
                  <div className="bg-brand-neutral/30 p-3 rounded-full flex-shrink-0 mt-1">
                    <Sun className="text-brand-primary" size={24} />
                  </div>
                  <div>
                    <h4 className="font-serif text-xl sm:text-2xl text-brand-contrast mb-2">
                      Doula e Assistenza Materna
                    </h4>
                    <p className="text-brand-contrast/70 font-light text-base md:text-lg">
                      Certificazione internazionale per l'accompagnamento
                      emotivo e pratico alla nascita.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="w-full md:w-1/2 relative aspect-square rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-soft">
              <img
                src="/images/chi-sono/IMG_2028.webp"
                alt="Stefania durante una pratica"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* 5. Servizi offerti (scroll orizzontale in stile marquee) */}
        <section className="w-full py-32 bg-white border-t border-brand-contrast/5 overflow-hidden">
          <div className="container mx-auto max-w-6xl px-4 text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl text-brand-contrast">
              Di cosa mi occupo
            </h2>
          </div>

          {services.length > 0 && (
            <div
              className="relative flex overflow-x-hidden"
              onMouseEnter={() => setIsPracticesHovered(true)}
              onMouseLeave={() => setIsPracticesHovered(false)}
            >
              <div
                className="animate-marquee whitespace-nowrap flex gap-8 px-4 items-stretch"
                style={{
                  animationPlayState: isPracticesHovered ? "paused" : "running",
                }}
              >
                {marqueeServices.map((service, idx) => {
                  const base = CATEGORY_ROUTES[service.category] || "/contatti";
                  const href = `${base}#servizio-${service.slug || service.id}`;
                  return (
                    <Link
                      key={`${service.id}-${idx}`}
                      to={href}
                      className="w-[300px] md:w-[340px] flex-shrink-0 whitespace-normal bg-brand-base rounded-[2.5rem] overflow-hidden flex flex-col shadow-sm hover:shadow-soft transition-all duration-500 group"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden bg-brand-primary/5">
                        {service.imageUrl ? (
                          <img
                            src={service.imageUrl}
                            alt={service.title}
                            loading="lazy"
                            decoding="async"
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-brand-primary/20 font-serif text-lg">
                            Stefania Mastroianni
                          </div>
                        )}
                      </div>
                      <div className="p-8 flex flex-col flex-grow text-center">
                        <h3 className="font-serif text-2xl text-brand-contrast mb-4 group-hover:text-brand-primary transition-colors">
                          {service.title}
                        </h3>
                        <p className="text-base md:text-lg text-brand-contrast/70 leading-relaxed font-light flex-grow mb-8 line-clamp-3">
                          {service.description}
                        </p>
                        <span className="mt-auto inline-flex items-center justify-center gap-2 font-semibold text-brand-secondary">
                          Scopri
                          <ArrowRight
                            size={18}
                            className="transform group-hover:translate-x-1 transition-transform"
                          />
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Link opzionale al blog */}
          <div className="container mx-auto max-w-6xl px-4 text-center mt-16">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-brand-secondary font-medium group"
            >
              <span className="relative py-1">
                Leggi gli approfondimenti sul blog
                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-brand-secondary/30 group-hover:bg-brand-secondary group-hover:h-[2px] transition-all" />
              </span>
              <ArrowRight
                size={18}
                className="transform group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
