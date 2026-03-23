import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { apiFetch } from "@/lib/api";
import { ContentDetailLayout } from "@/components/layout/ContentDetailLayout";
import { Calendar } from "lucide-react";
import { CommentList } from "@/components/comments/CommentList";
import { CommentForm } from "@/components/comments/CommentForm";

export function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPost() {
      try {
        setIsLoading(true);
        const data = await apiFetch(`/posts/${slug}`);
        if (data) {
          setPost(data);
        } else {
          setError("Articolo non trovato");
        }
      } catch (err: any) {
        console.error("Failed to fetch post data:", err);
        setError("Errore nel caricamento dell'articolo");
      } finally {
        setIsLoading(false);
      }
    }

    if (slug) {
      fetchPost();
    }
  }, [slug]);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-brand-base items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="flex flex-col min-h-screen bg-brand-base items-center justify-center text-center p-4">
        <h2 className="text-2xl font-serif text-brand-primary mb-4">{error || "Articolo non trovato"}</h2>
        <Link to="/blog" className="text-brand-secondary hover:underline">
          Torna al Blog
        </Link>
      </div>
    );
  }

  const formattedDate = post.date 
    ? new Date(post.date).toLocaleDateString("it-IT", { day: 'numeric', month: 'long', year: 'numeric' }) 
    : undefined;

  const Sidebar = (
    <div className="space-y-8">
      {/* Informazioni Autore/Data */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-brand-primary/10">
        <div className="flex items-center mb-6 pb-6 border-b border-brand-primary/10">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-brand-primary/10 mr-4">
            {/* Immagine di fallback per l'autore */}
            <div className="w-full h-full bg-brand-primary flex items-center justify-center text-white text-xl font-serif">
              S
            </div>
          </div>
          <div>
            <p className="text-sm font-bold text-brand-contrast/50 uppercase tracking-wider mb-1">Scritto da</p>
            <p className="text-brand-primary font-medium text-lg">Stefania Mastroianni</p>
          </div>
        </div>

        {formattedDate && (
          <div className="flex items-center text-brand-contrast/70">
            <Calendar size={18} className="mr-3 text-brand-secondary" />
            <span>Pubblicato il {formattedDate}</span>
          </div>
        )}
      </div>

      {/* Condivisione o Altri Link utili */}
      <div className="bg-brand-primary/5 p-8 rounded-2xl border border-brand-primary/10">
         <h3 className="text-lg font-serif text-brand-primary mb-4">Ti serve una consulenza?</h3>
         <p className="text-brand-contrast/70 mb-6 text-sm">
           Scopri come posso aiutarti nel tuo percorso di benessere e crescita personale.
         </p>
         <Link to="/consulenze" className="block text-center bg-white border border-brand-primary text-brand-primary rounded-full py-2 px-4 hover:bg-brand-primary hover:text-white transition-colors text-sm font-medium">
           Scopri le Consulenze
         </Link>
      </div>

      {/* Form Commenti (Spostato a destra) */}
      <div className="sticky top-28">
        <CommentForm postId={post.id} />
      </div>
    </div>
  );

  return (
    <ContentDetailLayout
      title={post.title}
      imageSrc={post.imageUrl}
      backLink="/blog"
      backLabel="Torna al Blog"
      sidebar={Sidebar}
    >
      <div className="mb-12">
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
            {post.content || ''}
          </ReactMarkdown>
        </div>
      </div>

      {/* Sezione Commenti */}
      <div className="mt-16 pt-16 border-t border-brand-primary/10">
        <h3 className="text-3xl font-serif text-brand-primary mb-8 px-4 md:px-0">Commenti</h3>
        
        <div className="max-w-3xl">
          <CommentList postId={post.id} />
        </div>
      </div>
    </ContentDetailLayout>
  );
}
