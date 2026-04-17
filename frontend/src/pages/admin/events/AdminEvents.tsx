import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Trash2, Calendar, Pencil } from "lucide-react";
import { Card } from "../../../components/admin/ui/Card";
import { ConfirmDeleteButton } from "../../../components/admin/ui/ConfirmDeleteButton";
import { apiFetch } from "../../../lib/api";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store";

interface Event {
  id: number;
  title: string;
  description: string;
  category: string;
  date?: string;
  location?: string;
  price?: number;
}

export function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const token = useSelector((state: RootState) => state.auth.token);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const data = await apiFetch("events");
      setEvents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch events", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await apiFetch(`events/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      await loadEvents();
    } catch (error) {
      console.error("Errore durante l'eliminazione", error);
      alert("Errore durante l'eliminazione");
    }
  };

  const filteredEvents = events.filter(event => {
    if (!event.date) return true;
    const eventDate = new Date(event.date);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const oneWeekAgo = new Date(now);
    oneWeekAgo.setDate(now.getDate() - 7);
    
    // Future events + past 7 days
    return eventDate >= oneWeekAgo;
  }).sort((a, b) => {
    if (!a.date && !b.date) return 0;
    if (!a.date) return 1;
    if (!b.date) return -1;
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif text-brand-primary mb-2">Eventi</h1>
          <p className="text-brand-contrast/60">Gestisci i tuoi eventi speciali e laboratori programmati.</p>
        </div>
        
        <Link 
          to="/admin/events/new" 
          className="flex items-center gap-2 bg-brand-primary text-white px-6 py-3 rounded-full hover:bg-brand-primary/90 transition-colors font-medium shadow-sm hover:shadow-md"
        >
          <Plus size={20} />
          Nuovo Evento
        </Link>
      </div>

      {/* Mobile View (Cards) */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {loading ? (
          <div className="bg-white p-8 text-center text-brand-contrast/50 rounded-xl border border-brand-primary/10">
            Caricamento in corso...
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="bg-white p-8 text-center text-brand-contrast/50 rounded-xl border border-brand-primary/10">
            Nessun evento recente o futuro trovato.
          </div>
        ) : (
          filteredEvents.map((event) => (
            <Card key={event.id} className="p-4 space-y-4 bg-white border border-brand-primary/10 font-sans shadow-sm">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="font-medium text-lg text-brand-primary leading-tight">{event.title}</h3>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-primary/10 text-brand-primary uppercase tracking-wider">
                    {event.category}
                  </span>
                </div>
                <div className="text-right">
                   <p className="font-bold text-brand-primary">
                     {event.price ? `€${event.price}` : "-"}
                   </p>
                </div>
              </div>

              {event.date && (
                <div className="flex items-center gap-1.5 text-sm text-brand-contrast/60">
                  <Calendar size={16} className="text-brand-primary/60" />
                  <span>{new Date(event.date).toLocaleDateString('it-IT')}</span>
                </div>
              )}

              <div className="flex gap-2 pt-2 border-t border-brand-primary/5">
                <Link 
                  to={`/admin/events/${event.id}/edit`}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-brand-primary/5 text-brand-primary rounded-xl font-medium transition-colors hover:bg-brand-primary/10 border border-brand-primary/10 text-sm"
                >
                  <Pencil size={16} />
                  Modifica
                </Link>
                <ConfirmDeleteButton 
                  onConfirm={() => handleDelete(event.id)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-50 text-red-500 rounded-xl font-medium transition-colors hover:bg-red-100 !shadow-none border border-red-100 text-sm"
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
                <th className="p-4 font-semibold text-brand-primary">Titolo & Data</th>
                <th className="p-4 font-semibold text-brand-primary">Categoria</th>
                <th className="p-4 font-semibold text-brand-primary">Prezzo</th>
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
              ) : filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-brand-contrast/50">
                    Nessun evento recente o futuro trovato.
                  </td>
                </tr>
              ) : (
                filteredEvents.map((event) => (
                  <tr key={event.id} className="border-b border-brand-primary/5 hover:bg-brand-primary/5 transition-colors">
                    <td className="p-4">
                      <p className="font-medium text-brand-contrast">{event.title}</p>
                      {event.date && (
                        <p className="flex items-center gap-1 text-sm text-brand-contrast/60 font-medium mt-1">
                          <Calendar size={14} /> {new Date(event.date).toLocaleDateString('it-IT')}
                        </p>
                      )}
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-primary/10 text-brand-primary uppercase tracking-wider">
                        {event.category}
                      </span>
                    </td>
                    <td className="p-4 text-brand-contrast/80">
                      {event.price ? `€${event.price}` : "-"}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex flex-row gap-2 justify-end">
                          <Link 
                            to={`/admin/events/${event.id}/edit`}
                            className="p-2 text-brand-primary hover:text-brand-secondary hover:bg-brand-primary/5 rounded-full transition-colors flex items-center justify-center"
                            title="Modifica"
                          >
                            <Pencil size={18} />
                          </Link>
                          
                          <ConfirmDeleteButton 
                            onConfirm={() => handleDelete(event.id)}
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
