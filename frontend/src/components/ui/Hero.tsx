import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

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
  gradientColorClass?: string;
  onImageLoad?: () => void;
}

export function Hero({
  title,
  subtitle,
  imageSrc,
  imageAlt = "Background Image",
  ctaText,
  ctaHref,
  className,
  titleClassName = "text-white",
  subtitleClassName = "text-white/90",
  gradientColorClass = "from-brand-base",
  onImageLoad,
}: HeroProps) {
  return (
    <section className={cn("relative min-h-[60vh] md:min-h-[70vh] w-full flex items-center justify-center pt-20 overflow-hidden", className)}>
      {/* Background Image */}
      <div className="absolute inset-0 z-0 bg-brand-primary">
        <img
          src={imageSrc}
          alt={imageAlt}
          className="w-full h-full object-cover opacity-80"
          onLoad={onImageLoad}
          onError={onImageLoad}
        />
        {/* Gradient Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t ${gradientColorClass} via-transparent to-transparent`} />
      </div>

      {/* Foreground Content */}
      {(title || subtitle || ctaText) && (
        <div className="relative z-10 text-center text-brand-base px-4 max-w-4xl mx-auto flex flex-col items-center">
          {title && (
            <h1 className={cn("text-4xl md:text-6xl font-serif mb-6 leading-tight drop-shadow-lg", titleClassName)}>
              {title}
            </h1>
          )}
          {subtitle && (
            <p className={cn("text-lg md:text-xl md:max-w-2xl mx-auto mb-8 drop-shadow-md", subtitleClassName)}>
              {subtitle}
            </p>
          )}
          {ctaText && ctaHref && (
            <Link
              to={ctaHref}
              className="bg-brand-secondary hover:bg-brand-secondary/90 transition-colors text-white px-8 py-3 rounded-md text-base font-medium shadow-lg hover:shadow-xl"
            >
              {ctaText}
            </Link>
          )}
        </div>
      )}
    </section>
  );
}
