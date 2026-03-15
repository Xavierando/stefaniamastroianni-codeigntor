import { useEffect, useState } from "react";
import { Card } from "../../../components/admin/ui/Card";
import { Trash2, ImageIcon } from "lucide-react";
import { ConfirmDeleteButton } from "../../../components/admin/ui/ConfirmDeleteButton";
import { GalleryUploadForm } from "./GalleryUploadForm";
import { apiFetch } from "../../../lib/api";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store";

interface GalleryImage {
  id: number;
  url: string;
  alt: string;
}

export function AdminGalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const token = useSelector((state: RootState) => state.auth.token);

  const loadImages = async () => {
    try {
      setLoading(true);
      const data = await apiFetch("gallery");
      setImages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch gallery", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadImages();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await apiFetch(`gallery/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      await loadImages();
    } catch (error) {
      console.error("Errore durante l'eliminazione", error);
      alert("Errore durante l'eliminazione");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif text-brand-primary mb-2">Galleria Immagini</h1>
          <p className="text-brand-contrast/60">Carica le foto che appariranno nella galleria pubblica del sito.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Form */}
        <div className="lg:col-span-1">
          <GalleryUploadForm onSuccess={loadImages} />
        </div>

        {/* Existing Images Grid */}
        <div className="lg:col-span-2">
          {loading ? (
             <div className="flex justify-center p-12 text-brand-contrast/50">Caricamento in corso...</div>
          ) : images.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 bg-white border border-brand-primary/10 rounded-xl text-center">
              <div className="p-4 bg-brand-primary/5 rounded-full mb-4">
                <ImageIcon size={32} className="text-brand-primary/40" />
              </div>
              <h3 className="text-lg font-medium text-brand-primary mb-1">Nessuna Immagine</h3>
              <p className="text-brand-contrast/50 max-w-sm">
                Non hai ancora caricato nessuna immagine. Usa il modulo qui a fianco per iniziare.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {images.map((image) => (
                <Card key={image.id} className="group relative overflow-hidden aspect-square border border-brand-primary/10">
                  <img 
                    src={image.url}
                    alt={image.alt || "Galleria"} 
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                    <div className="w-full flex justify-between items-center">
                      <p className="text-white text-xs truncate max-w-[70%]">{image.alt || 'Senza titolo'}</p>
                      <ConfirmDeleteButton 
                        onConfirm={() => handleDelete(image.id)}
                        className="p-1.5 bg-red-500/80 text-white rounded-md hover:bg-red-500 transition-colors backdrop-blur-sm !bg-red-500/80"
                        title="Elimina"
                      >
                        <Trash2 size={14} />
                      </ConfirmDeleteButton>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
