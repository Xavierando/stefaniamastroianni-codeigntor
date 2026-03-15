import { useEffect, useState } from "react";
import { Hero } from "@/components/ui/Hero";
import { ServiceOverview } from "@/components/sections/ServiceOverview";
import { EventCard } from "@/components/ui/EventCard";
import { TestimonialsCarousel } from "@/components/sections/TestimonialsCarousel";
import { apiFetch } from "@/lib/api";

export function MaternitaPage() {
  const [services, setServices] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [servicesRes, eventsRes, reviewsRes] = await Promise.all([
          apiFetch("/services?category=MATERNITA&isEvent=0"),
          apiFetch("/services?category=MATERNITA&isEvent=1"),
          apiFetch("/reviews?category=MATERNITA")
        ]);

        setServices(servicesRes || []);
        
        const formattedEvents = (eventsRes || []).map((e: any) => ({
          id: e.id,
          slug: e.slug || "",
          title: e.title,
          description: e.description,
          category: e.category,
          date: e.eventDate ? new Date(e.eventDate).toLocaleDateString("it-IT", { day: 'numeric', month: 'long', year: 'numeric' }) : "Da definire",
          location: e.eventLocation || "Studio Olistico Mastroianni",
          isFull: e.isFull,
          imageSrc: e.imageUrl || undefined
        }));
        
        setEvents(formattedEvents);
        setReviews(reviewsRes || []);
      } catch (err) {
        console.error("Failed to fetch Maternita data:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex-col min-h-screen bg-brand-base flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-brand-base">
      <Hero
        title="Maternità Consapevole"
        subtitle="Un accompagnamento dolce dal preconcepimento al post-parto. Ascolto, preparazione corporea ed emotiva per vivere la trasformazione della nascita in pienezza."
        imageSrc="/images/maternita/Servizi-maternita-2.webp"
      />

      <section className="py-24 px-4 bg-accent-pink/10 border-b border-brand-contrast/5">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl text-brand-primary mb-6">I Percorsi di Accompagnamento</h2>
            <p className="text-lg text-brand-contrast/80 max-w-2xl mx-auto">
              Ogni gravidanza è un viaggio unico. I miei servizi sono pensati per offrirti un sostegno su misura, rispettando i tuoi tempi e le tue scelte.
            </p>
          </div>

        </div>
      </section>

      <div className="flex flex-col w-full">
        {services.map((service, index) => (
          <ServiceOverview
            key={service.id}
            title={service.title}
            description={service.description}
            imageSrc={service.imageUrl || "/images/maternita/Servizi-maternita-2.webp"}
            durationMin={service.duration ? parseInt(service.duration) : null}
            price={service.price ? parseInt(service.price) : null}
            imagePosition={index % 2 === 0 ? "left" : "right"}
            isLast={index === services.length - 1}
            hideButton={false}
            href="/contatti"
            ctaText="Richiedi informazioni"
            alternateBackground={index % 2 !== 0}
            alternateColorClass="bg-accent-pink/5"
          />
        ))}
      </div>

      {/* Sezione Recensioni */}
      {reviews.length > 0 && (
        <TestimonialsCarousel reviews={reviews} title="Cosa dicono le mamme" />
      )}

      {/* Sezione Eventi (Se presenti) */}
      {events.length > 0 && (
        <section className="py-24 px-4 bg-accent-pink/10 border-t border-brand-contrast/10">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="font-serif text-3xl md:text-4xl text-brand-primary mb-6">Prossimi Eventi di Maternità</h2>
              <p className="text-lg text-brand-contrast/80 max-w-2xl mx-auto">
                Partecipa ai nostri incontri di gruppo e laboratori dedicati al mondo della maternità.
              </p>
            </div>
            <div className="flex flex-col gap-8 max-w-4xl mx-auto">
              {events.map(event => (
                <EventCard 
                  key={event.id} 
                  event={event} 
                />
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  );
}
