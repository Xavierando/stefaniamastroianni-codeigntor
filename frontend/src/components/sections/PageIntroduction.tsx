import { type ReactNode } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

interface PageIntroductionProps {
  title: string;
  description: ReactNode;
  as?: "h1" | "h2";
  variant?: "default" | "editorial";
  ctaText?: string;
  ctaHref?: string;
  showBorder?: boolean;
  className?: string;
  maxWidth?: string;
}

export function PageIntroduction({
  title,
  description,
  as: Tag = "h1",
  variant = "default",
  ctaText,
  ctaHref,
  showBorder = false,
  className,
  maxWidth = "max-w-6xl",
}: PageIntroductionProps) {
  return (
    <section
      className={cn(
        "w-full pt-6 md:pt-24 pb-6 px-4 bg-brand-base text-center relative overflow-hidden",
        showBorder && "border-b border-brand-contrast/5",
        className,
      )}
    >
      <div
        className={cn("container mx-auto flex flex-col items-center", maxWidth)}
      >
        <Tag
          className={cn(
            "font-serif mb-8 leading-tight",
            variant === "editorial"
              ? "text-4xl lg:text-5xl italic text-brand-primary max-w-4xl"
              : "text-4xl md:text-5xl text-brand-contrast",
          )}
        >
          {title}
        </Tag>

        {/* Su mobile il testo appare allo scroll; il titolo resta visibile */}
        <RevealOnScroll className="flex flex-col items-center w-full">
          {typeof description === "string" ? (
            <p
              className={cn(
                "text-brand-contrast/80 leading-relaxed font-light text-xl md:text-2xl",
                ctaText ? "mb-12" : "",
              )}
            >
              {description}
            </p>
          ) : (
            <div
              className={cn(
                "text-brand-contrast/80 leading-relaxed font-light text-xl md:text-2xl",
                ctaText ? "mb-12" : "",
              )}
            >
              {description}
            </div>
          )}

          {ctaText && ctaHref && (
            <Link
              to={ctaHref}
              className="inline-flex items-center justify-center rounded-full font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary bg-brand-primary text-white hover:bg-brand-primary/90 h-14 px-10 text-lg shadow-sm"
            >
              {ctaText}
            </Link>
          )}
        </RevealOnScroll>
      </div>
    </section>
  );
}
