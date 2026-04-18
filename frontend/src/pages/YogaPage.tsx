import { SEO } from "@/components/common/SEO";
import { useEffect, useState } from "react";
import { Hero } from "@/components/ui/Hero";
import { ServiceOverview } from "@/components/sections/ServiceOverview";
import { EventCard } from "@/components/ui/EventCard";
import { TestimonialsCarousel } from "@/components/sections/TestimonialsCarousel";
import { apiFetch } from "@/lib/api";
import { useImagePreloader } from "@/hooks/useImagePreloader";
import { PageIntroduction } from "@/components/sections/PageIntroduction";

import { Category } from "../types";

export function YogaPage() {
  const [services, setServices] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [servicesRes, eventsRes, reviewsRes] = await Promise.all([
          apiFetch(`/services?category=${Category.YOGA}`),
          apiFetch(`/events?category=${Category.YOGA}`),
          apiFetch(`/reviews?category=${Category.YOGA}`),
        ]);

        setServices(servicesRes || []);

        const formattedEvents = (eventsRes || []).map((e: any) => ({
          id: e.id,
          slug: e.slug || "",
          title: e.title,
          shortDescription: e.shortDescription,
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
        console.error("Failed to fetch Yoga data:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const isHeroLoaded = useImagePreloader("/images/yoga/hero-yoga.webp");

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
      <SEO 
        title="Yoga e Meditazione" 
        description="Pratiche di Hatha Yoga, Vinyasa e meditazione guidata. Coltiva la tua forza interiore e la flessibilità attraverso il respiro e la presenza."
      />
      {!isReady && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-brand-base items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
        </div>
      )}
      <div
        className={`flex flex-col min-h-screen bg-brand-base transition-opacity duration-500 ${!isReady ? "opacity-0 h-screen overflow-hidden" : "opacity-100"}`}
      >
        <Hero imageSrc="/images/yoga/hero-yoga.webp" />

        <PageIntroduction
          title="Yoga e Meditazione"
          description="Riconnettersi al proprio respiro. Pratiche dolci e consapevoli per abitare il corpo con gentilezza, ritrovare fluidità e calmare la mente."
        />

        <div className="flex flex-col w-full">
          {services.map((service, index) => (
            <ServiceOverview
              key={service.id}
              title={service.title}
              description={service.description}
              imageSrc={
                service.imageUrl || "/images/home/Pratiche-di-Yoga.webp"
              }
              durationMin={service.duration ? parseInt(service.duration) : null}
              price={service.price ? parseInt(service.price) : null}
              imagePosition={index % 2 === 0 ? "left" : "right"}
              hideButton={false}
              href={service.is_booking_enabled == 1 ? `/prenota?service_id=${service.id}` : "/contatti"}
              ctaText={service.is_booking_enabled == 1 ? "Prenota ora" : "Contattami"}
              alternateBackground={index % 2 !== 0}
              alternateColorClass="bg-white"
              backgroundColorClass="bg-brand-base"
            />
          ))}
        </div>

        {/* Sezione Recensioni */}
        {reviews.length > 0 && (
          <TestimonialsCarousel
            reviews={reviews}
            title="Cosa dicono gli allievi"
            className={reviewsBgClass}
          />
        )}

        {/* Sezione Eventi (Corsi di Gruppo) */}
        {events.length > 0 && (
          <section className={`py-24 px-4 ${eventsBgClass}`}>
            <div className="container mx-auto max-w-6xl">
              <div className="text-center mb-16">
                <h2 className="font-serif text-3xl md:text-4xl text-brand-primary mb-6">
                  Corsi e Seminari Caleidoscopici
                </h2>
                <p className="text-lg text-brand-contrast/80 max-w-2xl mx-auto">
                  Partecipa alle nostre pratiche di gruppo, seminari e
                  masterclass tematiche.
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
