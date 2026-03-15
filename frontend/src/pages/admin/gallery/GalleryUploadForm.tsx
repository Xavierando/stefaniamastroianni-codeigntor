import { useState } from "react";
import { Card } from "../../../components/admin/ui/Card";
import { Upload, Loader2 } from "lucide-react";
import { apiFetch } from "../../../lib/api";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store";

import { ImageOptimizer } from "../../../lib/imageOptimization";

interface GalleryUploadFormProps {
  onSuccess: () => void;
}

export function GalleryUploadForm({ onSuccess }: GalleryUploadFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const token = useSelector((state: RootState) => state.auth.token);
  const [file, setFile] = useState<File | null>(null);
  const [altText, setAltText] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!file) {
      setError("Seleziona un'immagine da caricare.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const optimizedFile = await ImageOptimizer.optimizeImage(file, 2600, 0.85);

      const submitData = new FormData();
      submitData.append("image", optimizedFile);
      submitData.append("alt", altText);

      await apiFetch("gallery", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: submitData
      });

      // Reset form
      setFile(null);
      setAltText("");
      const fileInput = document.getElementById("image") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
      
      onSuccess();
    } catch (err: any) {
      console.error("Upload failed:", err);
      setError(err.message || "Errore durante il caricamento dell'immagine.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="p-6 bg-brand-primary/5 border border-brand-primary/10 sticky top-10">
      <h2 className="text-xl font-serif text-brand-primary mb-4 flex items-center gap-2">
        <Upload size={20} />
        Carica Nuova
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-md text-sm">
            {error}
          </div>
        )}
        <div className="space-y-2">
          <label htmlFor="image" className="block text-sm font-medium text-brand-contrast/80">
            Seleziona File
          </label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            required
            onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
            className="w-full text-sm text-brand-contrast/70 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-primary file:text-white hover:file:bg-brand-primary/90 transition-colors"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="alt" className="block text-sm font-medium text-brand-contrast/80">
            Testo Alternativo (SEO)
          </label>
          <input
            type="text"
            id="alt"
            name="alt"
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
            className="w-full p-2 text-sm border border-brand-primary/20 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
            placeholder="es. Stefania durante un cerchio di donne"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting || !file}
          className="w-full flex justify-center items-center gap-2 bg-brand-primary text-white py-2.5 rounded-md hover:bg-brand-primary/90 transition-colors font-medium shadow-sm disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Caricamento...
            </>
          ) : (
            "Carica Immagine"
          )}
        </button>
      </form>
    </Card>
  );
}
