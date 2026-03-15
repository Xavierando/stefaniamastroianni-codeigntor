import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Trash2, Pencil } from "lucide-react";
import { Card } from "../../../components/admin/ui/Card";
import { ConfirmDeleteButton } from "../../../components/admin/ui/ConfirmDeleteButton";
import { apiFetch } from "../../../lib/api";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store";

interface Review {
  id: number;
  name: string;
  description: string;
  category: string;
  imageUrl?: string;
}

export function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const token = useSelector((state: RootState) => state.auth.token);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const data = await apiFetch("reviews");
      setReviews(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch reviews", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await apiFetch(`reviews/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      await loadReviews();
    } catch (error) {
      console.error("Errore durante l'eliminazione", error);
      alert("Errore durante l'eliminazione");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif text-brand-primary mb-2">Recensioni</h1>
          <p className="text-brand-contrast/60">Gestisci le testimonianze e le recensioni dei tuoi clienti.</p>
        </div>
        
        <Link 
          to="/admin/reviews/new" 
          className="flex items-center gap-2 bg-brand-primary text-white px-6 py-3 rounded-full hover:bg-brand-primary/90 transition-colors font-medium shadow-sm hover:shadow-md"
        >
          <Plus size={20} />
          Nuova Recensione
        </Link>
      </div>

      <Card className="overflow-hidden bg-white border border-brand-primary/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-brand-primary/5 border-b border-brand-primary/10">
                <th className="p-4 font-semibold text-brand-primary">Autore</th>
                <th className="p-4 font-semibold text-brand-primary">Recensione</th>
                <th className="p-4 font-semibold text-brand-primary">Servizio</th>
                <th className="p-4 text-right font-semibold text-brand-primary">Azioni</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-brand-contrast/50">
                    Caricamento in corso...
                  </td>
                </tr>
              ) : reviews.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-brand-contrast/50">
                    Nessuna recensione trovata.
                  </td>
                </tr>
              ) : (
                reviews.map((review) => (
                  <tr key={review.id} className="border-b border-brand-primary/5 hover:bg-brand-primary/5 transition-colors">
                    <td className="p-4 min-w-[200px]">
                      <div className="flex items-center gap-3">
                        {review.imageUrl ? (
                          <div className="w-10 h-10 rounded-full overflow-hidden relative hidden sm:block">
                            <img 
                              src={review.imageUrl.startsWith('http') ? review.imageUrl : `http://localhost:8081${review.imageUrl}`} 
                              alt={review.name}
                              className="object-cover w-full h-full"
                            />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-serif font-bold hidden sm:flex">
                            {review.name.charAt(0)}
                          </div>
                        )}
                        <p className="font-medium text-brand-contrast">{review.name}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-brand-contrast/80 max-w-md line-clamp-2" title={review.description}>
                        "{review.description}"
                      </p>
                    </td>
                    <td className="p-4">
                      {review.category ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-secondary/10 text-brand-secondary uppercase tracking-wider">
                          {review.category}
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2 flex-row">
                        <Link 
                          to={`/admin/reviews/${review.id}/edit`}
                          className="p-2 text-brand-primary hover:text-brand-secondary hover:bg-brand-primary/5 rounded-full transition-colors flex items-center justify-center"
                          title="Modifica"
                        >
                          <Pencil size={18} />
                        </Link>
                        
                        <ConfirmDeleteButton 
                          onConfirm={() => handleDelete(review.id)}
                          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors !bg-transparent !shadow-none min-w-0"
                          title="Elimina"
                        >
                          <Trash2 size={18} />
                        </ConfirmDeleteButton>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
