import { Card, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Calendar, MapPin } from "lucide-react";
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
      <Card className={`flex flex-col sm:flex-row hover:shadow-lg transition-all overflow-hidden group ${event.isPast ? 'grayscale-[0.5] opacity-80' : ''}`}>
        {/* ... (rest of the card content) */}
        {/* Image / Date Side */}
        <div className="relative p-6 sm:w-1/3 flex flex-col justify-center items-center text-center overflow-hidden min-h-[200px] sm:min-h-full">
          {event.imageSrc ? (
            <>
              <img 
                src={event.imageSrc} 
                alt={event.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              {/* Overlay to ensure date text is readable over the image */}
              <div className="absolute inset-0 bg-brand-primary/60" />
            </>
          ) : (
            <div className="absolute inset-0 bg-brand-primary" />
          )}
          
          <div className="relative z-10 text-brand-base">
            <Calendar size={32} className="mb-4 mx-auto opacity-90" />
            <span className="font-medium text-lg leading-tight block px-2">{event.date}</span>
          </div>
        </div>
        
        {/* Content Side */}
        <div className="p-6 sm:w-2/3 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-secondary">
                {event.category}
              </span>
              {event.isFull && !event.isPast && (
                <span className="bg-brand-secondary/10 text-brand-secondary text-xs px-2 py-1 rounded-full font-medium">
                  Al Completo
                </span>
              )}
              {event.isPast && (
                <span className="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded-full font-medium">
                  Concluso
                </span>
              )}
            </div>
            <CardTitle className="text-xl md:text-2xl text-brand-primary mb-4 leading-snug">
              {event.title}
            </CardTitle>
            <p className="text-brand-contrast/80 text-sm mb-4 line-clamp-3">
              {event.shortDescription || event.description}
            </p>
            <div className="flex items-center text-sm text-brand-contrast/60 mb-6">
              <MapPin size={16} className="mr-2 flex-shrink-0" />
              {event.location}
            </div>
          </div>
          
          <Link to={`/laboratori-eventi/${event.slug}`}>
            <Button 
              variant={event.isFull || event.isPast ? "outline" : "primary"} 
              className="w-full sm:w-auto"
            >
              {event.isPast ? "Vedi dettagli" : (event.isFull ? "Al Completo - Scopri di più" : "Scopri di più")}
            </Button>
          </Link>
        </div>
      </Card>
    </motion.div>
  );
}
