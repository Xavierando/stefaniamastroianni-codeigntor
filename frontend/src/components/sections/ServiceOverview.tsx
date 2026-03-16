import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface OverviewProps {
  title: string;
  description: string;
  imageSrc: string;
  href?: string;
  ctaText?: string;
  imagePosition?: "left" | "right";
  isLast?: boolean;
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
  isLast = false,
  hideButton = false,
  price,
  durationMin,
  onButtonClick,
  alternateBackground = false,
  alternateColorClass = "bg-brand-primary/5",
  backgroundColorClass = "bg-white",
}: OverviewProps) {
  return (
    <section
      className={cn(
        "w-full py-24 px-4 md:px-8",
        !isLast && "border-b border-brand-contrast/5",
        alternateBackground ? alternateColorClass : backgroundColorClass,
      )}
    >
      <div
        className={cn(
          "container mx-auto max-w-6xl flex flex-col gap-12 items-center",
          imagePosition === "left" ? "md:flex-row" : "md:flex-row-reverse",
        )}
      >
        {/* Image Half */}
        <div className="w-full md:w-1/2 relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
          <img
            src={imageSrc}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          />
        </div>

        <div className="w-full md:w-1/2 flex flex-col justify-center max-w-xl">
          <h2 className="font-serif text-3xl md:text-4xl text-brand-primary mb-6">
            {title}
          </h2>
          <p className="text-lg text-brand-contrast/90 leading-relaxed mb-6">
            {description}
          </p>

          {(price || durationMin) && (
            <div className="flex gap-4 mb-8 text-sm font-medium text-brand-contrast/70 uppercase tracking-widest">
              {durationMin && (
                <span className="bg-brand-primary/5 px-3 py-1 rounded-full">
                  {durationMin} min
                </span>
              )}
              {price && (
                <span className="bg-brand-primary/5 px-3 py-1 rounded-full">
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
                className="inline-flex w-fit items-center text-brand-secondary font-medium hover:text-brand-primary transition-colors group"
              >
                <span className="border-b-2 border-brand-secondary/30 group-hover:border-brand-primary group-hover:border-b-4 pb-1 transition-all">
                  {ctaText}
                </span>
                <span className="ml-2 transform group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </Link>
            ) : (
              <button
                onClick={onButtonClick}
                className="inline-flex w-fit items-center text-brand-secondary font-medium hover:text-brand-primary transition-colors group focus:outline-none"
              >
                <span className="border-b-2 border-brand-secondary/30 group-hover:border-brand-primary group-hover:border-b-4 pb-1 transition-all">
                  {ctaText}
                </span>
                <span className="ml-2 transform group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </button>
            ))}
        </div>
      </div>
    </section>
  );
}
