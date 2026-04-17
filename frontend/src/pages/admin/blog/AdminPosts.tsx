import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { apiFetch } from "@/lib/api";
import { ConfirmDeleteButton } from "@/components/admin/ui/ConfirmDeleteButton";
import { Card } from "../../../components/admin/ui/Card";

export function AdminPosts() {
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const data = await apiFetch("/posts");
      setPosts(data || []);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
      setError("Impossibile caricare gli articoli");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await apiFetch(`/posts/${id}`, { method: "DELETE" });
      fetchPosts();
    } catch (err) {
      console.error("Failed to delete post:", err);
      alert("Errore durante l'eliminazione dell'articolo");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-serif text-brand-primary">Gestione Blog</h2>
        <Link to="/admin/blog/new">
          <Button className="flex items-center gap-2">
            <Plus size={20} />
            Nuovo Articolo
          </Button>
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm mb-6 border border-red-100">
          {error}
        </div>
      )}

      {/* Mobile View (Cards) */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {isLoading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-brand-primary/10">
            <p className="text-brand-contrast/60 mb-4">Nessun articolo trovato.</p>
            <Link to="/admin/blog/new">
              <Button variant="outline">Crea il tuo primo articolo</Button>
            </Link>
          </div>
        ) : (
          posts.map((post) => (
            <Card key={post.id} className="p-4 space-y-4 bg-white border border-brand-primary/10 font-sans shadow-sm">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="font-medium text-lg text-brand-primary leading-tight">{post.title}</h3>
                  <p className="text-xs text-brand-contrast/50">/{post.slug}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-brand-contrast/60">
                    {post.date ? new Date(post.date).toLocaleDateString("it-IT") : "-"}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t border-brand-primary/5">
                <Link to={`/admin/blog/${post.id}/edit`} className="flex-1">
                  <Button variant="outline" className="w-full flex items-center justify-center gap-2 py-2.5 bg-brand-primary/5 text-brand-primary rounded-xl font-medium transition-colors hover:bg-brand-primary/10 border-brand-primary/10 h-auto">
                    <Edit2 size={16} />
                    Modifica
                  </Button>
                </Link>
                <ConfirmDeleteButton 
                  onConfirm={() => handleDelete(post.id)}
                  confirmMessage="Sei sicuro di voler eliminare questo articolo?"
                  variant="outline"
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-50 text-red-500 rounded-xl font-medium transition-colors hover:bg-red-100 border-red-100 h-auto"
                >
                  <Trash2 size={16} />
                  Elimina
                </ConfirmDeleteButton>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Desktop View (Table) */}
      {isLoading ? (
        <div className="flex justify-center p-12 hidden md:flex">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-brand-primary/10 hidden md:block">
          <p className="text-brand-contrast/60 mb-4">Nessun articolo trovato.</p>
          <Link to="/admin/blog/new">
            <Button variant="outline">Crea il tuo primo articolo</Button>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-brand-primary/10 overflow-hidden hidden md:block">
          <table className="w-full text-left border-collapse p-4">
            <thead>
              <tr className="bg-brand-primary/5 border-b border-brand-primary/10">
                <th className="p-4 font-serif text-brand-primary font-medium">Data</th>
                <th className="p-4 font-serif text-brand-primary font-medium">Titolo</th>
                <th className="p-4 font-serif text-brand-primary font-medium text-right">Azioni</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-b border-brand-primary/5 hover:bg-brand-primary/5 transition-colors">
                  <td className="p-4 text-brand-contrast border-brand-primary/5 whitespace-nowrap">
                    {post.date ? new Date(post.date).toLocaleDateString("it-IT") : "-"}
                  </td>
                  <td className="p-4 text-brand-contrast">
                    <div className="font-medium text-brand-primary mb-1">{post.title}</div>
                    <div className="text-xs text-brand-contrast/50">/{post.slug}</div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link to={`/admin/blog/${post.id}/edit`}>
                        <Button variant="outline" size="sm" className="h-8 w-8 flex items-center justify-center p-0 text-brand-secondary hover:bg-brand-secondary hover:text-white border-brand-secondary/30">
                          <Edit2 size={14} />
                        </Button>
                      </Link>
                      
                      <ConfirmDeleteButton 
                        onConfirm={() => handleDelete(post.id)}
                        confirmMessage="Sei sicuro di voler eliminare questo articolo? L'operazione è irreversibile."
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 text-red-500 hover:bg-red-50 hover:border-red-200 border-red-500/30 hover:text-red-600 flex items-center justify-center p-0"
                      >
                        <Trash2 size={14} />
                      </ConfirmDeleteButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
