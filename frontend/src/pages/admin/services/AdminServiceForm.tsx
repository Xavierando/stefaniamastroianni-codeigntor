import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Save, ArrowLeft, Loader2 } from "lucide-react";
import { Card } from "../../../components/admin/ui/Card";
import { apiFetch } from "../../../lib/api";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store";
import { Category, CategoryLabels } from "../../../types";

import { ImageOptimizer } from "../../../lib/imageOptimization";

export function AdminServiceForm() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const token = useSelector((state: RootState) => state.auth.token);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    price: "",
    duration: "",
    is_booking_enabled: "1",
  });
  
  const [image, setImage] = useState<File | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditing);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isEditing) {
      const fetchService = async () => {
        try {
          const service = await apiFetch(`services/${id}`);
          
          setFormData({
            title: service.title || "",
            category: service.category || "",
            description: service.description || "",
            price: service.price?.toString() || "",
            duration: service.duration || "",
            is_booking_enabled: service.is_booking_enabled?.toString() ?? "1",
          });
          
          if (service.imageUrl) {
            setCurrentImageUrl(service.imageUrl);
          }
        } catch (err) {
          setError("Errore nel caricamento del servizio.");
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchService();
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
        const optimizedFile = await ImageOptimizer.optimizeImage(image, 1920, 0.85);
        submitData.append("image", optimizedFile);
      }

      await apiFetch(isEditing ? `services/${id}` : "services", {
        method: isEditing ? "POST" : "POST", // CI4 uses POST with _method=PUT usually for multipart/form-data, but we will assume standard POST for now
        headers: {
          Authorization: `Bearer ${token}`
          // Don't set Content-Type for FormData, the browser will do it
        },
        body: submitData
      });

      navigate("/admin/services");
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
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Link to="/admin/services" className="p-2 text-brand-contrast/50 hover:text-brand-primary hover:bg-brand-primary/5 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-3xl font-serif text-brand-primary mb-2">
            {isEditing ? "Modifica Servizio" : "Nuovo Servizio"}
          </h1>
          <p className="text-brand-contrast/60">Compila i campi per pubblicare un nuovo contenuto sul sito.</p>
        </div>
      </div>

      <Card className="p-6 md:p-8 bg-white border border-brand-primary/10">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 text-red-600 border border-red-200 rounded-md">
              {error}
            </div>
          )}

          {/* Core Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="title" className="block text-sm font-medium text-brand-contrast/80">
                Titolo *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full p-3 border border-brand-primary/20 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-transparent transition-shadow"
                placeholder="es. Massaggio Ayurvedico o Cerchio di Luna"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="category" className="block text-sm font-medium text-brand-contrast/80">
                Categoria *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full p-3 border border-brand-primary/20 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary/50 bg-white"
              >
                <option value="">Seleziona...</option>
                {(Object.values(Category) as Category[]).map((cat) => (
                  <option key={cat} value={cat}>
                    {CategoryLabels[cat]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium text-brand-contrast/80">
              Descrizione Completa *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={5}
              className="w-full p-3 border border-brand-primary/20 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary/50 resize-y"
              placeholder="Descrivi di cosa si tratta..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="price" className="block text-sm font-medium text-brand-contrast/80">
                Prezzo (opzionale)
              </label>
              <input
                type="text"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full p-3 border border-brand-primary/20 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
                placeholder="es. 50"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="duration" className="block text-sm font-medium text-brand-contrast/80">
                Durata (opzionale)
              </label>
              <input
                type="text"
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="w-full p-3 border border-brand-primary/20 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
                placeholder="es. 60 min"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="image" className="block text-sm font-medium text-brand-contrast/80">
              Immagine di Copertina {isEditing ? "(Lascia vuoto per mantenere)" : "(opzionale)"}
            </label>
            {currentImageUrl && (
              <div className="mb-2">
                <img src={currentImageUrl} alt="Current" className="h-24 object-cover rounded" />
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

          {/* Booking Enabled Toggle */}
          <div className="bg-brand-primary/5 p-4 rounded-md border border-brand-primary/10">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="is_booking_enabled"
                checked={formData.is_booking_enabled === "1"}
                onChange={(e) => setFormData(prev => ({ ...prev, is_booking_enabled: e.target.checked ? "1" : "0" }))}
                className="w-5 h-5 text-brand-primary border-brand-primary/20 rounded focus:ring-brand-primary"
              />
              <label htmlFor="is_booking_enabled" className="font-medium text-brand-primary">
                Abilita Prenotazioni per questo servizio
              </label>
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
                  Salva Pubblicazione
                </>
              )}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}
