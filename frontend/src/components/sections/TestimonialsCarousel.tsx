import { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ReviewCard, type ReviewProps } from "../ui/ReviewCard";

export function TestimonialsCarousel({ reviews, title = "Dicono di me", className }: { reviews: ReviewProps[], title?: string, className?: string }) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "center" },
    [Autoplay({ delay: 10000, stopOnMouseEnter: true, stopOnInteraction: false })]
  );

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  if (!reviews || reviews.length === 0) return null;

  return (
    <section className={`w-full py-24 border-t border-brand-contrast/10 ${className || 'bg-brand-base'}`}>
      <div className="container mx-auto px-4 max-w-6xl">
        <h2 className="font-serif text-3xl md:text-5xl text-center text-brand-primary mb-16">
          {title}
        </h2>

        <div className="relative">
          <div 
            className="overflow-hidden px-4 md:px-12" 
            ref={emblaRef}
          >
          <div className="flex -ml-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="flex-[0_0_100%] min-w-0 pl-4 pb-4"
              >
                <ReviewCard review={review} />
              </div>
            ))}
          </div>
        </div>

        {/* Carousel Controls */}
        {reviews.length > 1 && (
          <>
            <button
              onClick={() => {
                scrollPrev();
                const autoplay = emblaApi?.plugins()?.autoplay;
                if (autoplay) autoplay.reset();
              }}
              className="hidden lg:flex items-center justify-center absolute left-0 top-1/2 md:left-4 -translate-y-1/2 p-3 rounded-full bg-white shadow-md border border-brand-primary/10 text-brand-primary hover:bg-brand-primary hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-brand-secondary z-10"
              aria-label="Recensione precedente"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={() => {
                scrollNext();
                const autoplay = emblaApi?.plugins()?.autoplay;
                if (autoplay) autoplay.reset();
              }}
              className="hidden lg:flex items-center justify-center absolute right-0 top-1/2 md:right-4 -translate-y-1/2 p-3 rounded-full bg-white shadow-md border border-brand-primary/10 text-brand-primary hover:bg-brand-primary hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-brand-secondary z-10"
              aria-label="Prossima recensione"
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
