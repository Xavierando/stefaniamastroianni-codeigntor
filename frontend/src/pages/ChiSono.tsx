import { Hero } from "@/components/ui/Hero";
import { Leaf, Heart, ArrowRight, BookOpen, Sun, Sparkles } from "lucide-react";
import { SEO } from "@/components/common/SEO";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { useImagePreloader } from "@/hooks/useImagePreloader";
import { PageIntroduction } from "@/components/sections/PageIntroduction";

const PRACTICES = [
  {
    icon: <Leaf className="text-accent-green mb-4" size={40} />,
    title: "Yoga in Gravidanza",
    description:
      "Pratiche dolci per accompagnare il corpo che cambia e prepararsi al parto con consapevolezza.",
    href: "/maternita",
  },
  {
    icon: <Heart className="text-brand-secondary mb-4" size={40} />,
    title: "Trattamenti Olistici",
    description:
      "Massaggi e tecniche riequilibranti per sciogliere tensioni fisiche ed emotive profonde.",
    href: "/trattamenti",
  },
  {
    icon: <Sparkles className="text-accent-orange mb-4" size={40} />,
    title: "Riequilibrio Energetico",
    description:
      "Percorsi per ritrovare il proprio centro, lavorando sul rilascio dello stress accumulato.",
    href: "/consulenze",
  },
];

export function ChiSono() {
  const isHeroLoaded = useImagePreloader("/images/chi-sono/chi-sono-hero.webp");

  const isReady = isHeroLoaded;

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
          description=""
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
              <p className="text-lg md:text-xl text-brand-contrast/80 leading-relaxed font-light mb-8">
                <em className="text-brand-contrast">Amo perdermi nei boschi,</em>{" "}
                ascoltare il suono del vento tra le foglie, osservare la natura
                e{" "}
                <em className="text-brand-contrast">lasciarmi sorprendere</em>{" "}
                dalla sua saggezza.
              </p>
              <p className="text-lg md:text-xl text-brand-contrast/80 leading-relaxed font-light mb-8">
                Sono{" "}
                <em className="text-brand-contrast">madre di due creature</em>{" "}
                che, fino ad ora, mi hanno insegnato tanto. Sono{" "}
                <em className="text-brand-contrast">appassionata di arte</em>,
                cultura e mistero, di simboli e rituali, di linguaggi e
                movimento.
              </p>
              <p className="text-lg md:text-xl text-brand-contrast/80 leading-relaxed font-light mb-8">
                I viaggi oltreoceano mi hanno aperto ad una nuova visione di{" "}
                <em className="text-brand-contrast">“stare nel presente”</em>,
                riportandomi all’<em className="text-brand-contrast">essenziale</em>{" "}
                e alla{" "}
                <em className="text-brand-contrast">
                  cura di me stessa come priorità.
                </em>
              </p>
              <p className="text-lg md:text-xl text-brand-contrast/80 leading-relaxed font-light mb-8">
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
              <p className="text-lg md:text-xl text-brand-contrast/80 leading-relaxed font-light">
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
              "La decisione di dedicarmi alla cura degli altri è nata da
              un'esigenza interiore insopprimibile. Dopo aver attraversato
              momenti di profondo cambiamento personale, ho compreso che il vero
              benessere non è l'assenza di dolore, ma la capacità di accoglierlo
              e trasformarlo."
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

        {/* 5. Pratiche e CTA */}
        <section className="w-full py-32 px-4 bg-white border-t border-brand-contrast/5">
          <div className="container mx-auto max-w-6xl text-center">
            <h2 className="font-serif text-4xl md:text-5xl text-brand-contrast mb-16">
              Di cosa mi occupo
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {PRACTICES.map((practice, idx) => (
                <div
                  key={idx}
                  className="bg-brand-base p-10 rounded-[2.5rem] flex flex-col items-center text-center shadow-sm hover:shadow-soft transition-all duration-500 h-full group"
                >
                  <div className="mb-6 transform group-hover:scale-110 transition-transform duration-500">
                    {practice.icon}
                  </div>
                  <h3 className="font-serif text-2xl text-brand-contrast mb-4 group-hover:text-brand-primary transition-colors">
                    {practice.title}
                  </h3>
                  <p className="text-brand-contrast/70 leading-relaxed font-light flex-grow mb-10 text-lg">
                    {practice.description}
                  </p>
                  <Link to={practice.href} className="mt-auto w-full">
                    <Button
                      variant="link"
                      className="w-full group/btn font-semibold text-brand-primary hover:text-brand-primary/80"
                    >
                      Scopri
                      <ArrowRight
                        className="ml-2 group-hover/btn:translate-x-1 transition-transform"
                        size={18}
                      />
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
