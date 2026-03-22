import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "../../../components/admin/ui/Card";
import { ConfirmDeleteButton } from "../../../components/admin/ui/ConfirmDeleteButton";
import { apiFetch } from "../../../lib/api";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store";

interface Campaign {
  id: number;
  subject: string;
  status: 'draft' | 'sending' | 'sent';
  created_at: string;
  sent_count: number;
  total_subscribers: number;
}

export function AdminCampaignsList() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = useSelector((state: RootState) => state.auth.token);

  const loadCampaigns = async () => {
    try {
      setLoading(true);
      const data = await apiFetch("admin/newsletters", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCampaigns(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch campaigns", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCampaigns();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await apiFetch(`admin/newsletters/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      await loadCampaigns();
    } catch (error) {
      alert("Errore durante l'eliminazione della campagna");
    }
  };

  const statusMap = {
    draft: { label: 'Bozza', color: 'bg-gray-100 text-gray-700' },
    sending: { label: 'In Invio', color: 'bg-blue-100 text-blue-700' },
    sent: { label: 'Inviata', color: 'bg-green-100 text-green-700' }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end mb-4">
        <button
          onClick={() => navigate("/admin/newsletter/campaigns/new")}
          className="flex items-center gap-2 bg-brand-primary text-white px-6 py-3 rounded-full hover:bg-brand-primary/90 transition-all font-medium shadow-[0_4px_20px_rgba(43,58,85,0.2)] hover:shadow-[0_6px_25px_rgba(43,58,85,0.3)] transform hover:-translate-y-0.5"
        >
          <Plus size={20} />
          <span>Nuova Campagna</span>
        </button>
      </div>

      <Card className="overflow-hidden bg-white border border-brand-primary/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-brand-primary/5 border-b border-brand-primary/10">
                <th className="p-4 font-semibold text-brand-primary">Oggetto</th>
                <th className="p-4 font-semibold text-brand-primary">Stato</th>
                <th className="p-4 font-semibold text-brand-primary">Data Creazione</th>
                <th className="p-4 font-semibold text-brand-primary">Progresso</th>
                <th className="p-4 text-right font-semibold text-brand-primary">Azioni</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-brand-contrast/50">
                    Caricamento in corso...
                  </td>
                </tr>
              ) : campaigns.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-brand-contrast/50">
                    Nessuna campagna trovata.
                  </td>
                </tr>
              ) : (
                campaigns.map((campaign) => (
                  <tr key={campaign.id} className="border-b border-brand-primary/5 hover:bg-brand-primary/5 transition-colors">
                    <td className="p-4">
                      <p className="font-medium text-brand-contrast">{campaign.subject}</p>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusMap[campaign.status].color}`}>
                        {statusMap[campaign.status].label}
                      </span>
                    </td>
                    <td className="p-4 text-brand-contrast/80">
                      {new Date(campaign.created_at).toLocaleDateString('it-IT')}
                    </td>
                    <td className="p-4 text-brand-contrast/80 text-sm">
                      {campaign.status !== 'draft' ? `${campaign.sent_count} / ${campaign.total_subscribers}` : '-'}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => navigate(`/admin/newsletter/campaigns/${campaign.id}/edit`)}
                          className="p-2 text-brand-primary/60 hover:text-brand-primary hover:bg-brand-primary/10 rounded-full transition-colors"
                          title="Modifica / Visualizza"
                        >
                          <Edit2 size={18} />
                        </button>
                        <ConfirmDeleteButton 
                          onConfirm={() => handleDelete(campaign.id)}
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
