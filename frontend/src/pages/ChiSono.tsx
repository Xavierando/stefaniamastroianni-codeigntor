import { Hero } from "@/components/ui/Hero";
import { Leaf, Heart, ArrowRight, BookOpen, Sun, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";

const PRACTICES = [
  {
    icon: <Leaf className="text-accent-green mb-4" size={40} />,
    title: "Yoga in Gravidanza",
    description: "Pratiche dolci per accompagnare il corpo che cambia e prepararsi al parto con consapevolezza.",
    href: "/maternita"
  },
  {
    icon: <Heart className="text-brand-secondary mb-4" size={40} />,
    title: "Trattamenti Olistici",
    description: "Massaggi e tecniche riequilibranti per sciogliere tensioni fisiche ed emotive profonde.",
    href: "/trattamenti"
  },
  {
    icon: <Sparkles className="text-accent-orange mb-4" size={40} />,
    title: "Riequilibrio Energetico",
    description: "Percorsi per ritrovare il proprio centro, lavorando sul rilascio dello stress accumulato.",
    href: "/consulenze"
  },
];

export function ChiSono() {
  return (
    <div className="flex flex-col min-h-screen">
      
      {/* 1. Hero Section */}
      <Hero
        imageSrc="/images/chi-sono/IMG_2028.webp"
        gradientColorClass="from-brand-base"
      />

      {/* Sezione Testo Hero */}
      <section className="w-full py-16 px-4 bg-brand-base text-center">
        <div className="container mx-auto max-w-4xl">
          <h1 className="font-serif text-4xl md:text-5xl text-brand-primary mb-6">La Mia Storia</h1>
          <p className="text-xl text-brand-contrast/90 font-light leading-relaxed">
            Un percorso intrecciato tra ascolto, cura e riconnessione profonda con i cicli della natura e della vita.
          </p>
        </div>
      </section>

      {/* 2. Introduzione */}
      <section className="w-full py-12 md:py-24 px-4 bg-brand-base">
        <div className="container mx-auto max-w-6xl flex flex-col md:flex-row gap-16 items-center">
          <div className="w-full md:w-1/2 relative aspect-square md:aspect-[4/5] rounded-tl-full rounded-br-full overflow-hidden shadow-xl border-4 border-white">
            <img
              src="/images/home/DSC_0557.webp"
              alt="Stefania Mastroianni nella natura"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
          <div className="w-full md:w-1/2 flex flex-col justify-center">
            <h2 className="font-serif text-3xl md:text-5xl text-brand-primary mb-8 leading-tight">
              Chi è Stefania?
            </h2>
            <p className="text-lg text-brand-contrast/90 leading-relaxed font-light mb-6">
              Sono una donna, una madre e un'appassionata ricercatrice di equilibrio. Amo perdermi nei boschi, ascoltare il suono del vento tra le foglie e osservare come la natura abbia sempre una risposta per ogni nostra inquietudine.
            </p>
            <p className="text-lg text-brand-contrast/90 leading-relaxed font-light mb-8">
              Il mio approccio al benessere non è mai standardizzato, ma nasce da un ascolto profondo di chi ho di fronte. Credo fermamente che ognuno di noi possieda già le risorse per guarire e ritrovare il proprio centro; il mio compito è solo quello di facilitare questo ritorno a casa.
            </p>
          </div>
        </div>
      </section>

      {/* 3. La Vocazione */}
      <section className="w-full py-24 px-4 bg-accent-green/10 text-center">
        <div className="container mx-auto max-w-4xl">
          <BookOpen className="text-accent-green mx-auto mb-6 opacity-60" size={48} />
          <h2 className="font-serif text-3xl md:text-4xl text-brand-primary mb-8">
            La mia Vocazione
          </h2>
          <p className="text-lg md:text-xl text-brand-contrast/80 leading-relaxed">
            "La decisione di dedicarmi alla cura degli altri è nata da un'esigenza interiore insopprimibile. Dopo aver attraversato momenti di profondo cambiamento personale, ho compreso che il vero benessere non è l'assenza di dolore, ma la capacità di accoglierlo e trasformarlo. La maternità, in particolare, mi ha insegnato la potenza della sorellanza e l'importanza di avere una rete di sostegno."
          </p>
        </div>
      </section>

      {/* 4. Il Percorso e la Formazione */}
      <section className="w-full py-24 px-4 bg-white">
        <div className="container mx-auto max-w-6xl flex flex-col-reverse md:flex-row gap-16 items-center">
          <div className="w-full md:w-1/2 flex flex-col justify-center">
            <h2 className="font-serif text-3xl md:text-4xl text-brand-primary mb-8">
              Il Mio Percorso Formativo
            </h2>
            <p className="text-lg text-brand-contrast/90 leading-relaxed font-light mb-8">
              La passione per la cura mi ha spinto a formarmi continuamente, integrando tradizioni millenarie con approcci corporei moderni.
            </p>
            <ul className="space-y-6">
              <li className="flex gap-4 items-start">
                <Sun className="text-brand-secondary flex-shrink-0 mt-1" size={24} />
                <div>
                  <h4 className="font-serif text-xl font-medium text-brand-primary">Diploma di Insegnante Yoga</h4>
                  <p className="text-brand-contrast/70">Specializzazione in Hatha Vinyasa e Yoga Pre/Post Parto (RYT 500).</p>
                </div>
              </li>
              <li className="flex gap-4 items-start">
                <Sun className="text-brand-secondary flex-shrink-0 mt-1" size={24} />
                <div>
                  <h4 className="font-serif text-xl font-medium text-brand-primary">Formazione in Trattamenti Olistici</h4>
                  <p className="text-brand-contrast/70">Massaggio Ayurvedico, Tecniche di rilascio miofasciale e Riflessologia Plantare.</p>
                </div>
              </li>
              <li className="flex gap-4 items-start">
                <Sun className="text-brand-secondary flex-shrink-0 mt-1" size={24} />
                <div>
                  <h4 className="font-serif text-xl font-medium text-brand-primary">Doula e Assistenza Materna</h4>
                  <p className="text-brand-contrast/70">Certificazione internazionale per l'accompagnamento emotivo e pratico alla nascita.</p>
                </div>
              </li>
            </ul>
          </div>
          <div className="w-full md:w-1/2 relative aspect-square rounded-2xl overflow-hidden shadow-lg">
            <img
              src="/images/chi-sono/IMG_2028.webp"
              alt="Stefania durante una pratica"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* 5. Pratiche e CTA */}
      <section className="w-full py-24 px-4 bg-brand-base border-t border-brand-contrast/5">
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="font-serif text-3xl md:text-4xl text-brand-primary mb-16">
            Di cosa mi occupo
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PRACTICES.map((practice, idx) => (
              <div key={idx} className="bg-white/50 p-8 rounded-2xl border border-brand-primary/10 flex flex-col items-center text-center shadow-sm h-full">
                {practice.icon}
                <h3 className="font-serif text-2xl text-brand-primary mb-4">{practice.title}</h3>
                <p className="text-brand-contrast/80 leading-relaxed font-light flex-grow mb-6">{practice.description}</p>
                <Link to={practice.href} className="mt-auto w-full">
                  <Button variant="outline" className="w-full group">
                    Scopri di più
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={16} />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
