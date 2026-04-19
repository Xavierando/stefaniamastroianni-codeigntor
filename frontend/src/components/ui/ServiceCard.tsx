import { Card, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface ServiceCardProps {
  id: string;
  title: string;
  description: string;
  durationMin?: number | null;
  price?: number | null;
  imageSrc?: string;
}

export function ServiceCard({ id, title, description, durationMin, price, imageSrc }: ServiceCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="h-full"
    >
      <Card className="flex flex-col h-full sm:flex-row hover:shadow-lg transition-all overflow-hidden group">
        {/* Image / Icon Side */}
        <div className="relative p-6 sm:w-1/3 flex flex-col justify-center items-center text-center overflow-hidden min-h-[200px] sm:min-h-full">
          {imageSrc ? (
            <>
              <img 
                src={imageSrc} 
                alt={title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              {/* Overlay to ensure icons/text are readable */}
              <div className="absolute inset-0 bg-brand-secondary/60" />
            </>
          ) : (
            <div className="absolute inset-0 bg-brand-secondary" />
          )}
          
          <div className="relative z-10 text-brand-base">
            <Clock size={32} className="mb-4 mx-auto opacity-90" />
            {(durationMin || price) && (
              <div className="space-y-1">
                {durationMin && <span className="font-medium text-lg block">{durationMin} min</span>}
                {price && <span className="font-medium text-lg block">€ {price}</span>}
              </div>
            )}
          </div>
        </div>
        
        {/* Content Side */}
        <div className="p-6 sm:w-2/3 flex flex-col justify-between">
          <div>
            <div className="mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-secondary">
                Servizio
              </span>
            </div>
            <CardTitle className="text-xl md:text-2xl text-brand-primary mb-4 leading-snug">
              {title}
            </CardTitle>
            <p className="text-brand-contrast/80 text-sm mb-6 line-clamp-3 leading-relaxed">
              {description}
            </p>
          </div>
          
          <Link to={`/prenota?service_id=${id}`}>
            <Button 
              variant="outline" 
              className="w-full sm:w-auto mt-4 group/btn flex items-center gap-2"
            >
              Prenota Ora
              <ArrowRight size={18} className="transition-transform group-hover/btn:translate-x-1" />
            </Button>
          </Link>
        </div>
      </Card>
    </motion.div>
  );
}
