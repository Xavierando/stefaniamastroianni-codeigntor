import { useState } from "react";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/Button";

interface CommentFormProps {
  postId: number | string;
}

export function CommentForm({ postId }: CommentFormProps) {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !message.trim()) {
      setError("Per favore, compila tutti i campi liberi.");
      return;
    }

    try {
      setIsSubmitting(true);
      const result = await apiFetch("/comments", {
        method: "POST",
        body: JSON.stringify({
          postId,
          name: name.trim(),
          message: message.trim(),
        }),
      });

      if (result) {
        setSuccess(true);
        setName("");
        setMessage("");
      } else {
        setError("Si è verificato un errore durante l'invio del commento.");
      }
    } catch (err) {
      console.error("Failed to submit comment:", err);
      setError("Impossibile connettersi al server. Riprova più tardi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="bg-green-50 text-green-800 p-8 rounded-2xl border border-green-200 text-center">
        <h4 className="text-xl font-serif mb-2">Grazie per il tuo commento!</h4>
        <p>Il tuo messaggio è stato inviato e apparirà qui non appena sarà stato approvato da Stefania.</p>
        <button 
          onClick={() => setSuccess(false)}
          className="mt-6 text-sm underline hover:text-green-900"
        >
          Scrivi un altro commento
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-brand-primary/10">
      <h4 className="text-xl font-serif text-brand-primary mb-6">Lascia un commento</h4>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm mb-6 border border-red-100">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-brand-contrast/70 mb-2">
            Il tuo Nome
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isSubmitting}
            className="w-full px-4 py-3 rounded-xl border border-brand-primary/20 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all disabled:opacity-50 font-sans"
            placeholder="Come vuoi essere chiamato?"
            maxLength={100}
            required
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-brand-contrast/70 mb-2">
            Il tuo Messaggio
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={isSubmitting}
            className="w-full px-4 py-3 rounded-xl border border-brand-primary/20 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all disabled:opacity-50 min-h-[150px] resize-y font-sans leading-relaxed"
            placeholder="Condividi le tue riflessioni..."
            maxLength={2000}
            required
          />
        </div>

        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full py-4 relative overflow-hidden group"
        >
          <span className={`transition-opacity ${isSubmitting ? 'opacity-0' : 'opacity-100'}`}>
            Invia Commento
          </span>
          {isSubmitting && (
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            </span>
          )}
        </Button>
      </form>
      <p className="text-xs text-brand-contrast/40 text-center mt-4 uppercase tracking-wider">
        I commenti sono soggetti a moderazione
      </p>
    </div>
  );
}
