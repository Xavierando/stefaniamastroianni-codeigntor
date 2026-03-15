import { useEffect, useState } from "react";
import { Hero } from "@/components/ui/Hero";
import { ServiceOverview } from "@/components/sections/ServiceOverview";
import { EventCard } from "@/components/ui/EventCard";
import { TestimonialsCarousel } from "@/components/sections/TestimonialsCarousel";
import { apiFetch } from "@/lib/api";

import { Category } from "../types";

export function MaternitaPage() {
  const [services, setServices] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [servicesRes, eventsRes, reviewsRes] = await Promise.all([
          apiFetch(`/services?category=${Category.MATERNITA}`),
          apiFetch(`/events?category=${Category.MATERNITA}`),
          apiFetch(`/reviews?category=${Category.MATERNITA}`)
        ]);

        setServices(servicesRes || []);
        
        const formattedEvents = (eventsRes || []).map((e: any) => ({
          id: e.id,
          slug: e.slug || "",
          title: e.title,
          description: e.description,
          category: e.category,
          date: e.date ? new Date(e.date).toLocaleDateString("it-IT", { day: 'numeric', month: 'long', year: 'numeric' }) : "Da definire",
          location: e.location || "Studio Olistico Mastroianni",
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

  const reviewsBgClass = services.length % 2 !== 0 ? "bg-white" : "bg-brand-base";
  const eventsBgClass = reviews.length > 0 
    ? (services.length % 2 === 0 ? "bg-white" : "bg-brand-base")
    : reviewsBgClass;

  return (
    <div className="flex flex-col min-h-screen bg-brand-base">
      <Hero
        title="Maternità Consapevole"
        subtitle="Sostegno emotivo, corporeo e pratico dal concepimento al puerperio. Un faro per navigare i cambiamenti della maternità sentendoti accolta e mai sola."
        imageSrc="/images/maternita/Servizi-maternita-2.webp"
        gradientColorClass="from-white"
      />

      <section className="py-24 px-4 bg-white border-b border-brand-contrast/5">
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
            alternateColorClass="bg-white"
          />
        ))}
      </div>

      {/* Sezione Recensioni */}
      {reviews.length > 0 && (
        <TestimonialsCarousel reviews={reviews} title="Cosa dicono le mamme" className={reviewsBgClass} />
      )}

      {/* Sezione Eventi (Se presenti) */}
      {events.length > 0 && (
        <section className={`py-24 px-4 border-t border-brand-contrast/10 ${eventsBgClass}`}>
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
