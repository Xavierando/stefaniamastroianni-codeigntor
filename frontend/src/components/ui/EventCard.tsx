import { Card, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Calendar, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

export interface EventProps {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  isFull: boolean;
  category: string;
  imageSrc?: string;
  slug: string;
}

export function EventCard({ event }: { event: EventProps }) {
  return (
    <Card className="flex flex-col sm:flex-row hover:shadow-lg transition-shadow overflow-hidden group">
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
            {event.isFull && (
              <span className="bg-brand-secondary/10 text-brand-secondary text-xs px-2 py-1 rounded-full font-medium">
                Al Completo
              </span>
            )}
          </div>
          <CardTitle className="text-xl md:text-2xl text-brand-primary mb-4 leading-snug">
            {event.title}
          </CardTitle>
          <p className="text-brand-contrast/80 text-sm mb-4">
            {event.description}
          </p>
          <div className="flex items-center text-sm text-brand-contrast/60 mb-6">
            <MapPin size={16} className="mr-2 flex-shrink-0" />
            {event.location}
          </div>
        </div>
        
        <Link to={`/laboratori-eventi/${event.slug}`}>
          <Button 
            variant={event.isFull ? "outline" : "primary"} 
            className="w-full sm:w-auto"
          >
            {event.isFull ? "Al Completo - Scopri di più" : "Scopri di più"}
          </Button>
        </Link>
      </div>
    </Card>
  );
}
