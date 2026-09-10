import { Card, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Clock, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useContactCta } from "@/hooks/useContactCta";
import { Link } from "react-router-dom";

interface ServiceCardProps {
  id: string;
  title: string;
  description: string;
  durationMin?: number | null;
  price?: number | null;
  imageSrc?: string;
}

export function ServiceCard({ title, description, durationMin, price, imageSrc }: ServiceCardProps) {
  const { whatsappEnabled, contactTarget } = useContactCta();
  const target = contactTarget(
    `Ciao Stefania! Vorrei informazioni sul servizio "${title}".`,
  );
  const ctaLabel = whatsappEnabled ? "Scrivimi su WhatsApp" : "Richiedi informazioni";
  const ctaButton = (
    <Button
      variant="outline"
      className="w-full sm:w-auto mt-4 group/btn flex items-center gap-2"
    >
      {ctaLabel}
      <ArrowRight size={18} className="transition-transform group-hover/btn:translate-x-1" />
    </Button>
  );

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
                loading="lazy"
                decoding="async"
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
            <p className="text-brand-contrast/80 text-base md:text-lg mb-6 line-clamp-3 leading-relaxed">
              {description}
            </p>
          </div>
          
          {target.external ? (
            <a href={target.href} target="_blank" rel="noopener noreferrer">
              {ctaButton}
            </a>
          ) : (
            <Link to={target.href}>
              {ctaButton}
            </Link>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
