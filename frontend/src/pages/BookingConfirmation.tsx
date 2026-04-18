import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Loader2, CheckCircle2, AlertCircle, Calendar, Clock, MessageSquare, Send } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/Button";

export function BookingConfirmation() {
    const { token } = useParams<{ token: string }>();
    const [booking, setBooking] = useState<any>(null);
    const [status, setStatus] = useState<'loading' | 'pending' | 'success' | 'confirmed_already' | 'error'>('loading');
    const [notes, setNotes] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        async function fetchDetails() {
            if (!token) {
                setStatus('error');
                return;
            }
            try {
                const data = await apiFetch(`/bookings/details/${token}`);
                if (data.status === 'confirmed') {
                    setStatus('confirmed_already');
                } else {
                    setBooking(data);
                    setStatus('pending');
                }
            } catch (err) {
                console.error("Fetch booking error", err);
                setStatus('error');
            }
        }
        fetchDetails();
    }, [token]);

    const handleConfirm = async () => {
        if (!token) return;
        setIsSubmitting(true);
        try {
            await apiFetch(`/bookings/confirm/${token}`, {
                method: 'POST',
                body: { notes } as any
            });
            setStatus('success');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err) {
            console.error("Confirmation error", err);
            // Handle error (maybe show a toast)
        } finally {
            setIsSubmitting(false);
        }
    };

    if (status === 'loading') {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 bg-brand-base">
                <Loader2 className="w-12 h-12 animate-spin text-brand-primary mb-4" />
                <p className="text-brand-contrast/60 font-serif">Caricamento dettagli prenotazione...</p>
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="min-h-[70vh] flex items-center justify-center p-6 bg-brand-base font-sans">
                <div className="max-w-md w-full bg-white rounded-[2rem] p-10 text-center shadow-soft border border-brand-primary/5">
                    <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-6" />
                    <h2 className="text-3xl font-serif text-brand-primary mb-4">Link non valido</h2>
                    <p className="text-brand-contrast/70 leading-relaxed mb-8">
                        Il link di conferma sembra essere scaduto o non corretto. Per favore riprova o contattaci se il problema persiste.
                    </p>
                    <Link to="/">
                        <Button className="w-full rounded-full py-6">Torna alla Home</Button>
                    </Link>
                </div>
            </div>
        );
    }

    if (status === 'success' || status === 'confirmed_already') {
        return (
            <div className="min-h-[80vh] flex items-center justify-center p-6 bg-brand-base font-sans">
                <div className="max-w-xl w-full bg-white rounded-[2.5rem] p-12 text-center shadow-soft border border-brand-primary/5">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-green-50 text-green-600 rounded-full mb-8">
                        <CheckCircle2 size={48} />
                    </div>
                    <h2 className="text-4xl font-serif text-brand-primary mb-6">Prenotazione Confermata!</h2>
                    <p className="text-lg text-brand-contrast/70 leading-relaxed mb-10">
                        {status === 'success' 
                            ? "Grazie! La tua prenotazione è stata confermata con successo. Stefania ha ricevuto la tua richiesta e le tue eventuali note."
                            : "Questa prenotazione risulta già confermata. Riceverai presto ulteriori informazioni via email."}
                    </p>
                    <div className="space-y-4">
                        <Link to="/">
                            <Button className="w-full rounded-full py-6">Vai alla Home</Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const bookingDate = booking ? new Date(booking.start.replace(' ', 'T')) : null;

    return (
        <div className="min-h-screen bg-brand-base py-20 px-4 font-sans">
            <div className="container mx-auto max-w-2xl">
                <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-soft border border-brand-primary/5 space-y-10">
                    <div className="text-center space-y-4">
                        <h1 className="text-4xl md:text-5xl font-serif text-brand-primary">Conferma la tua presenza</h1>
                        <p className="text-brand-contrast/60 text-lg">
                            Ciao <span className="text-brand-primary font-medium">{booking.name}</span>, sei a un passo dal confermare la tua prenotazione.
                        </p>
                    </div>

                    {/* Riepilogo */}
                    <div className="bg-brand-neutral/20 rounded-3xl p-8 space-y-6 border border-brand-primary/5">
                        <div className="flex items-center gap-4 text-brand-primary mb-4 underline decoration-brand-secondary/30 underline-offset-8">
                             <h2 className="font-serif text-2xl">Riepilogo Prenotazione</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest text-brand-contrast/40 font-bold block">Servizio/Evento</label>
                                <p className="text-xl font-serif text-brand-contrast">{booking.title}</p>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-brand-contrast/70">
                                    <Calendar className="text-brand-secondary" size={20} />
                                    <span className="text-lg">
                                        {bookingDate?.toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-brand-contrast/70">
                                    <Clock className="text-brand-secondary" size={20} />
                                    <span className="text-lg">
                                        Ore {bookingDate?.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Notes logic */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 text-brand-primary">
                            <MessageSquare size={20} />
                            <label className="font-serif text-2xl">Note per Stefania (opzionali)</label>
                        </div>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Hai esigenze particolari? Vuoi anticipare qualcosa a Stefania? Scrivi pure qui..."
                            className="w-full min-h-[150px] p-6 rounded-[2rem] border border-brand-primary/10 bg-brand-base/30 focus:bg-white focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all text-lg placeholder:text-brand-contrast/30 leading-relaxed"
                        />
                        <p className="text-sm text-brand-contrast/40 italic pl-2">
                            Le tue note verranno aggiunte ai dettagli della prenotazione.
                        </p>
                    </div>

                    <div className="pt-6">
                        <Button 
                            onClick={handleConfirm}
                            disabled={isSubmitting}
                            className="w-full rounded-full py-8 text-xl group shadow-soft hover:shadow-lg transition-all"
                        >
                            {isSubmitting ? (
                                <Loader2 className="animate-spin mr-2" />
                            ) : (
                                <>
                                    Conferma Prenotazione
                                    <Send className="ml-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" size={20} />
                                </>
                            )}
                        </Button>
                    </div>
                </div>
                
                <p className="text-center mt-12 text-brand-contrast/30 text-sm">
                    Non hai effettuato tu la richiesta? <Link to="/" className="underline hover:text-brand-primary">Torna alla home</Link>
                </p>
            </div>
        </div>
    );
}
