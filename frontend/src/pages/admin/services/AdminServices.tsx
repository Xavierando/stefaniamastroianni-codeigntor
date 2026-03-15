import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Trash2, Calendar, LayoutList, Pencil } from "lucide-react";
import { Card } from "../../../components/admin/ui/Card";
import { ConfirmDeleteButton } from "../../../components/admin/ui/ConfirmDeleteButton";
import { apiFetch } from "../../../lib/api";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store";

interface Service {
  id: number;
  title: string;
  description: string;
  category: string;
  isEvent: boolean;
  eventDate?: string;
  price?: number;
}

export function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const token = useSelector((state: RootState) => state.auth.token);

  const loadServices = async () => {
    try {
      setLoading(true);
      const data = await apiFetch("services");
      setServices(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch services", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await apiFetch(`services/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      await loadServices();
    } catch (error) {
      console.error("Errore durante l'eliminazione", error);
      alert("Errore durante l'eliminazione");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif text-brand-primary mb-2">Servizi ed Eventi</h1>
          <p className="text-brand-contrast/60">Gestisci le tue consulenze, i trattamenti e i laboratori.</p>
        </div>
        
        <Link 
          to="/admin/services/new" 
          className="flex items-center gap-2 bg-brand-primary text-white px-6 py-3 rounded-full hover:bg-brand-primary/90 transition-colors font-medium shadow-sm hover:shadow-md"
        >
          <Plus size={20} />
          Nuovo Servizio/Evento
        </Link>
      </div>

      <Card className="overflow-hidden bg-white border border-brand-primary/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-brand-primary/5 border-b border-brand-primary/10">
                <th className="p-4 font-semibold text-brand-primary">Titolo</th>
                <th className="p-4 font-semibold text-brand-primary">Categoria</th>
                <th className="p-4 font-semibold text-brand-primary">Tipo</th>
                <th className="p-4 font-semibold text-brand-primary">Prezzo</th>
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
              ) : services.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-brand-contrast/50">
                    Nessun servizio o evento trovato. Aggiungine uno nuovo!
                  </td>
                </tr>
              ) : (
                services.map((service) => (
                  <tr key={service.id} className="border-b border-brand-primary/5 hover:bg-brand-primary/5 transition-colors">
                    <td className="p-4">
                      <p className="font-medium text-brand-contrast">{service.title}</p>
                      {service.isEvent && service.eventDate && (
                        <p className="text-sm text-brand-contrast/60 font-medium mt-1">
                          📅 {new Date(service.eventDate).toLocaleDateString('it-IT')}
                        </p>
                      )}
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-primary/10 text-brand-primary uppercase tracking-wider">
                        {service.category}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-brand-contrast/70">
                        {service.isEvent ? <Calendar size={16} /> : <LayoutList size={16} />}
                        <span>{service.isEvent ? "Evento" : "Servizio Fisso"}</span>
                      </div>
                    </td>
                    <td className="p-4 text-brand-contrast/80">
                      {service.price ? `€${service.price}` : "-"}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex flex-row gap-2 justify-end">
                          <Link 
                            to={`/admin/services/${service.id}/edit`}
                            className="p-2 text-brand-primary hover:text-brand-secondary hover:bg-brand-primary/5 rounded-full transition-colors flex items-center justify-center"
                            title="Modifica"
                          >
                            <Pencil size={18} />
                          </Link>
                          
                          <ConfirmDeleteButton 
                            onConfirm={() => handleDelete(service.id)}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors !bg-transparent !shadow-none min-w-0"
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
