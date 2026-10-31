import { SEO } from "@/components/common/SEO";
import { useEffect, useState } from "react";
import { Hero } from "@/components/ui/Hero";
import { EventCard } from "@/components/ui/EventCard";
import { apiFetch } from "@/lib/api";
import { useImagePreloader } from "@/hooks/useImagePreloader";
import { PageIntroduction } from "@/components/sections/PageIntroduction";
import { LogoSpinner } from "@/components/common/LogoSpinner";

export function EventiPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const eventsRes = await apiFetch("/events");

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
          isFull: e.is_full,
          isPast: e.is_past,
          imageSrc: e.imageUrl || undefined,
          posterUrl: e.posterUrl || undefined,
          timestamp: e.date ? new Date(e.date).getTime() : null,
        }));

        setEvents(formattedEvents);
      } catch (err) {
        console.error("Failed to fetch Eventi data:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const isHeroLoaded = useImagePreloader(
    "/images/eventi/eventi-hero-cerchio.webp",
  );

  const isReady = !isLoading && isHeroLoaded;

  // In alto gli eventi in arrivo dal più vicino (quelli "da definire" in coda),
  // in fondo i conclusi dal più recente.
  const upcomingEvents = events
    .filter((e) => !e.isPast)
    .sort((a, b) => (a.timestamp ?? Infinity) - (b.timestamp ?? Infinity));
  const pastEvents = events
    .filter((e) => e.isPast)
    .sort((a, b) => (b.timestamp ?? 0) - (a.timestamp ?? 0));

  return (
    <>
      <SEO 
        title="Laboratori ed Eventi" 
        description="Scopri i prossimi incontri, laboratori e cerchi di condivisione. Spazi dedicati alla crescita collettiva, allo yoga e al benessere olistico."
      />
      {!isReady && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-brand-base items-center justify-center">
          <LogoSpinner />
        </div>
      )}
      <div
        className={`flex flex-col min-h-screen bg-brand-base transition-opacity duration-500 ${!isReady ? "opacity-0 h-screen overflow-hidden" : "opacity-100"}`}
      >
        <Hero imageSrc="/images/eventi/eventi-hero-cerchio.webp" imagePosition="bottom" />

        <PageIntroduction
          title="Laboratori ed Eventi"
          description="Spazi collettivi dove l'energia del gruppo amplifica l'esperienza individuale. Ritiri, seminari tematici e cerchi di condivisione."
        />
        <section className="py-24 px-0 sm:px-4 bg-white overflow-hidden relative">
          <div className="container mx-auto max-w-4xl text-center mb-16">
            <div className="flex flex-col gap-8 max-w-4xl mx-auto">
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>

            {pastEvents.length > 0 && (
              <>
                <h2 className="font-serif text-3xl text-brand-contrast mt-24 mb-10">
                  Eventi conclusi
                </h2>
                <div className="flex flex-col gap-8 max-w-4xl mx-auto">
                  {pastEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
