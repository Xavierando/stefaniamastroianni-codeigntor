import { useState, useEffect } from "react";
import { Trash2, Clock } from "lucide-react";
import { Card } from "../../../components/admin/ui/Card";
import { ConfirmDeleteButton } from "../../../components/admin/ui/ConfirmDeleteButton";
import { apiFetch } from "../../../lib/api";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store";
import { AdminCampaignsList } from "./AdminCampaignsList";

interface Subscriber {
  id: number;
  email: string;
  createdAt: string;
}

export function AdminNewsletterPage() {
  const [activeTab, setActiveTab] = useState<'campaigns' | 'subscribers'>('campaigns');
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif text-brand-primary mb-2">Newsletter</h1>
          <p className="text-brand-contrast/60">Gestisci gli iscritti e invia nuove comunicazioni.</p>
        </div>
      </div>

      <div className="flex gap-4 border-b border-brand-primary/10">
        <button
          onClick={() => setActiveTab('campaigns')}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === 'campaigns'
              ? 'text-brand-primary border-b-2 border-brand-primary'
              : 'text-brand-contrast/60 hover:text-brand-primary/80'
          }`}
        >
          Campagne
        </button>
        <button
          onClick={() => setActiveTab('subscribers')}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === 'subscribers'
              ? 'text-brand-primary border-b-2 border-brand-primary'
              : 'text-brand-contrast/60 hover:text-brand-primary/80'
          }`}
        >
          Iscritti
        </button>
      </div>

      <div className="pt-2">
        {activeTab === 'campaigns' ? <AdminCampaignsList /> : <SubscribersTab />}
      </div>
    </div>
  );
}

function SubscribersTab() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const token = useSelector((state: RootState) => state.auth.token);

  const loadSubscribers = async () => {
    try {
      setLoading(true);
      const data = await apiFetch("admin/subscribers", {
        headers: { Authorization: `Bearer ${token}` }
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
      await apiFetch(`admin/subscribers/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      await loadSubscribers();
    } catch (error) {
      alert("Errore durante l'eliminazione");
    }
  };

  return (
    <>
      {/* Mobile View (Cards) */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {loading ? (
          <div className="bg-white p-8 text-center text-brand-contrast/50 rounded-xl border border-brand-primary/10">
            Caricamento in corso...
          </div>
        ) : subscribers.length === 0 ? (
          <div className="bg-white p-8 text-center text-brand-contrast/50 rounded-xl border border-brand-primary/10">
            Nessun iscritto alla newsletter.
          </div>
        ) : (
          subscribers.map((subscriber) => (
            <Card key={subscriber.id} className="p-4 space-y-3 bg-white border border-brand-primary/10 font-sans shadow-sm">
              <p className="font-medium text-brand-contrast break-all">{subscriber.email}</p>
              <div className="flex items-center gap-1.5 text-sm text-brand-contrast/60">
                <Clock size={16} className="text-brand-primary/60" />
                <span>{new Date(subscriber.createdAt).toLocaleDateString('it-IT')}</span>
              </div>
              <div className="pt-2 border-t border-brand-primary/5">
                <ConfirmDeleteButton
                  onConfirm={() => handleDelete(subscriber.id)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-50 text-red-500 rounded-xl font-medium transition-colors hover:bg-red-100 !shadow-none border border-red-100 text-sm"
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
      <Card className="overflow-hidden bg-white border border-brand-primary/10 hidden md:block">
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
                <td colSpan={3} className="p-8 text-center text-brand-contrast/50">Caricamento in corso...</td>
              </tr>
            ) : subscribers.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-8 text-center text-brand-contrast/50">Nessun iscritto alla newsletter.</td>
              </tr>
            ) : (
              subscribers.map((subscriber) => (
                <tr key={subscriber.id} className="border-b border-brand-primary/5 hover:bg-brand-primary/5">
                  <td className="p-4 font-medium text-brand-contrast">{subscriber.email}</td>
                  <td className="p-4 text-brand-contrast/80">
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-brand-primary/60" />
                      {new Date(subscriber.createdAt).toLocaleDateString('it-IT')}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <ConfirmDeleteButton 
                      onConfirm={() => handleDelete(subscriber.id)}
                      className="p-2 min-h-11 min-w-11 inline-flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors !bg-transparent !shadow-none"
                      title="Elimina Iscritto"
                    >
                      <Trash2 size={18} />
                    </ConfirmDeleteButton>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      </Card>
    </>
  );
}
