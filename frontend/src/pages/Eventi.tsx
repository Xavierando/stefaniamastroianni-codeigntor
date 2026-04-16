import { useEffect, useState } from "react";
import { Hero } from "@/components/ui/Hero";
import { EventCard } from "@/components/ui/EventCard";
import { apiFetch } from "@/lib/api";
import { useImagePreloader } from "@/hooks/useImagePreloader";

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
    "/images/eventi/intermediate-workshop-featured.webp",
  );

  const isReady = !isLoading && isHeroLoaded;

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
          imageSrc="/images/eventi/intermediate-workshop-featured.webp"
          
        />

        <section className="py-24 px-4 bg-brand-base">
          <div className="container mx-auto max-w-4xl text-center mb-16">
            <h1 className="font-serif text-4xl md:text-5xl text-brand-contrast mb-6">
              Laboratori ed Eventi
            </h1>
            <p className="text-xl text-brand-contrast/80 leading-relaxed font-light mb-12">
              Spazi collettivi dove l'energia del gruppo amplifica l'esperienza
              individuale. Ritiri, seminari tematici e cerchi di condivisione.
            </p>
          </div>
        </section>
        <section className="py-24 px-4 bg-white overflow-hidden relative">
          <div className="container mx-auto max-w-4xl text-center mb-16">
            <div className="flex flex-col gap-8 max-w-4xl mx-auto">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
