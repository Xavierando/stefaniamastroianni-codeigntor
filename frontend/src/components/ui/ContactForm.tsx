import { useState } from "react";
import { Button } from "./Button";
import { apiFetch } from "@/lib/api";

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");
    
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message'),
    };
    
    try {
      await apiFetch("/contacts", {
        method: "POST",
        body: JSON.stringify(data),
      });
      setIsSuccess(true);
    } catch (err: any) {
      setErrorMsg(err.message || "Errore. Riprova più tardi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-accent-green/20 border border-accent-green/30 text-brand-contrast p-8 rounded-xl text-center">
        <h3 className="font-serif text-2xl mb-2">Grazie per avermi scritto</h3>
        <p>Ho ricevuto la tua richiesta e ti risponderò il prima possibile.</p>
        <Button 
          variant="outline" 
          className="mt-6"
          onClick={() => setIsSuccess(false)}
        >
          Invia un altro messaggio
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-2xl mx-auto">
      {errorMsg && (
        <div className="p-4 bg-red-50 text-red-600 border border-red-200 rounded-md">
          {errorMsg}
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium text-brand-contrast">Nome e Cognome</label>
        <input 
          id="name"
          name="name"
          type="text" 
          required
          className="w-full bg-white/50 border border-brand-contrast/20 rounded-md px-4 py-3 text-brand-contrast focus:outline-none focus:ring-2 focus:ring-brand-primary"
          placeholder="Il tuo nome"
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-brand-contrast">Email</label>
        <input 
          id="email"
          name="email"
          type="email" 
          required
          className="w-full bg-white/50 border border-brand-contrast/20 rounded-md px-4 py-3 text-brand-contrast focus:outline-none focus:ring-2 focus:ring-brand-primary"
          placeholder="tua@email.it"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="message" className="text-sm font-medium text-brand-contrast">Come posso aiutarti?</label>
        <textarea 
          id="message"
          name="message"
          required
          rows={5}
          className="w-full bg-white/50 border border-brand-contrast/20 rounded-md px-4 py-3 text-brand-contrast focus:outline-none focus:ring-2 focus:ring-brand-primary resize-none"
          placeholder="Scrivi qui il tuo messaggio..."
        />
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Invio in corso..." : "Invia Messaggio"}
      </Button>
    </form>
  );
}
