import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Save, ArrowLeft, Loader2 } from "lucide-react";
import { Card } from "../../../components/admin/ui/Card";
import { apiFetch } from "../../../lib/api";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store";

import { ImageOptimizer } from "../../../lib/imageOptimization";

export function AdminReviewForm() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const token = useSelector((state: RootState) => state.auth.token);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
  });
  
  const [image, setImage] = useState<File | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditing);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isEditing) {
      const fetchReview = async () => {
        try {
          const review = await apiFetch(`reviews/${id}`);
          
          setFormData({
            name: review.name || "",
            description: review.description || "",
            category: review.category || "",
          });
          
          if (review.imageUrl) {
            setCurrentImageUrl(review.imageUrl);
          }
        } catch (err) {
          setError("Errore nel caricamento della recensione.");
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchReview();
    }
  }, [id, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const submitData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        submitData.append(key, value);
      });
      
      if (image) {
        const optimizedFile = await ImageOptimizer.optimizeImage(image, 1024, 0.85);
        submitData.append("image", optimizedFile);
      }

      await apiFetch(isEditing ? `reviews/${id}` : "reviews", {
        method: "POST", // CodeIgniter supports POST for image uploads in _method hooks, frontend multipart uses pure POST typically
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: submitData
      });

      navigate("/admin/reviews");
    } catch (err: any) {
      setError(err.message || "Errore sconosciuto durante il salvataggio.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-brand-contrast">Caricamento in corso...</div>;
  }

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <Link to="/admin/reviews" className="p-2 text-brand-contrast/50 hover:text-brand-primary hover:bg-brand-primary/5 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-3xl font-serif text-brand-primary mb-2">
            {isEditing ? "Modifica Recensione" : "Nuova Recensione"}
          </h1>
          <p className="text-brand-contrast/60">Aggiungi o modifica una recensione o testimonianza.</p>
        </div>
      </div>

      <Card className="p-6 md:p-8 bg-white border border-brand-primary/10">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 text-red-600 border border-red-200 rounded-md">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-brand-contrast/80">
              Nome Autore *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-3 border border-brand-primary/20 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
              placeholder="es. Giulia P."
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium text-brand-contrast/80">
              Testo della Recensione *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={5}
              className="w-full p-3 border border-brand-primary/20 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary/50 resize-y"
              placeholder="Scrivi le parole del cliente..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="category" className="block text-sm font-medium text-brand-contrast/80">
                Servizio Associato (opzionale)
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-3 border border-brand-primary/20 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary/50 bg-white"
              >
                <option value="">-- Nessun Servizio Specifico --</option>
                <option value="YOGA">Yoga e Meditazione</option>
                <option value="MATERNITA">Maternità Consapevole</option>
                <option value="TRATTAMENTI">Trattamenti Olistici</option>
                <option value="CONSULENZE">Consulenze e Percorsi</option>
                <option value="ALTRI">Riti e Connessioni</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="image" className="block text-sm font-medium text-brand-contrast/80">
                Immagine Autore {isEditing ? "(Lascia vuoto per mantenere)" : "(opzionale)"}
              </label>
              {currentImageUrl && (
                <div className="mb-2">
                  <img src={currentImageUrl} alt="Current" className="h-12 w-12 object-cover rounded-full" />
                </div>
              )}
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full p-2 border border-brand-primary/20 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary/50 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-primary/10 file:text-brand-primary hover:file:bg-brand-primary/20"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 bg-brand-primary text-white px-8 py-3 rounded-full hover:bg-brand-primary/90 transition-colors font-medium shadow-sm disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Salvataggio...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Salva Recensione
                </>
              )}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}
