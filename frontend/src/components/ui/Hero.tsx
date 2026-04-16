import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface HeroProps {
  title?: string;
  subtitle?: string;
  imageSrc: string;
  imageAlt?: string;
  ctaText?: string;
  ctaHref?: string;
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  imagePosition?: "top" | "bottom" | "center";
}

export function Hero({
  title,
  subtitle,
  imageSrc,
  imageAlt = "Stefania Mastroianni",
  ctaText,
  ctaHref,
  className,
  titleClassName,
  subtitleClassName,
  imagePosition = "center",
}: HeroProps) {
  const getObjectPositionClass = () => {
    switch (imagePosition) {
      case "top":
        return "object-top";
      case "bottom":
        return "object-bottom";
      case "center":
      default:
        return "object-center";
    }
  };

  const hasText = title || subtitle || ctaText;

  if (!hasText) {
    return (
      <section
        className={cn(
          "relative w-full h-[70vh] md:h-[90vh] flex items-center justify-center overflow-hidden bg-brand-base",
          className,
        )}
      >
        <motion.div
          initial={{ scale: 1.05, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 z-0 w-full h-full"
        >
          <img
            src={imageSrc}
            alt={imageAlt}
            className={`w-full h-full object-cover ${getObjectPositionClass()}`}
          />
          {/* Subtle bottom fade gradient to blend with the next section */}
          <div className="absolute bottom-0 left-0 right-0 h-[30%] bg-gradient-to-t from-brand-base to-transparent z-10 pointer-events-none" />
        </motion.div>
      </section>
    );
  }

  return (
    <section
      className={cn(
        "relative w-full flex items-center justify-center pt-28 md:pt-32 pb-16 md:pb-24 overflow-hidden bg-brand-base",
        className,
      )}
    >
      <div className="container mx-auto px-4 relative z-10 w-full">
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Image Side - Photography Driven (Mobile First: Order 1) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            className="lg:col-span-7 order-first lg:order-last relative h-[60vh] lg:h-[80vh] w-full rounded-[2.5rem] overflow-hidden shadow-soft"
          >
            <img
              src={imageSrc}
              alt={imageAlt}
              className={`absolute inset-0 w-full h-full object-cover ${getObjectPositionClass()}`}
            />
          </motion.div>

          {/* Content Side - Editorial Left (Mobile Second: Order 2) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-5 order-last lg:order-first flex flex-col items-center lg:items-start text-center lg:text-left z-10 mt-4 lg:mt-0"
          >
            {title && (
              <h1
                className={cn(
                  "text-4xl sm:text-5xl md:text-7xl font-serif mb-6 leading-[1.1] text-brand-contrast",
                  titleClassName,
                )}
              >
                {title}
              </h1>
            )}
            {subtitle && (
              <p
                className={cn(
                  "text-lg md:text-xl font-sans mb-10 max-w-lg text-brand-contrast/70 leading-relaxed font-light",
                  subtitleClassName,
                )}
              >
                {subtitle}
              </p>
            )}
            {ctaText && ctaHref && (
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  to={ctaHref}
                  className="bg-brand-primary text-white hover:bg-brand-primary/90 transition-all px-10 py-4 rounded-full text-lg font-medium shadow-sm"
                >
                  {ctaText}
                </Link>
              </motion.div>
            )}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
