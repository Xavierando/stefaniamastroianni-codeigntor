import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/admin/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/admin/ui/Card";

export function AdminSettingsPage() {
  const token = useSelector((state: RootState) => state.auth.token);
  const [whatsappEnabled, setWhatsappEnabled] = useState(false);
  const [whatsappHandle, setWhatsappHandle] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ kind: "ok" | "error"; text: string } | null>(null);

  useEffect(() => {
    apiFetch("/settings")
      .then((data) => {
        setWhatsappEnabled(Boolean(data?.whatsappEnabled));
        setWhatsappHandle(typeof data?.whatsappHandle === "string" ? data.whatsappHandle : "");
      })
      .catch(() => setFeedback({ kind: "error", text: "Impossibile caricare le impostazioni." }))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setFeedback(null);
    try {
      const saved = await apiFetch("/settings", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ whatsappEnabled, whatsappHandle }),
      });
      setWhatsappHandle(saved?.whatsappHandle ?? whatsappHandle);
      setFeedback({ kind: "ok", text: "Impostazioni salvate. Le pagine si aggiornano al prossimo caricamento." });
    } catch (error) {
      setFeedback({
        kind: "error",
        text: error instanceof Error ? error.message : "Errore durante il salvataggio.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif text-brand-primary mb-2">Impostazioni</h1>
        <p className="text-brand-contrast/60">
          Configura i canali di contatto mostrati sul sito pubblico.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>WhatsApp</CardTitle>
          <CardDescription>
            Con WhatsApp attivo i pulsanti di contatto aprono la chat. Disattivandolo
            spariscono la sezione WhatsApp dalla pagina Contatti e tutti i pulsanti
            rimandano al modulo di contatto.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {loading ? (
            <p className="text-brand-contrast/50">Caricamento in corso...</p>
          ) : (
            <>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={whatsappEnabled}
                  onChange={(e) => setWhatsappEnabled(e.target.checked)}
                  className="h-5 w-5 rounded border-brand-contrast/30 accent-brand-primary"
                />
                <span className="font-medium text-brand-contrast">
                  Mostra i contatti WhatsApp sul sito
                </span>
              </label>

              <div className="space-y-2">
                <label htmlFor="whatsappHandle" className="text-sm font-medium text-brand-contrast">
                  Username o numero WhatsApp
                </label>
                <input
                  id="whatsappHandle"
                  type="text"
                  value={whatsappHandle}
                  onChange={(e) => setWhatsappHandle(e.target.value)}
                  placeholder="xprot oppure 393331234567"
                  className="w-full bg-white border border-brand-contrast/20 rounded-md px-4 py-3 text-brand-contrast focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
                <p className="text-sm text-brand-contrast/50">
                  Spazi, +, trattini e parentesi vengono rimossi automaticamente.
                </p>
              </div>

              {feedback && (
                <p className={feedback.kind === "ok" ? "text-accent-green-dark" : "text-brand-secondary"}>
                  {feedback.text}
                </p>
              )}

              <Button onClick={handleSave} disabled={saving}>
                {saving ? "Salvataggio..." : "Salva"}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
