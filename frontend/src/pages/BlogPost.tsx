import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { apiFetch } from "@/lib/api";
import { ContentDetailLayout } from "@/components/layout/ContentDetailLayout";
import { Calendar } from "lucide-react";
import { CommentList } from "@/components/comments/CommentList";
import { CommentForm } from "@/components/comments/CommentForm";
import { MarkdownRenderer } from "@/components/ui/MarkdownRenderer";

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
      <div className="bg-white p-8 rounded-[2rem] shadow-soft">
        <div className="flex items-center mb-6 pb-6 border-b border-brand-contrast/5">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-brand-primary/10 mr-4">
            {/* Immagine di fallback per l'autore */}
            <div className="w-full h-full bg-brand-primary flex items-center justify-center text-white text-xl font-serif">
              S
            </div>
          </div>
          <div>
            <p className="text-sm font-bold text-brand-contrast/50 uppercase tracking-wider mb-1">Scritto da</p>
            <p className="text-brand-contrast font-medium text-lg">Stefania Mastroianni</p>
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
      <div className="bg-brand-primary/5 p-8 rounded-[2rem] border-0 shadow-inner">
         <h3 className="text-lg font-serif text-brand-primary mb-4">Ti serve una consulenza?</h3>
         <p className="text-brand-contrast/70 mb-6 text-sm">
           Scopri come posso aiutarti nel tuo percorso di benessere e crescita personale.
         </p>
         <Link to="/consulenze" className="block text-center bg-white text-brand-primary rounded-full py-2 px-4 shadow-sm hover:bg-brand-primary hover:text-white transition-colors text-sm font-medium">
           Scopri le Consulenze
         </Link>
      </div>

      {/* Form Commenti (Spostato a destra) */}
      <div className="sticky top-28">
        <button onClick={() => {}} className="hidden" /> {/* Dummy to keep structure if needed */}
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
        <MarkdownRenderer content={post.content} />
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
