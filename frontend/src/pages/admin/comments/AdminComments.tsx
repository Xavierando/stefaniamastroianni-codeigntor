import { useEffect, useState } from "react";
import { Check, Trash2, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { apiFetch } from "@/lib/api";
import { Link } from "react-router-dom";
import { ConfirmDeleteButton } from "@/components/admin/ui/ConfirmDeleteButton";

export function AdminComments() {
  const [comments, setComments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('pending');

  const fetchComments = async () => {
    try {
      setIsLoading(true);
      const data = await apiFetch(`/comments?status=${filter}`);
      setComments(data || []);
    } catch (err) {
      console.error("Failed to fetch comments", err);
      setError("Impossibile caricare i commenti");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [filter]);

  const handleUpdateStatus = async (id: number, isApproved: boolean) => {
    try {
      await apiFetch(`/comments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isApproved: isApproved ? 1 : 0 }),
      });
      fetchComments();
    } catch (err) {
      console.error("Failed to update comment:", err);
      alert("Errore durante l'aggiornamento del commento");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await apiFetch(`/comments/${id}`, { method: "DELETE" });
      fetchComments();
    } catch (err) {
      console.error("Failed to delete comment:", err);
      alert("Errore durante l'eliminazione del commento");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-3xl font-serif text-brand-primary">Gestione Commenti</h2>
        
        <div className="flex bg-white rounded-xl border border-brand-primary/10 overflow-hidden shadow-sm">
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${filter === 'pending' ? 'bg-brand-primary/10 text-brand-primary' : 'text-brand-contrast/60 hover:bg-brand-primary/5'}`}
          >
            Da Approvare
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-4 py-2 text-sm font-medium transition-colors border-l border-brand-primary/10 ${filter === 'approved' ? 'bg-brand-primary/10 text-brand-primary' : 'text-brand-contrast/60 hover:bg-brand-primary/5'}`}
          >
            Approvati
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 text-sm font-medium transition-colors border-l border-brand-primary/10 ${filter === 'all' ? 'bg-brand-primary/10 text-brand-primary' : 'text-brand-contrast/60 hover:bg-brand-primary/5'}`}
          >
            Tutti
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm mb-6 border border-red-100">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
        </div>
      ) : comments.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-brand-primary/10">
          <p className="text-brand-contrast/60">Nessun commento trovato.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-white p-6 rounded-2xl shadow-sm border border-brand-primary/10 flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-serif text-lg text-brand-primary">{comment.name}</h4>
                    <p className="text-xs text-brand-contrast/50">
                      {new Date(comment.createdAt).toLocaleDateString("it-IT", {
                        day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full border ${Number(comment.isApproved) === 1 ? 'bg-green-50 text-green-700 border-green-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>
                      {Number(comment.isApproved) === 1 ? "Approvato" : "In attesa"}
                    </span>
                  </div>
                </div>
                
                <p className="text-brand-contrast/80 whitespace-pre-wrap text-sm border-l-2 border-brand-primary/20 pl-4 py-1 italic mb-4">
                  "{comment.message}"
                </p>

                <div className="flex items-center text-xs text-brand-secondary">
                  <span className="mr-2">Articolo:</span>
                  <Link to={`/admin/blog/${comment.postId}/edit`} className="hover:underline flex items-center">
                    ID #{comment.postId} <ArrowUpRight size={12} className="ml-1" />
                  </Link>
                </div>
              </div>

              <div className="flex md:flex-col justify-end gap-2 border-t md:border-t-0 md:border-l border-brand-primary/10 pt-4 md:pt-0 md:pl-6 min-w-[120px]">
                {Number(comment.isApproved) === 1 ? null : (
                  <Button 
                    variant="primary" 
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => handleUpdateStatus(comment.id, true)}
                  >
                    <Check size={16} className="mr-2" /> Approva
                  </Button>
                )}
                
                <ConfirmDeleteButton 
                  onConfirm={() => handleDelete(comment.id)}
                  confirmMessage="Sei sicuro di voler eliminare questo commento? L'operazione è irreversibile."
                  variant="outline"
                  className="w-full text-red-500 border-red-500/30 hover:bg-red-50 hover:border-red-300 hover:text-red-600"
                >
                  <Trash2 size={16} className="mr-2" /> Elimina
                </ConfirmDeleteButton>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
