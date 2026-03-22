import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Save, ArrowLeft, Send, Play, Pause } from "lucide-react";
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { Card } from "../../../components/admin/ui/Card";
import { apiFetch } from "../../../lib/api";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store";

interface Campaign {
  id?: number;
  subject: string;
  content: string;
  status: 'draft' | 'sending' | 'sent';
  total_subscribers: number;
  sent_count: number;
  last_sent_sequence_id: number;
}

export function AdminCampaignForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const token = useSelector((state: RootState) => state.auth.token);

  const [campaign, setCampaign] = useState<Campaign>({
    subject: "",
    content: "",
    status: "draft",
    total_subscribers: 0,
    sent_count: 0,
    last_sent_sequence_id: 0,
  });

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [testEmail, setTestEmail] = useState("");
  const [testing, setTesting] = useState(false);

  // Sending Logic State
  const [isSending, setIsSending] = useState(false);
  const sendingIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isEditing) {
      loadCampaign();
    }
  }, [id]);

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (sendingIntervalRef.current) {
        clearTimeout(sendingIntervalRef.current);
      }
    };
  }, []);

  const loadCampaign = async () => {
    try {
      setLoading(true);
      const data = await apiFetch(`admin/newsletters/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCampaign(data);
      if (data.status === 'sending') {
        // We could auto-resume here, but requiring user click is safer
      }
    } catch (error) {
      console.error("Failed to load campaign", error);
      alert("Errore nel caricamento della campagna.");
      navigate("/admin/newsletter");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCampaign(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaign.subject) {
      alert("Il soggetto è obbligatorio");
      return;
    }

    try {
      setSaving(true);
      const url = isEditing ? `admin/newsletters/${id}` : `admin/newsletters`;
      const method = isEditing ? "PUT" : "POST";
      
      const response = await apiFetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          subject: campaign.subject,
          content: campaign.content,
        })
      });

      if (!isEditing && response.data?.id) {
        navigate(`/admin/newsletter/campaigns/${response.data.id}/edit`, { replace: true });
      } else {
        alert("Campagna salvata con successo!");
      }
    } catch (error) {
      console.error("Save error", error);
      alert("Errore durante il salvataggio");
    } finally {
      setSaving(false);
    }
  };

  // --- Core Sending Engine ---

  const handleTestSend = async () => {
    if (!testEmail) {
      alert("Inserisci un indirizzo email per il test.");
      return;
    }
    try {
      setTesting(true);
      const res = await apiFetch(`admin/newsletters/test_send/${id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ email: testEmail })
      });
      
      if (res.success) {
        alert(res.message || "Email di test inviata!");
      }
    } catch (err: any) {
      console.error(err);
      if (err.data?.debug) {
        console.error("SMTP Debug:", err.data.debug);
        alert("Errore SMTP. Guarda i log della console (F12) per i dettagli del debugger.");
      } else {
        alert("Errore durante l'invio del test.");
      }
    } finally {
      setTesting(false);
    }
  };

  const triggerNextSend = async () => {
    try {
      const data = await apiFetch(`admin/newsletters/send_next/${id}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data.success) {
        setCampaign(prev => ({
          ...prev,
          sent_count: data.sent_count,
          status: data.has_more ? 'sending' : 'sent'
        }));

        if (data.has_more) {
          // Wait 10 seconds before next send
          sendingIntervalRef.current = setTimeout(() => {
            triggerNextSend();
          }, 10000);
        } else {
          setIsSending(false);
          alert("Invio completato con successo!");
        }
      }
    } catch (err) {
      console.error("Errore durante l'invio batch", err);
      setIsSending(false);
      alert("Errore durante l'invio. Pausa avviata.");
    }
  };

  const startSending = async () => {
    if (!confirm("Sei sicuro di voler avviare l'invio a tutti gli iscritti?")) return;

    try {
      const startRes = await apiFetch(`admin/newsletters/start_sending/${id}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (startRes.success) {
        setCampaign(prev => ({
          ...prev,
          status: 'sending',
          total_subscribers: startRes.total_subscribers,
          sent_count: 0
        }));
        
        setIsSending(true);
        triggerNextSend();
      }
    } catch (err) {
      console.error(err);
      alert("Impossibile avviare l'invio");
    }
  };

  const resumeSending = () => {
    setIsSending(true);
    triggerNextSend();
  };

  const pauseSending = () => {
    if (sendingIntervalRef.current) {
      clearTimeout(sendingIntervalRef.current);
    }
    setIsSending(false);
  };

  if (loading) {
    return <div className="p-8 text-center text-brand-contrast/60">Caricamento...</div>;
  }

  const isEditable = campaign.status === 'draft';
  const progressPercent = campaign.total_subscribers > 0 
    ? Math.round((campaign.sent_count / campaign.total_subscribers) * 100) 
    : 0;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/admin/newsletter")}
          className="p-2 hover:bg-brand-primary/10 rounded-full transition-colors text-brand-primary"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-3xl font-serif text-brand-primary">
            {isEditing ? "Modifica Campagna" : "Nuova Campagna"}
          </h1>
          <p className="text-brand-contrast/60">
            {campaign.status === 'draft' ? "Componi la tua email." : "Monitora l'invio in corso."}
          </p>
        </div>
      </div>

      {campaign.status !== 'draft' && (
        <Card className="p-6 bg-brand-primary/5 border-brand-primary/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-brand-primary">Stato Invio</h3>
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-brand-primary/10 text-brand-primary">
              {campaign.status === 'sending' ? (isSending ? 'In corso...' : 'In Pausa') : 'Completato'}
            </span>
          </div>

          <div className="mb-2 flex justify-between text-sm font-medium text-brand-contrast/80">
            <span>Progresso ({campaign.sent_count} / {campaign.total_subscribers})</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="w-full bg-black/5 rounded-full h-3 mb-6">
            <div 
              className="bg-brand-primary h-3 rounded-full transition-all duration-500" 
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>

          {campaign.status === 'sending' && (
            <div className="flex gap-4">
              {isSending ? (
                <button 
                  onClick={pauseSending}
                  className="flex items-center gap-2 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
                >
                  <Pause size={18} /> Metti in Pausa
                </button>
              ) : (
                <button 
                  onClick={resumeSending}
                  className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  <Play size={18} /> Riprendi Invio
                </button>
              )}
            </div>
          )}
        </Card>
      )}

      <Card className="p-6 bg-white border border-brand-primary/10">
        <form onSubmit={handleSaveDraft} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-brand-primary mb-2">
              Oggetto dell'email
            </label>
            <input
              type="text"
              name="subject"
              required
              value={campaign.subject}
              onChange={handleChange}
              disabled={!isEditable || isSending}
              className="w-full px-4 py-3 rounded-lg border border-brand-primary/20 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 disabled:opacity-50"
              placeholder="Inserisci l'oggetto"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-primary mb-2">
              Contenuto (Editor Rich Text)
            </label>
            <div className="bg-white rounded-lg border border-brand-primary/20 overflow-hidden">
              <ReactQuill 
                theme="snow"
                value={campaign.content} 
                onChange={(html: string) => setCampaign(prev => ({ ...prev, content: html }))}
                readOnly={!isEditable || isSending}
                className="quill-editor"
                modules={{
                  toolbar: [
                    [{ 'header': [1, 2, 3, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{'list': 'ordered'}, {'list': 'bullet'}],
                    ['link', 'clean']
                  ],
                }}
              />
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-brand-primary/10">
            {isEditable && (
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-6 py-3 bg-brand-primary text-white rounded-full hover:bg-brand-primary/90 transition-colors disabled:opacity-50"
              >
                <Save size={20} />
                {saving ? "Salvataggio..." : "Salva Bozza"}
              </button>
            )}

            {isEditable && isEditing && (
              <div className="flex items-center gap-4 border-l border-brand-primary/10 pl-4">
                <input 
                  type="email" 
                  placeholder="La tua email..." 
                  value={testEmail}
                  onChange={e => setTestEmail(e.target.value)}
                  className="px-4 py-2 text-sm rounded-lg border border-brand-primary/20 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={handleTestSend}
                  disabled={testing || !testEmail}
                  className="px-4 py-2 bg-gray-200 text-brand-primary text-sm font-medium rounded-lg hover:bg-gray-300 disabled:opacity-50 transition"
                >
                  {testing ? "Attendi..." : "Invia Test"}
                </button>
              </div>
            )}

            {isEditable && isEditing && (
              <button
                type="button"
                onClick={startSending}
                className="flex items-center gap-2 px-6 py-3 bg-accent-orange text-white rounded-full hover:bg-accent-orange/90 transition-colors shadow-md"
              >
                <Send size={20} />
                Avvia Invio
              </button>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
}
