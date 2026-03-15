import { useEffect, useState } from "react";
import { Hero } from "@/components/ui/Hero";
import { EventCard } from "@/components/ui/EventCard";
import { apiFetch } from "@/lib/api";

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
          date: e.date ? new Date(e.date).toLocaleDateString("it-IT", { day: 'numeric', month: 'long', year: 'numeric' }) : "Da definire",
          location: e.location || "Studio Olistico Mastroianni",
          isFull: e.isFull,
          imageSrc: e.imageUrl || undefined
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
        title="Laboratori ed Eventi"
        subtitle="Spazi collettivi dove l'energia del gruppo amplifica l'esperienza individuale. Ritiri, seminari tematici e cerchi di condivisione."
        imageSrc="/images/eventi/intermediate-workshop-featured.webp"
        gradientColorClass="from-brand-base"
      />

      <section className="py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl text-brand-primary mb-6">Prossimi Appuntamenti</h2>
            <p className="text-lg text-brand-contrast/80 max-w-2xl mx-auto">
              Scopri il calendario dei prossimi incontri. Prenota per tempo, i posti per i cerchi sono volutamente limitati per garantire intimità e ascolto.
            </p>
          </div>

          <div className="flex flex-col gap-8 max-w-4xl mx-auto">
            {events.map((event) => (
              <EventCard 
                key={event.id} 
                event={event} 
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
