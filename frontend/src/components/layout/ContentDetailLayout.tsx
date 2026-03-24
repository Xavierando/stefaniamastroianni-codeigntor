import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";

function getObjectPositionClass(position?: string): string {
  switch (position) {
    case 'alto':
      return 'object-top';
    case 'basso':
      return 'object-bottom';
    case 'centrato':
    default:
      return 'object-center';
  }
}

interface ContentDetailLayoutProps {
  title: string;
  imageSrc?: string;
  imagePosition?: string;
  isFull?: boolean;
  backLink: string;
  backLabel: string;
  sidebar?: ReactNode;
  isMarkdown?: boolean;
  children: ReactNode;
}

export function ContentDetailLayout({
  title,
  imageSrc,
  imagePosition,
  isFull,
  backLink,
  backLabel,
  sidebar,
  isMarkdown,
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
            className={`w-full h-full object-cover opacity-80 ${getObjectPositionClass(imagePosition)}`}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-base via-transparent to-transparent" />
        
        <div className="absolute bottom-0 left-0 w-full  md:p-12">
          <div className="container mx-auto">
            <Link to={backLink} className="inline-flex items-center text-brand-primary hover:bg-primary transition-colors mb-2  rounded-full text-md font-medium">
              <ArrowLeft size={16} className="mr-2" />
              {backLabel}
            </Link>
            {(isFull) && (
              <div className="flex items-center gap-3 mb-4">
                {isFull && (
                  <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full font-medium shadow-sm">
                    Al Completo
                  </span>
                )}
              </div>
            )}
            <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-5xl pl-3 font-serif text-brand-primary leading-tight max-w-5xl">
              {title}
            </h1>
          </div>
        </div>
      </div>

      {/* Dettagli Contenuto */}
      <div className="container mx-auto px-4 mt-8 md:mt-12">
        <div className={`grid grid-cols-1 ${sidebar ? 'lg:grid-cols-3' : ''} gap-12 max-w-6xl mx-auto`}>
          
          <div className={`${sidebar ? 'lg:col-span-2' : 'col-span-1'} prose prose-lg prose-headings:font-serif prose-headings:text-brand-primary prose-p:text-brand-contrast/80`}>
            {isMarkdown ? (
              <div className="markdown-content">
                <ReactMarkdown
                  components={{
                    h1: ({node, ...props}) => <h1 className="text-4xl md:text-5xl font-serif text-brand-primary font-bold mt-12 mb-6" {...props} />,
                    h2: ({node, ...props}) => <h2 className="text-3xl md:text-4xl font-serif text-brand-primary font-bold mt-10 mb-4" {...props} />,
                    h3: ({node, ...props}) => <h3 className="text-2xl md:text-3xl font-serif text-brand-primary font-bold mt-8 mb-4" {...props} />,
                    p: ({node, ...props}) => <p className="text-brand-contrast text-lg leading-relaxed mb-6" {...props} />,
                    a: ({node, ...props}) => <a className="text-brand-secondary font-medium underline hover:text-brand-primary transition-colors" {...props} />,
                    img: ({node, ...props}) => <img className="rounded-2xl shadow-md my-10 w-full h-auto object-cover max-h-[600px]" alt={props.alt || ''} {...props} />,
                    strong: ({node, ...props}) => <strong className="text-brand-primary font-bold" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc pl-6 text-brand-contrast text-lg mb-6 space-y-2 marker:text-brand-secondary" {...props} />,
                    ol: ({node, ...props}) => <ol className="list-decimal pl-6 text-brand-contrast text-lg mb-6 space-y-2 marker:text-brand-secondary" {...props} />,
                    li: ({node, ...props}) => <li className="pl-2" {...props} />,
                    blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-brand-secondary pl-6 py-1 italic text-brand-contrast/80 my-8 text-xl" {...props} />,
                    code: ({node, ...props}: any) => {
                      const isInline = !props.className?.includes('language-');
                      return isInline 
                        ? <code className="text-brand-secondary bg-brand-primary/5 px-1.5 py-0.5 rounded text-sm font-mono" {...props} />
                        : <div className="bg-brand-primary/5 p-6 rounded-2xl overflow-x-auto text-sm my-8 border border-brand-primary/10 shadow-inner"><code className="text-brand-contrast font-mono block min-w-full" {...props} /></div>;
                    },
                  }}
                >
                  {typeof children === 'string' ? children : ''}
                </ReactMarkdown>
              </div>
            ) : (
              children
            )}
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
