import { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { EventCard, type EventProps } from "../ui/EventCard";

export function EventCarousel({ events, className }: { events: EventProps[], className?: string }) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true },
    [Autoplay({ delay: 4000, stopOnMouseEnter: true, stopOnInteraction: false })]
  );

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  if (!events || events.length === 0) return null;

  return (
    <section className={`w-full py-24 border-y border-brand-primary/10 ${className || 'bg-brand-base'}`}>
      <div className="container mx-auto px-4 max-w-5xl">
        <h2 className="font-serif text-3xl md:text-5xl text-center text-brand-contrast mb-12">
          Prossimi Eventi e Laboratori
        </h2>

        <div className="relative">
          <div 
            className="overflow-hidden" 
            ref={emblaRef}
          >
          <div className="flex">
            {events.map((event) => (
              <div
                key={event.id}
                className="flex-[0_0_100%] min-w-0 p-4 md:p-8"
              >
                <EventCard event={event} />
              </div>
            ))}
          </div>
        </div>

        {/* Carousel Controls */}
        {events.length > 1 && (
          <>
            <button
              onClick={() => {
                scrollPrev();
                // Reset the autoplay timer when user interacts manually
                const autoplay = emblaApi?.plugins()?.autoplay;
                if (autoplay) autoplay.reset();
              }}
              className="hidden lg:flex items-center justify-center absolute left-0 top-1/2 md:-left-6 lg:-left-12 -translate-y-1/2 p-3 rounded-full bg-white shadow-md border border-brand-primary/10 text-brand-primary hover:bg-brand-primary hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-brand-secondary"
              aria-label="Evento precedente"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={() => {
                scrollNext();
                const autoplay = emblaApi?.plugins()?.autoplay;
                if (autoplay) autoplay.reset();
              }}
              className="hidden lg:flex items-center justify-center absolute right-0 top-1/2 md:-right-6 lg:-right-12 -translate-y-1/2 p-3 rounded-full bg-white shadow-md border border-brand-primary/10 text-brand-primary hover:bg-brand-primary hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-brand-secondary"
              aria-label="Prossimo evento"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}
        </div>
      </div>
    </section>
  );
}
