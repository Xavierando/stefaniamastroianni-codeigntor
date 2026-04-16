import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface OverviewProps {
  title: string;
  description: string;
  imageSrc: string;
  href?: string;
  ctaText?: string;
  imagePosition?: "left" | "right";
  hideButton?: boolean;
  price?: number | null;
  durationMin?: number | null;
  onButtonClick?: () => void;
  alternateBackground?: boolean;
  alternateColorClass?: string;
  backgroundColorClass?: string;
}

export function ServiceOverview({
  title,
  description,
  imageSrc,
  href,
  ctaText,
  imagePosition = "left",
  hideButton = false,
  price,
  durationMin,
  onButtonClick,
  alternateBackground = false,
  alternateColorClass = "bg-brand-neutral/30", // Apple-style muted gray
  backgroundColorClass = "bg-white",
}: OverviewProps) {
  return (
    <section
      className={cn(
        "w-full py-24 md:py-40 px-4 md:px-8",
        alternateBackground ? alternateColorClass : backgroundColorClass,
      )}
    >
      <div
        className={cn(
          "container mx-auto max-w-7xl flex flex-col gap-16 md:gap-32 items-center",
          imagePosition === "left" ? "md:flex-row" : "md:flex-row-reverse",
        )}
      >
        {/* Image Side - Editorial & Soft */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full md:w-1/2"
        >
          <div className="relative aspect-[4/3] overflow-hidden rounded-[2.5rem] shadow-sm group">
            <img
              src={imageSrc}
              alt={title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
          </div>
        </motion.div>

        {/* Content Side - Clean, Professional */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          className="w-full md:w-1/2 flex flex-col justify-center max-w-xl pl-0 md:px-8"
        >
          <h2 className="font-serif text-4xl md:text-5xl text-brand-contrast mb-8 leading-[1.15]">
            {title}
          </h2>
          <p className="text-xl text-brand-contrast/70 leading-relaxed mb-10 font-light">
            {description}
          </p>

          {(price || durationMin) && (
            <div className="flex gap-4 mb-12 text-[10px] font-bold text-brand-secondary uppercase tracking-[0.2em]">
              {durationMin && (
                <span className="flex items-center gap-2 bg-brand-neutral/50 px-3 py-1.5 rounded-full">
                  {durationMin} min
                </span>
              )}
              {price && (
                <span className="flex items-center gap-2 bg-brand-neutral/50 px-3 py-1.5 rounded-full">
                  €{price}
                </span>
              )}
            </div>
          )}

          {!hideButton &&
            ctaText &&
            (href ? (
              <Link
                to={href}
                onClick={onButtonClick}
                className="inline-flex w-fit items-center gap-3 text-brand-primary font-medium group"
              >
                <span className="relative py-1">
                  {ctaText}
                  <span className="absolute bottom-0 left-0 w-full h-[1px] bg-brand-primary/30 group-hover:bg-brand-primary group-hover:h-[2px] transition-all" />
                </span>
                <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <button
                onClick={onButtonClick}
                className="inline-flex w-fit items-center gap-3 text-brand-primary font-medium group focus:outline-none"
              >
                <span className="relative py-1">
                  {ctaText}
                  <span className="absolute bottom-0 left-0 w-full h-[1px] bg-brand-primary/30 group-hover:bg-brand-primary group-hover:h-[2px] transition-all" />
                </span>
                <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
              </button>
            ))}
        </motion.div>
      </div>
    </section>
  );
}
