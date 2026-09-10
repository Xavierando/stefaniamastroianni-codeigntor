import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen } from "lucide-react";

interface OverviewProps {
  id?: string;
  title: string;
  description: string;
  imageSrc: string;
  href?: string;
  ctaText?: string;
  imagePosition?: "left" | "right";
  hideButton?: boolean;
  blogHref?: string;
  price?: number | null;
  durationMin?: number | null;
  onButtonClick?: () => void;
  alternateBackground?: boolean;
  alternateColorClass?: string;
  backgroundColorClass?: string;
}

export function ServiceOverview({
  id,
  title,
  description,
  imageSrc,
  href,
  ctaText,
  imagePosition = "left",
  hideButton = false,
  blogHref,
  price,
  durationMin,
  onButtonClick,
  alternateBackground = false,
  alternateColorClass = "bg-brand-neutral/30", // Apple-style muted gray
  backgroundColorClass = "bg-white",
}: OverviewProps) {
  return (
    <section
      id={id}
      className={cn(
        "w-full py-24 lg:py-40 px-4 lg:px-8 scroll-mt-24",
        alternateBackground ? alternateColorClass : backgroundColorClass,
      )}
    >
      <div
        className={cn(
          "container mx-auto max-w-7xl flex flex-col gap-16 lg:gap-32 items-center",
          imagePosition === "left" ? "lg:flex-row" : "lg:flex-row-reverse",
        )}
      >
        {/* Image Side - Editorial & Soft */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full lg:w-1/2"
        >
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl shadow-sm group">
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
          className="w-full lg:w-1/2 flex flex-col justify-center max-w-xl pl-0 lg:px-8"
        >
          <h2 className="font-serif text-4xl lg:text-5xl text-brand-contrast mb-8 leading-[1.15]">
            {title}
          </h2>
          <p className="text-lg md:text-xl text-brand-contrast/70 leading-relaxed mb-10 font-light md:text-justify">
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
            (() => {
              const linkClasses =
                "inline-flex w-fit items-center gap-3 text-brand-secondary font-medium group";
              const inner = (
                <>
                  <span className="relative py-1">
                    {ctaText}
                    <span className="absolute bottom-0 left-0 w-full h-[1px] bg-brand-secondary/30 group-hover:bg-brand-secondary group-hover:h-[2px] transition-all" />
                  </span>
                  <ArrowRight
                    size={18}
                    className="transform group-hover:translate-x-1 transition-transform"
                  />
                </>
              );

              if (!href) {
                return (
                  <button
                    onClick={onButtonClick}
                    className={cn(linkClasses, "focus:outline-none")}
                  >
                    {inner}
                  </button>
                );
              }

              // External links (e.g. WhatsApp) must use a plain anchor, not the
              // client-side router Link.
              if (/^https?:\/\//.test(href)) {
                return (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={onButtonClick}
                    className={linkClasses}
                  >
                    {inner}
                  </a>
                );
              }

              return (
                <Link to={href} onClick={onButtonClick} className={linkClasses}>
                  {inner}
                </Link>
              );
            })()}

          {blogHref && (
            <Link
              to={blogHref}
              className="mt-6 inline-flex w-fit items-center gap-2 text-sm font-medium text-brand-primary/70 hover:text-brand-primary transition-colors group/blog"
            >
              <BookOpen size={16} />
              <span className="border-b border-brand-primary/20 group-hover/blog:border-brand-primary pb-0.5">
                Approfondisci sul blog
              </span>
            </Link>
          )}
        </motion.div>
      </div>
    </section>
  );
}
