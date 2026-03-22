import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { apiFetch } from "../lib/api";

export function Unsubscribe() {
  const location = useLocation();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'invalid'>('loading');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (!token) {
      setStatus('invalid');
      return;
    }

    const unsubscribe = async () => {
      try {
        const res = await apiFetch(`newsletter/${token}`, {
          method: 'DELETE'
        });
        
        if (res.success) {
          setStatus('success');
        } else {
          setStatus('error');
        }
      } catch (err) {
        console.error("Unsubscribe error", err);
        setStatus('error');
      }
    };

    // Small delay for better UX
    setTimeout(() => {
      unsubscribe();
    }, 1000);

  }, [location.search]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl p-8 text-center shadow-sm border border-brand-primary/10">
        
        {status === 'loading' && (
          <div className="flex flex-col items-center gap-4 text-brand-primary">
            <Loader2 className="w-12 h-12 animate-spin" />
            <h2 className="text-2xl font-serif">Elaborazione in corso...</h2>
            <p className="text-brand-contrast/70">Stiamo rimuovendo il tuo indirizzo dalla newsletter.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center gap-4 text-accent-green-dark">
            <CheckCircle2 className="w-16 h-16" />
            <h2 className="text-2xl font-serif text-brand-primary">Disiscrizione completata</h2>
            <p className="text-brand-contrast/70">Il tuo indirizzo email è stato rimosso con successo dalla nostra lista. Non riceverai più nostre comunicazioni.</p>
            <Link to="/" className="mt-6 px-6 py-2 bg-brand-primary text-white rounded-full hover:bg-brand-primary/90 transition-colors inline-block text-sm">
              Torna alla Home
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center gap-4 text-red-500">
            <XCircle className="w-16 h-16" />
            <h2 className="text-2xl font-serif text-brand-primary">Qualcosa è andato storto</h2>
            <p className="text-brand-contrast/70">Non è stato possibile elaborare la tua richiesta. L'utente potrebbe non esistere più o il link potrebbe essere scaduto.</p>
            <Link to="/" className="mt-6 px-6 py-2 border border-brand-primary text-brand-primary rounded-full hover:bg-brand-primary/5 transition-colors inline-block text-sm">
              Torna alla Home
            </Link>
          </div>
        )}

        {status === 'invalid' && (
          <div className="flex flex-col items-center gap-4 text-accent-orange">
            <XCircle className="w-16 h-16" />
            <h2 className="text-2xl font-serif text-brand-primary">Link non valido</h2>
            <p className="text-brand-contrast/70">Il link che hai seguito non contiene i parametri necessari per procedere con la disiscrizione.</p>
            <Link to="/" className="mt-6 px-6 py-2 border border-brand-primary text-brand-primary rounded-full hover:bg-brand-primary/5 transition-colors inline-block text-sm">
              Torna alla Home
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
