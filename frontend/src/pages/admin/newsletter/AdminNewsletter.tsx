import { useEffect, useState } from "react";
import { Trash2, Clock } from "lucide-react";
import { Card } from "../../../components/admin/ui/Card";
import { ConfirmDeleteButton } from "../../../components/admin/ui/ConfirmDeleteButton";
import { apiFetch } from "../../../lib/api";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store";

interface Subscriber {
  id: number;
  email: string;
  createdAt: string;
}

export function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const token = useSelector((state: RootState) => state.auth.token);

  const loadSubscribers = async () => {
    try {
      setLoading(true);
      const data = await apiFetch("newsletter", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setSubscribers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch newsletter subscribers", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubscribers();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await apiFetch(`newsletter/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      await loadSubscribers();
    } catch (error) {
      console.error("Errore durante l'eliminazione", error);
      alert("Errore durante l'eliminazione");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif text-brand-primary mb-2">Iscritti Newsletter</h1>
          <p className="text-brand-contrast/60">Gestisci gli indirizzi email degli iscritti alla tua newsletter.</p>
        </div>
      </div>

      <Card className="overflow-hidden bg-white border border-brand-primary/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-brand-primary/5 border-b border-brand-primary/10">
                <th className="p-4 font-semibold text-brand-primary">Indirizzo Email</th>
                <th className="p-4 font-semibold text-brand-primary">Data Iscrizione</th>
                <th className="p-4 text-right font-semibold text-brand-primary">Azioni</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-brand-contrast/50">
                    Caricamento in corso...
                  </td>
                </tr>
              ) : subscribers.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-brand-contrast/50">
                    Nessun iscritto alla newsletter trovato.
                  </td>
                </tr>
              ) : (
                subscribers.map((subscriber) => (
                  <tr key={subscriber.id} className="border-b border-brand-primary/5 hover:bg-brand-primary/5 transition-colors">
                    <td className="p-4">
                      <p className="font-medium text-brand-contrast">{subscriber.email}</p>
                    </td>
                    <td className="p-4 text-brand-contrast/80">
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-brand-primary/60" />
                        {new Date(subscriber.createdAt).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end">
                        <ConfirmDeleteButton 
                          onConfirm={() => handleDelete(subscriber.id)}
                          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors !bg-transparent !shadow-none min-w-0"
                          title="Elimina Iscritto"
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
