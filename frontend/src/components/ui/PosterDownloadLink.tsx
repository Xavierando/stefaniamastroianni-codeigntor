import { Download } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Pulsante "Scarica locandina". Il file sul server ha un nome casuale: con
 * l'attributo download si salva come "locandina-<evento>.<estensione>".
 */
export function PosterDownloadLink({
  url,
  slug,
  className,
}: {
  url: string;
  slug: string;
  className?: string;
}) {
  const extension = url.split(".").pop()?.toLowerCase() || "pdf";

  return (
    <a
      href={url}
      download={`locandina-${slug || "evento"}.${extension}`}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-bold border border-brand-primary/30 text-brand-primary h-12 px-8 hover:bg-brand-primary/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary",
        className,
      )}
    >
      <Download size={18} />
      Scarica locandina
    </a>
  );
}
