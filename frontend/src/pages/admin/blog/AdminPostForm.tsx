import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { ImageOptimizer } from "@/lib/imageOptimization";

export function AdminPostForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [date, setDate] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState("");
  
  const [isLoading, setIsLoading] = useState(isEditing);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isEditing) {
      const fetchPost = async () => {
        try {
          const data = await apiFetch(`/posts/${id}`);
          if (data) {
            setTitle(data.title || "");
            setSlug(data.slug || "");
            setContent(data.content || "");
            setDate(data.date ? data.date.split("T")[0] : "");
            setCurrentImageUrl(data.imageUrl || "");
          }
        } catch (err) {
          console.error("Failed to fetch post", err);
          setError("Impossibile caricare i dati dell'articolo");
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchPost();
    }
  }, [id, isEditing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("slug", slug);
      formData.append("content", content);
      formData.append("date", date);
      
      if (imageFile) {
        // Ottimizza l'immagine prima di inviarla (max 1920px per il blog)
        const optimizedFile = await ImageOptimizer.optimizeImage(imageFile, 1920, 0.8);
        formData.append("image", optimizedFile);
      }
      
      if (isEditing) {
        formData.append("_method", "PUT");
      }

      await apiFetch(isEditing ? `/posts/${id}` : "/posts", {
        method: "POST", // File upload works best with POST (and _method=PUT for CI4)
        body: formData,
      });

      navigate("/admin/blog");
    } catch (err: any) {
      console.error("Failed to save post", err);
      setError(err.message || "Errore durante il salvataggio");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-brand-primary">Caricamento...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-brand-primary/10">
      <h2 className="text-2xl font-serif text-brand-primary mb-6">
        {isEditing ? "Modifica Articolo" : "Nuovo Articolo"}
      </h2>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm mb-6 border border-red-100">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-brand-contrast/70 mb-2">Titolo</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-brand-primary/20 focus:border-brand-primary"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-brand-contrast/70 mb-2">Slug (URL)</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="generato-automaticamente-se-vuoto"
              className="w-full px-4 py-2 rounded-xl border border-brand-primary/20 focus:border-brand-primary"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-brand-contrast/70 mb-2">Data Pubblicazione</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-brand-primary/20 focus:border-brand-primary"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-brand-contrast/70 mb-2">Immagine Copertina</label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="w-full text-sm text-brand-contrast/70 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-primary file:text-white hover:file:bg-brand-primary/90 transition-colors cursor-pointer"
            />
            {currentImageUrl && !imageFile && (
              <div className="mt-2 relative w-32 h-24 rounded-lg overflow-hidden flex-shrink-0">
                <img src={currentImageUrl} alt="Current" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-brand-contrast/70 mb-2 flex justify-between">
            <span>Contenuto (Markdown supportato)</span>
            <a href="https://www.markdownguide.org/cheat-sheet/" target="_blank" rel="noopener noreferrer" className="text-brand-secondary hover:underline text-xs">
              Guida al Markdown
            </a>
          </label>
          <textarea
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-brand-primary/20 focus:border-brand-primary font-mono text-sm leading-relaxed min-h-[400px]"
            placeholder="# Titolo (H1)&#10;## Sottotitolo (H2)&#10;&#10;Questo è un paragrafo con testo in **grassetto** e in *corsivo*.&#10;&#10;- Elemento elenco 1&#10;- Elemento elenco 2"
          />
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t border-brand-primary/10">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate("/admin/blog")}
            disabled={isSaving}
          >
            Annulla
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Salvataggio in corso..." : "Salva Articolo"}
          </Button>
        </div>
      </form>
    </div>
  );
}
