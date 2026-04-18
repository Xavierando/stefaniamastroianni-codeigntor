import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Loader2, XCircle, AlertTriangle, Calendar, Clock, ArrowLeft, Trash2 } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/Button";

export function BookingCancellation() {
    const { token } = useParams<{ token: string }>();
    const [booking, setBooking] = useState<any>(null);
    const [status, setStatus] = useState<'loading' | 'pending' | 'success' | 'already_cancelled' | 'error' | 'deadline_exceeded'>('loading');
    const [notes, setNotes] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        async function fetchDetails() {
            if (!token) {
                setStatus('error');
                return;
            }
            try {
                const data = await apiFetch(`/bookings/cancel-details/${token}`);
                if (data.status === 'cancelled') {
                    setStatus('already_cancelled');
                } else {
                    setBooking(data);
                    setStatus('pending');
                }
            } catch (err: any) {
                console.error("Fetch booking error", err);
                if (err.message?.includes('limit exceeded')) {
                    setStatus('deadline_exceeded');
                } else {
                    setStatus('error');
                }
            }
        }
        fetchDetails();
    }, [token]);

    const handleCancel = async () => {
        if (!token) return;
        setIsSubmitting(true);
        try {
            await apiFetch(`/bookings/cancel/${token}`, {
                method: 'POST',
                body: { notes } as any
            });
            setStatus('success');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err: any) {
            console.error("Cancellation error", err);
            if (err.message?.includes('limit exceeded')) {
                setStatus('deadline_exceeded');
            } else {
                setStatus('error');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (status === 'loading') {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 bg-brand-base">
                <Loader2 className="w-12 h-12 animate-spin text-brand-primary mb-4" />
                <p className="text-brand-contrast/60 font-serif">Caricamento dettagli...</p>
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="min-h-[70vh] flex items-center justify-center p-6 bg-brand-base font-sans">
                <div className="max-w-md w-full bg-white rounded-[2rem] p-10 text-center shadow-soft border border-brand-primary/5">
                    <XCircle className="w-16 h-16 text-red-400 mx-auto mb-6" />
                    <h2 className="text-3xl font-serif text-brand-primary mb-4">Link non valido</h2>
                    <p className="text-brand-contrast/70 leading-relaxed mb-8">
                        Il link di cancellazione sembra essere scaduto o non corretto. Per favore riprova o contattaci direttamente.
                    </p>
                    <Link to="/">
                        <Button className="w-full rounded-full py-6">Torna alla Home</Button>
                    </Link>
                </div>
            </div>
        );
    }

    if (status === 'deadline_exceeded') {
        return (
            <div className="min-h-[70vh] flex items-center justify-center p-6 bg-brand-base font-sans">
                <div className="max-w-md w-full bg-white rounded-[2rem] p-10 text-center shadow-soft border border-brand-primary/5">
                    <AlertTriangle className="w-16 h-16 text-amber-500 mx-auto mb-6" />
                    <h2 className="text-3xl font-serif text-brand-primary mb-4">Termini Scaduti</h2>
                    <p className="text-brand-contrast/70 leading-relaxed mb-8">
                        Spiacenti, il termine massimo per la cancellazione online (48 ore prima) è già passato. Ti preghiamo di contattare Stefania direttamente per concordare una soluzione.
                    </p>
                    <Link to="/contatti">
                        <Button className="w-full rounded-full py-6">Contattaci</Button>
                    </Link>
                </div>
            </div>
        );
    }

    if (status === 'success' || status === 'already_cancelled') {
        return (
            <div className="min-h-[80vh] flex items-center justify-center p-6 bg-brand-base font-sans">
                <div className="max-w-xl w-full bg-white rounded-[2.5rem] p-12 text-center shadow-soft border border-brand-primary/5">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-amber-50 text-amber-600 rounded-full mb-8">
                        <Trash2 size={40} />
                    </div>
                    <h2 className="text-4xl font-serif text-brand-primary mb-6">Prenotazione Cancellata</h2>
                    <p className="text-lg text-brand-contrast/70 leading-relaxed mb-10">
                        {status === 'success' 
                            ? "La tua prenotazione è stata cancellata correttamente. Ti ringraziamo per averci avvisato."
                            : "Questa prenotazione risulta già cancellata nel nostro sistema."}
                    </p>
                    <Link to="/">
                        <Button className="w-full rounded-full py-6">Torna alla Home</Button>
                    </Link>
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
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50 text-red-600 text-xs font-bold uppercase tracking-widest mb-2">
                           Area di cancellazione
                        </div>
                        <h1 className="text-4xl md:text-5xl font-serif text-brand-primary">Vuoi cancellare?</h1>
                        <p className="text-brand-contrast/60 text-lg">
                            Ciao <span className="text-brand-primary font-medium">{booking.name}</span>, confermi di voler annullare il tuo appuntamento?
                        </p>
                    </div>

                    {/* Riepilogo */}
                    <div className="bg-brand-neutral/20 rounded-3xl p-8 space-y-6 border border-brand-primary/5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest text-brand-contrast/40 font-bold block">Servizio/Evento</label>
                                <p className="text-xl font-serif text-brand-contrast">{booking.title}</p>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-brand-contrast/70 font-medium">
                                    <Calendar className="text-brand-primary/40" size={20} />
                                    <span>
                                        {bookingDate?.toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-brand-contrast/70 font-medium">
                                    <Clock className="text-brand-primary/40" size={20} />
                                    <span>
                                        Ore {bookingDate?.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Notes Area */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-brand-primary">
                            <Trash2 size={20} className="text-red-400" />
                            <label className="font-serif text-2xl">Motivo della cancellazione (opzionale)</label>
                        </div>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Se vuoi, puoi indicarci il motivo dell'annullamento. Ci aiuterà a migliorare il servizio."
                            className="w-full min-h-[120px] p-6 rounded-[2rem] border border-brand-primary/10 bg-brand-base/30 focus:bg-white focus:ring-2 focus:ring-red-200 outline-none transition-all text-lg placeholder:text-brand-contrast/30 leading-relaxed"
                        />
                    </div>

                    <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100 flex items-start gap-4">
                        <AlertTriangle className="text-amber-600 shrink-0 mt-1" size={20} />
                        <p className="text-sm text-amber-800 leading-relaxed">
                            La cancellazione è definitiva. Se cambi idea, dovrai effettuare una nuova prenotazione sul sito (soggetta a disponibilità).
                        </p>
                    </div>

                    <div className="pt-6 flex flex-col sm:flex-row gap-4">
                        <Button 
                            variant="ghost" 
                            onClick={() => window.location.href = '/'}
                            className="flex-1 rounded-full py-8 text-lg border border-brand-primary/10 hover:bg-brand-primary/5"
                        >
                            <ArrowLeft className="mr-2" size={20} /> Ripensaci
                        </Button>
                        <Button 
                            onClick={handleCancel}
                            disabled={isSubmitting}
                            className="flex-1 rounded-full py-8 text-lg bg-red-500 hover:bg-red-600 shadow-soft"
                        >
                            {isSubmitting ? (
                                <Loader2 className="animate-spin mr-2" />
                            ) : (
                                "Conferma Cancellazione"
                            )}
                        </Button>
                    </div>
                </div>
                
                <p className="text-center mt-12 text-brand-contrast/30 text-sm">
                    Hai bisogno di aiuto? <Link to="/contatti" className="underline hover:text-brand-primary">Contattaci</Link>
                </p>
            </div>
        </div>
    );
}
