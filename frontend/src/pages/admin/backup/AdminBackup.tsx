import { useCallback, useEffect, useRef, useState } from "react";
import { Download, RotateCcw, Trash2 } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/admin/ui/Button";
import { ConfirmDeleteButton } from "@/components/admin/ui/ConfirmDeleteButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/admin/ui/Card";

interface BackupItem {
  name: string;
  kind: "backup" | "pre-ripristino" | "caricato";
  createdAt: string;
  size: number;
}

type Feedback = { kind: "ok" | "error"; text: string } | null;

const KIND_LABELS: Record<BackupItem["kind"], string> = {
  backup: "Manuale",
  "pre-ripristino": "Automatico (prima di un ripristino)",
  caricato: "Caricato da file",
};

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("it-IT", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function AdminBackupPage() {
  const [backups, setBackups] = useState<BackupItem[]>([]);
  const [loading, setLoading] = useState(true);
  // Nome del backup su cui e in corso un'operazione, o "new"/"upload".
  const [busy, setBusy] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadBackups = useCallback(async () => {
    try {
      setBackups(await apiFetch("/admin/backups"));
    } catch (error) {
      setFeedback({
        kind: "error",
        text: error instanceof Error ? error.message : "Impossibile caricare i backup.",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBackups();
  }, [loadBackups]);

  const run = async (key: string, action: () => Promise<string>) => {
    setBusy(key);
    setFeedback(null);
    try {
      setFeedback({ kind: "ok", text: await action() });
    } catch (error) {
      setFeedback({
        kind: "error",
        text: error instanceof Error ? error.message : "Operazione non riuscita.",
      });
    } finally {
      setBusy(null);
      loadBackups();
    }
  };

  const handleCreate = () =>
    run("new", async () => {
      await apiFetch("/admin/backups", { method: "POST" });
      return "Backup creato. Scaricalo sul tuo computer per conservarne una copia fuori dal server.";
    });

  // Il download passa da fetch per poter inviare il token: un semplice link
  // non porterebbe l'header Authorization.
  const handleDownload = (backup: BackupItem) =>
    run(backup.name, async () => {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`/api/admin/backups/${encodeURIComponent(backup.name)}/download`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!response.ok) throw new Error("Download non riuscito.");

      const url = URL.createObjectURL(await response.blob());
      const link = document.createElement("a");
      link.href = url;
      link.download = backup.name;
      link.click();
      URL.revokeObjectURL(url);
      return "Download avviato.";
    });

  const handleRestore = (backup: BackupItem) => {
    const confirmed = window.confirm(
      `Ripristinare il backup del ${formatDate(backup.createdAt)}?\n\n` +
        "Tutti i contenuti del sito (servizi, eventi, blog, recensioni, messaggi, iscritti, prenotazioni, impostazioni) " +
        "verranno sostituiti con quelli del backup. Prima del ripristino viene salvato automaticamente un backup dello stato attuale.",
    );
    if (!confirmed) return;

    run(backup.name, async () => {
      await apiFetch(`/admin/backups/${encodeURIComponent(backup.name)}/restore`, { method: "POST" });
      return "Ripristino completato. Lo stato precedente è stato salvato come backup automatico.";
    });
  };

  const handleDelete = (backup: BackupItem) =>
    run(backup.name, async () => {
      await apiFetch(`/admin/backups/${encodeURIComponent(backup.name)}`, { method: "DELETE" });
      return "Backup eliminato.";
    });

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    run("upload", async () => {
      const body = new FormData();
      body.append("backup", file);
      await apiFetch("/admin/backups/upload", { method: "POST", body });
      return "Backup caricato: ora lo trovi nell'elenco e puoi ripristinarlo.";
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif text-brand-primary mb-2">Backup</h1>
        <p className="text-brand-contrast/60">
          Salva e ripristina il database e le immagini caricate dal pannello.
        </p>
      </div>

      {feedback && (
        <p
          className={
            feedback.kind === "ok"
              ? "text-accent-green-dark font-medium"
              : "text-brand-secondary font-medium"
          }
        >
          {feedback.text}
        </p>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Nuovo backup</CardTitle>
          <CardDescription>
            Crea una copia completa del sito: tutti i contenuti del database e le
            immagini caricate. Il backup resta salvato sul server; scaricalo per
            averne una copia anche sul tuo computer.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button onClick={handleCreate} disabled={busy !== null}>
            {busy === "new" ? "Creazione in corso..." : "Crea backup adesso"}
          </Button>
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={busy !== null}
          >
            {busy === "upload" ? "Caricamento..." : "Carica un backup da file"}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".zip,application/zip"
            className="hidden"
            onChange={handleUpload}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Backup salvati</CardTitle>
          <CardDescription>
            Il ripristino sostituisce tutti i contenuti attuali con quelli del
            backup scelto. Prima di procedere viene creato in automatico un backup
            dello stato attuale, così puoi sempre tornare indietro.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-brand-contrast/50">Caricamento in corso...</p>
          ) : backups.length === 0 ? (
            <p className="text-brand-contrast/50">Nessun backup salvato.</p>
          ) : (
            <ul className="divide-y divide-brand-contrast/10">
              {backups.map((backup) => (
                <li
                  key={backup.name}
                  className="py-4 flex flex-col md:flex-row md:items-center gap-3 md:gap-6"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-brand-contrast">
                      {formatDate(backup.createdAt)}
                    </p>
                    <p className="text-sm text-brand-contrast/60">
                      {KIND_LABELS[backup.kind]} · {formatSize(backup.size)}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownload(backup)}
                      disabled={busy !== null}
                      title="Scarica"
                    >
                      <Download size={16} className="mr-2" />
                      Scarica
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleRestore(backup)}
                      disabled={busy !== null}
                      title="Ripristina"
                    >
                      <RotateCcw size={16} className="mr-2" />
                      {busy === backup.name ? "In corso..." : "Ripristina"}
                    </Button>
                    <ConfirmDeleteButton
                      size="sm"
                      confirmMessage="Eliminare definitivamente questo backup?"
                      onConfirm={() => handleDelete(backup)}
                      disabled={busy !== null}
                      title="Elimina"
                    >
                      <Trash2 size={16} />
                    </ConfirmDeleteButton>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
