import { useEffect, useState } from "react";
import { Hero } from "@/components/ui/Hero";
import { ServiceOverview } from "@/components/sections/ServiceOverview";
import { EventCard } from "@/components/ui/EventCard";
import { TestimonialsCarousel } from "@/components/sections/TestimonialsCarousel";
import { apiFetch } from "@/lib/api";
import { useImagePreloader } from "@/hooks/useImagePreloader";

import { Category } from "../types";

export function TrattamentiPage() {
  const [services, setServices] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [servicesRes, eventsRes, reviewsRes] = await Promise.all([
          apiFetch(`/services?category=${Category.TRATTAMENTI}`),
          apiFetch(`/events?category=${Category.TRATTAMENTI}`),
          apiFetch(`/reviews?category=${Category.TRATTAMENTI}`),
        ]);

        setServices(servicesRes || []);

        const formattedEvents = (eventsRes || []).map((e: any) => ({
          id: e.id,
          slug: e.slug || "",
          title: e.title,
          description: e.description,
          category: e.category,
          date: e.date
            ? new Date(e.date).toLocaleDateString("it-IT", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })
            : "Da definire",
          location: e.location || "Studio Olistico Mastroianni",
          isFull: e.isFull,
          imageSrc: e.imageUrl || undefined,
        }));

        setEvents(formattedEvents);
        setReviews(reviewsRes || []);
      } catch (err) {
        console.error("Failed to fetch Trattamenti data:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const isHeroLoaded = useImagePreloader(
    "/images/trattamenti/trattamenti-olistici-1.webp",
  );

  const isReady = !isLoading && isHeroLoaded;

  const reviewsBgClass =
    services.length % 2 !== 0 ? "bg-brand-base" : "bg-white";
  const eventsBgClass =
    reviews.length > 0
      ? services.length % 2 === 0
        ? "bg-brand-base"
        : "bg-white"
      : reviewsBgClass;

  return (
    <>
      {!isReady && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-brand-base items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
        </div>
      )}
      <div
        className={`flex flex-col min-h-screen bg-brand-base transition-opacity duration-500 ${!isReady ? "opacity-0 h-screen overflow-hidden" : "opacity-100"}`}
      >
        <Hero
          imageSrc="/images/trattamenti/trattamenti-olistici-1.webp"
          gradientColorClass="from-brand-base"
        />

        <section className="py-16 md:py-24 px-4 bg-brand-base border-b border-brand-contrast/5">
          <div className="container mx-auto max-w-4xl text-center mb-16">
            <h1 className="font-serif text-4xl md:text-5xl text-brand-primary mb-6">
              Trattamenti Olistici
            </h1>
            <p className="text-xl text-brand-contrast/90 leading-relaxed font-light mb-12">
              Il tocco che cura. Massaggi e tecniche corporee per sciogliere le
              tensioni, stimolare le naturali capacità di autoguarigione e
              ritrovare leggerezza.
            </p>
          </div>
        </section>

        <div className="flex flex-col w-full">
          {services.map((service, index) => (
            <ServiceOverview
              key={service.id}
              title={service.title}
              description={service.description}
              imageSrc={
                service.imageUrl || "/images/home/trattamenti-olistici-1.webp"
              }
              durationMin={service.duration ? parseInt(service.duration) : null}
              price={service.price ? parseInt(service.price) : null}
              imagePosition={index % 2 === 0 ? "left" : "right"}
              isLast={index === services.length - 1}
              hideButton={false}
              href="/contatti"
              ctaText="Richiedi informazioni"
              alternateBackground={index % 2 !== 0}
              alternateColorClass="bg-brand-base"
            />
          ))}
        </div>

        {/* Sezione Recensioni */}
        {reviews.length > 0 && (
          <TestimonialsCarousel
            reviews={reviews}
            title="Voci da chi ha provato i trattamenti"
            className={reviewsBgClass}
          />
        )}

        {/* Sezione Eventi (Se presenti) */}
        {events.length > 0 && (
          <section
            className={`py-24 px-4 border-t border-brand-contrast/10 ${eventsBgClass}`}
          >
            <div className="container mx-auto max-w-6xl">
              <div className="text-center mb-16">
                <h2 className="font-serif text-3xl md:text-4xl text-brand-primary mb-6">
                  Prossimi Eventi di Trattamenti Olistici
                </h2>
                <p className="text-lg text-brand-contrast/80 max-w-2xl mx-auto">
                  Partecipa ai nostri incontri di gruppo e laboratori dedicati
                  al benessere fisico.
                </p>
              </div>
              <div className="flex flex-col gap-8 max-w-4xl mx-auto">
                {events.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
}
