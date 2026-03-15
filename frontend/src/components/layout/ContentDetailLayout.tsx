import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface ContentDetailLayoutProps {
  title: string;
  imageSrc?: string;
  category?: string;
  isFull?: boolean;
  backLink: string;
  backLabel: string;
  sidebar?: ReactNode;
  children: ReactNode;
}

export function ContentDetailLayout({
  title,
  imageSrc,
  category,
  isFull,
  backLink,
  backLabel,
  sidebar,
  children,
}: ContentDetailLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-brand-base pb-24">
      {/* Immagine di Copertina e Intestazione */}
      <div className="relative w-full h-[40vh] md:h-[50vh] bg-brand-primary overflow-hidden">
        {imageSrc && (
          <img 
            src={imageSrc} 
            alt={title}
            className="w-full h-full object-cover opacity-80"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-base via-transparent to-transparent" />
        
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 mb-8">
          <div className="container mx-auto">
            <Link to={backLink} className="inline-flex items-center text-brand-primary hover:text-brand-secondary transition-colors mb-6 bg-white/80 px-3 py-1 rounded-full text-sm font-medium">
              <ArrowLeft size={16} className="mr-2" />
              {backLabel}
            </Link>
            {(category || isFull) && (
              <div className="flex items-center gap-3 mb-4">
                {category && (
                  <span className="bg-brand-secondary text-white text-xs px-3 py-1 rounded-full font-medium uppercase tracking-wider shadow-sm">
                    {category}
                  </span>
                )}
                {isFull && (
                  <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full font-medium shadow-sm">
                    Al Completo
                  </span>
                )}
              </div>
            )}
            <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-5xl font-serif text-brand-primary leading-tight max-w-5xl">
              {title}
            </h1>
          </div>
        </div>
      </div>

      {/* Dettagli Contenuto */}
      <div className="container mx-auto px-4 mt-8 md:mt-12">
        <div className={`grid grid-cols-1 ${sidebar ? 'lg:grid-cols-3' : ''} gap-12 max-w-6xl mx-auto`}>
          
          <div className={`${sidebar ? 'lg:col-span-2' : 'col-span-1'} prose prose-lg prose-headings:font-serif prose-headings:text-brand-primary prose-p:text-brand-contrast/80`}>
            {children}
          </div>

          {sidebar && (
            <div className="lg:col-span-1">
              {sidebar}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
