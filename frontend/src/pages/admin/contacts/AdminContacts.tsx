import { useEffect, useState } from "react";
import { Mail, Trash2, Check, Clock } from "lucide-react";
import { Card } from "../../../components/admin/ui/Card";
import { ConfirmDeleteButton } from "../../../components/admin/ui/ConfirmDeleteButton";
import { apiFetch } from "../../../lib/api";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store";

interface Contact {
  id: number;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export function AdminContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const token = useSelector((state: RootState) => state.auth.token);

  const loadContacts = async () => {
    try {
      setLoading(true);
      const data = await apiFetch("contacts", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setContacts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch contacts", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  const handleMarkAsRead = async (id: number) => {
    try {
      await apiFetch(`contacts/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ read: true })
      });
      
      // Update local state optimistic
      setContacts(prev => prev.map(c => c.id === id ? { ...c, read: true } : c));
    } catch (error) {
      console.error("Errore durante la marcatura come letto", error);
      alert("Errore durante l'operazione");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await apiFetch(`contacts/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      await loadContacts();
    } catch (error) {
      console.error("Errore durante l'eliminazione", error);
      alert("Errore durante l'eliminazione");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif text-brand-primary mb-2">Messaggi Ricevuti</h1>
          <p className="text-brand-contrast/60">Gestisci i messaggi inviati tramite il modulo contatti del sito.</p>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="p-12 text-center text-brand-contrast/50">
            Caricamento in corso...
          </div>
        ) : contacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 bg-white border border-brand-primary/10 rounded-xl text-center">
            <div className="p-4 bg-brand-primary/5 rounded-full mb-4">
              <Mail size={32} className="text-brand-primary/40" />
            </div>
            <h3 className="text-lg font-medium text-brand-primary mb-1">Nessun Messaggio</h3>
            <p className="text-brand-contrast/50">
              Non hai ancora ricevuto nessun messaggio dal sito web.
            </p>
          </div>
        ) : (
          contacts.map((contact) => (
            <Card key={contact.id} className={`p-6 border transition-colors ${contact.read ? 'bg-white border-brand-primary/10' : 'bg-brand-primary/5 border-brand-primary/30 shadow-sm'}`}>
              <div className="flex flex-col md:flex-row gap-6 justify-between">
                <div className="space-y-4 flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-lg text-brand-primary flex items-center gap-2">
                        {contact.name}
                        {!contact.read && (
                          <span className="bg-brand-primary text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">Nuovo</span>
                        )}
                      </h3>
                      <a href={`mailto:${contact.email}`} className="text-brand-primary hover:underline text-sm font-medium">
                        {contact.email}
                      </a>
                    </div>
                    <div className="text-sm text-brand-contrast/50 flex items-center gap-1.5 min-w-[140px] justify-end">
                      <Clock size={14} />
                      {new Date(contact.createdAt).toLocaleDateString("it-IT", {
                        day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute:'2-digit'
                      })}
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-md border border-brand-primary/10 text-brand-contrast/80 whitespace-pre-wrap">
                    {contact.message}
                  </div>
                </div>

                <div className="flex md:flex-col gap-2 justify-end md:w-32 items-center md:items-stretch">
                  {!contact.read && (
                    <button 
                      type="button"
                      onClick={() => handleMarkAsRead(contact.id)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-brand-primary/10 text-brand-primary rounded-md hover:bg-brand-primary hover:text-white transition-colors text-sm font-medium border border-brand-primary/20"
                    >
                      <Check size={16} /> Lettura
                    </button>
                  )}
                  
                  <ConfirmDeleteButton 
                    onConfirm={() => handleDelete(contact.id)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50 hover:text-red-700 rounded-md border border-transparent hover:border-red-200 transition-colors text-sm font-medium !bg-transparent !shadow-none min-w-0"
                  >
                    <Trash2 size={16} /> Elimina
                  </ConfirmDeleteButton>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
