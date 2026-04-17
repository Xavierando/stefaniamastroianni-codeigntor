import { Card, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export interface EventProps {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  shortDescription?: string;
  isFull: boolean;
  category: string;
  imageSrc?: string;
  slug: string;
  isPast: boolean;
}

export function EventCard({ event }: { event: EventProps }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full"
    >
      <Card
        className={`group flex flex-col bg-transparent border-0 shadow-none hover:shadow-soft transition-all duration-500 rounded-[2rem] overflow-hidden ${event.isPast ? "opacity-70 grayscale-[0.3]" : ""}`}
      >
        {/* Top Image Section - Airbnb Style Focus */}
        <div className="relative aspect-[4/3] sm:aspect-[16/10] overflow-hidden rounded-[2rem]">
          {event.imageSrc ? (
            <img
              src={event.imageSrc}
              alt={event.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 bg-brand-neutral" />
          )}
        </div>

        {/* Bottom Content Section - Clean & Minimal */}
        <div className="pt-6 pb-2 px-2 flex flex-col flex-1">
          <div className="flex items-center gap-2 mb-3 text-brand-secondary text-sm font-semibold uppercase tracking-widest">
            <Calendar size={16} />
            <span>{event.date}</span>
          </div>

          <CardTitle className="text-2xl font-serif text-brand-contrast mb-3 leading-tight group-hover:text-brand-primary transition-colors">
            {event.title}
          </CardTitle>

          <p className="text-brand-contrast/70 text-base mb-6 line-clamp-2 leading-relaxed font-light">
            {event.shortDescription || event.description}
          </p>

          <div className="mt-auto flex items-center justify-between">
            <div className="flex items-center text-sm text-brand-contrast/50">
              <MapPin size={16} className="mr-2" />
              {event.location}
            </div>

            <Link to={`/laboratori-eventi/${event.slug}`}>
              <Button
                variant="link"
                className="p-0 h-auto text-brand-primary hover:text-brand-primary/80 flex items-center gap-2 group/btn font-semibold"
              >
                Scopri
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover/btn:translate-x-1"
                />
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
