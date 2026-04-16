import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Calendar, MapPin, Tag } from "lucide-react";
import { ContentDetailLayout } from "@/components/layout/ContentDetailLayout";

export function EventDetail() {
  const { slug } = useParams();
  const [event, setEvent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEvent() {
      try {
        setIsLoading(true);
        const data = await apiFetch(`/events/${slug}`);
        if (data) {
          // Map to correct format safely
          setEvent({
            id: data.id,
            slug: data.slug || "",
            title: data.title,
            description: data.description,
            category: data.category,
            date: data.date ? new Date(data.date).toLocaleDateString("it-IT", { day: 'numeric', month: 'long', year: 'numeric' }) : "Da definire",
            location: data.location || "Studio Olistico Mastroianni",
            price: data.price,
            isFull: data.is_full,
            isPast: data.is_past,
            remainingCapacity: data.remaining_capacity,
            imageSrc: data.imageUrl || undefined,
            imagePosition: data.imagePosition || 'centrato'
          });
        } else {
          setError("Evento non trovato");
        }
      } catch (err: any) {
        console.error("Failed to fetch event data:", err);
        setError("Errore nel caricamento dell'evento");
      } finally {
        setIsLoading(false);
      }
    }

    if (slug) {
      fetchEvent();
    }
  }, [slug]);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-brand-base items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="flex flex-col min-h-screen bg-brand-base items-center justify-center text-center p-4">
        <h2 className="text-2xl font-serif text-brand-primary mb-4">{error || "Evento non trovato"}</h2>
        <Link to="/laboratori-eventi">
          <Button variant="outline">Torna agli Eventi</Button>
        </Link>
      </div>
    );
  }

  const Sidebar = (
    <div className="bg-white p-8 rounded-[2rem] shadow-soft sticky top-32">
      <h3 className="text-xl font-serif text-brand-primary mb-6">Informazioni Pratiche</h3>
      
      <div className="flex items-start mb-6">
        <div className="bg-brand-primary/5 p-3 rounded-full mr-4 text-brand-secondary">
          <Calendar size={24} />
        </div>
        <div>
          <p className="text-sm font-bold text-brand-contrast/50 uppercase tracking-wider mb-1">Data e Ora</p>
          <p className="text-brand-primary font-medium text-lg">{event.date}</p>
        </div>
      </div>

      <div className="flex items-start mb-8">
        <div className="bg-brand-primary/5 p-3 rounded-full mr-4 text-brand-secondary">
          <MapPin size={24} />
        </div>
        <div>
          <p className="text-sm font-bold text-brand-contrast/50 uppercase tracking-wider mb-1">Luogo</p>
          <p className="text-brand-primary font-medium">{event.location}</p>
        </div>
      </div>

      {event.price && (
        <div className="flex items-start mb-8">
          <div className="bg-brand-primary/5 p-3 rounded-full mr-4 text-brand-secondary">
            <Tag size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-brand-contrast/50 uppercase tracking-wider mb-1">Quota di Partecipazione</p>
            <p className="text-brand-primary font-medium">€ {event.price}</p>
          </div>
        </div>
      )}

      {event.remainingCapacity !== null && event.remainingCapacity > 0 && event.remainingCapacity <= 5 && (
        <div className="mb-6 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-sm font-medium animate-pulse">
            ⚠️ Ultimi {event.remainingCapacity} posti rimasti!
        </div>
      )}

      <div className="pt-6 border-t border-brand-primary/10">
        <Link to={event.isPast ? "/laboratori-eventi" : (event.isFull ? "/contatti" : `/prenota?event_id=${event.id}`)} className="block w-full">
          <Button variant={event.isFull || event.isPast ? "outline" : "primary"} className="w-full py-6 text-lg shadow-sm hover:translate-y-[-2px] transition-transform">
            {event.isPast ? "Evento Concluso" : (event.isFull ? "Richiedi lista d'attesa" : "Prenota il tuo posto")}
          </Button>
        </Link>
        {!event.isFull && !event.isPast && (
            <p className="text-center text-sm text-brand-contrast/50 mt-4">
              La prenotazione non è vincolante ed è soggetta a conferma.
            </p>
        )}
      </div>
    </div>
  );

  return (
    <ContentDetailLayout
      title={event.title}
      imageSrc={event.imageSrc}
      imagePosition={event.imagePosition}
      isFull={event.isFull}
      backLink="/laboratori-eventi"
      backLabel="Torna agli Eventi"
      sidebar={Sidebar}
      isMarkdown
    >
      {event.description || ''}
    </ContentDetailLayout>
  );
}
