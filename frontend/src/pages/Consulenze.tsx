import { useEffect, useState } from "react";
import { Hero } from "@/components/ui/Hero";
import { ServiceOverview } from "@/components/sections/ServiceOverview";
import { EventCard } from "@/components/ui/EventCard";
import { TestimonialsCarousel } from "@/components/sections/TestimonialsCarousel";
import { apiFetch } from "@/lib/api";

import { Category } from "../types";

export function ConsulenzePage() {
  const [services, setServices] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [servicesRes, eventsRes, reviewsRes] = await Promise.all([
          apiFetch(`/services?category=${Category.CONSULENZE}`),
          apiFetch(`/events?category=${Category.CONSULENZE}`),
          apiFetch(`/reviews?category=${Category.CONSULENZE}`)
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
        console.error("Failed to fetch Consulenze data:", err);
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
        title="Consulenze e Percorsi"
        subtitle="Spazi di parola e ascolto profondo. Insieme tracciamo la mappa per il tuo benessere psicofisico, rispettando i tuoi tempi e la tua unicità."
        imageSrc="/images/consulenze/consulenze-2.webp"
        gradientColorClass="from-white"
      />

      <section className="py-24 px-4 bg-white border-b border-brand-contrast/5">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl text-brand-primary mb-6">Incontri Individualizzati</h2>
            <p className="text-lg text-brand-contrast/80 max-w-2xl mx-auto">
              A volte il primo passo verso il benessere è potersi fermare ed essere ascoltati senza giudizio.
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
            imageSrc={service.imageUrl || "/images/home/consulenze-2.webp"}
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
        <TestimonialsCarousel reviews={reviews} title="Testimonianze dei Percorsi" className={reviewsBgClass} />
      )}

      {/* Sezione Eventi (Se presenti) */}
      {events.length > 0 && (
        <section className={`py-24 px-4 border-t border-brand-contrast/10 ${eventsBgClass}`}>
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="font-serif text-3xl md:text-4xl text-brand-primary mb-6">Percorsi di Gruppo</h2>
              <p className="text-lg text-brand-contrast/80 max-w-2xl mx-auto">
                Partecipa ai nostri incontri di gruppo tematici dedicati all'ascolto e al confronto.
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
