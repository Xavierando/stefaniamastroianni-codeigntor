import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { apiFetch } from "@/lib/api";
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Mail,
  Phone,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

interface Slot {
  start: string;
  end: string;
}

interface Service {
  id: string;
  title: string;
  duration: string;
  price: string;
  category: string;
}

interface Event {
  id: string;
  title: string;
  date: string;
  duration: string;
  price: string;
}

export function BookingPage() {
  const [searchParams] = useSearchParams();
  const preselectedServiceId = searchParams.get("service_id");
  const preselectedEventId = searchParams.get("event_id");

  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [availableSlots, setAvailableSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [settings, setSettings] = useState<any>({
    booking_start_offset_days: 2,
    workday_mon: 1,
    workday_tue: 1,
    workday_wed: 1,
    workday_thu: 1,
    workday_fri: 1,
    workday_sat: 1,
    workday_sun: 1,
  });

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSettingsLoaded, setIsSettingsLoaded] = useState(false);

  const futureDates = useMemo(() => {
    const dates = [];
    const today = new Date();
    const offset = Number(settings.booking_start_offset_days || 0);

    // Map JS getDay() to our settings keys
    const dayKeyMap = [
      "workday_sun",
      "workday_mon",
      "workday_tue",
      "workday_wed",
      "workday_thu",
      "workday_fri",
      "workday_sat",
    ];

    // We search more days to ensure we find enough available ones
    // and prevent string concatenation bug by ensuring offset is a number
    for (let i = offset; i < offset + 45; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);

      const dayOfWeek = d.getDay(); // 0 is Sunday
      const key = dayKeyMap[dayOfWeek];
      const isAvailable = Number(settings[key] ?? 1) === 1;

      if (isAvailable) {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, "0");
        const dayNum = String(d.getDate()).padStart(2, "0");
        const fullDateStr = `${y}-${m}-${dayNum}`;

        dates.push({
          full: fullDateStr,
          day: d.toLocaleDateString("it-IT", { weekday: "short" }),
          num: d.getDate(),
          month: d.toLocaleDateString("it-IT", { month: "short" }),
        });
      }

      // Stop if we have enough days
      if (dates.length >= 21) break;
    }
    return dates;
  }, [settings]);

  useEffect(() => {
    async function loadData() {
      try {
        const [servicesData, settingsData] = await Promise.all([
          apiFetch("/services"),
          apiFetch("/bookings/settings"),
        ]);
        setServices(servicesData);
        setSettings(settingsData);
        setIsSettingsLoaded(true);

        if (preselectedEventId) {
          const eventData = await apiFetch(`/events/${preselectedEventId}`);
          if (eventData) {
            if (eventData.is_past) {
              setError(
                "Spiacenti, questo evento è già passato. Non è più possibile effettuare prenotazioni.",
              );
              setIsSettingsLoaded(true);
              return;
            }
            if (eventData.is_full) {
              setError(
                "Questo evento è al completo. Non è più possibile accettare nuove prenotazioni online.",
              );
              setIsSettingsLoaded(true);
              return;
            }
            const eDate = new Date(eventData.date.replace(" ", "T"));
            const duration = parseInt(eventData.duration || "60");
            const eEnd = new Date(eDate.getTime() + duration * 60000);

            setSelectedEvent({
              id: eventData.id,
              title: eventData.title,
              date: eventData.date,
              duration: eventData.duration,
              price: eventData.price,
            });
            setSelectedDate(eventData.date.substring(0, 10));
            setSelectedSlot({
              start: eDate.toLocaleTimeString("it-IT", {
                hour: "2-digit",
                minute: "2-digit",
              }),
              end: eEnd.toLocaleTimeString("it-IT", {
                hour: "2-digit",
                minute: "2-digit",
              }),
            });
            setStep(3);
          }
        } else if (preselectedServiceId) {
          const s = servicesData.find(
            (item: any) =>
              item.id === preselectedServiceId ||
              item.slug === preselectedServiceId,
          );
          if (s) {
            setSelectedService(s);
            setStep(2);
          }
        }
      } catch (err) {
        console.error("Failed to load booking data", err);
      } finally {
        setLoading(false);
      }
    }
    setLoading(true);
    loadData();
  }, [preselectedServiceId, preselectedEventId]);

  useEffect(() => {
    if (selectedService && selectedDate) {
      async function loadSlots() {
        try {
          setLoading(true);
          setError("");
          const sId = (selectedService as Service).id;
          const data = await apiFetch(
            `/bookings/available-slots?service_id=${sId}&date=${selectedDate}`,
          );
          setAvailableSlots(data.slots || []);
          if (data.message) setError(data.message);
        } catch (err: any) {
          setError(
            err.message || "Errore nel caricamento dei posti disponibili",
          );
        } finally {
          setLoading(false);
        }
      }
      loadSlots();
    }
  }, [selectedService, selectedDate]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!selectedService && !selectedEvent) || !selectedDate || !selectedSlot)
      return;

    try {
      setLoading(true);
      await apiFetch("/bookings", {
        method: "POST",
        body: {
          service_id: selectedService?.id,
          event_id: selectedEvent?.id,
          name: form.name,
          email: form.email,
          phone: form.phone,
          date: selectedDate,
          time: selectedSlot.start,
        } as any,
      });
      setIsSuccess(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      setError(err.message || "Errore durante la prenotazione");
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-brand-base flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl text-center space-y-6 border border-brand-primary/10">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle size={48} />
          </div>
          <h1 className="text-3xl font-serif text-brand-primary">
            Richiesta Ricevuta!
          </h1>
          <p className="text-brand-contrast/70">
            Grazie {form.name}, la tua richiesta per{" "}
            <strong>{selectedService?.title || selectedEvent?.title}</strong> è
            stata presa in carico.
            <br />
            <br />
            Ti abbiamo inviato una <b>email di verifica</b>: clicca sul link
            contenuto all'interno per confermare la tua presenza e bloccare
            definitivamente il posto.
          </p>
          <button
            onClick={() => (window.location.href = "/")}
            className="w-full bg-brand-primary text-white py-4 rounded-full font-medium hover:bg-brand-primary/90 transition-all"
          >
            Torna alla Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-base flex items-center justify-center py-20 font-sans">
      <div className="container mx-auto max-w-4xl px-4 relative z-10">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-brand-primary/5">
          {/* Header Steps */}
          <div className="bg-brand-primary/5 p-6 border-b border-brand-primary/10">
            <div className="flex justify-between items-center max-w-xs mx-auto">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 1 ? "bg-brand-primary text-white" : "bg-gray-200 text-gray-500"}`}
              >
                1
              </div>
              <div
                className={`h-0.5 w-10 ${step >= 2 ? "bg-brand-primary" : "bg-gray-200"}`}
              ></div>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 2 ? "bg-brand-primary text-white" : "bg-gray-200 text-gray-500"}`}
              >
                2
              </div>
              <div
                className={`h-0.5 w-10 ${step >= 3 ? "bg-brand-primary" : "bg-gray-200"}`}
              ></div>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 3 ? "bg-brand-primary text-white" : "bg-gray-200 text-gray-500"}`}
              >
                3
              </div>
            </div>
            <h2 className="text-center mt-4 font-serif text-2xl text-brand-primary">
              {step === 1 && "Seleziona il Servizio"}
              {step === 2 && "Scegli Data e Ora"}
              {step === 3 && "I tuoi Dati"}
            </h2>
          </div>

          <div className="p-8">
            {/* FULL EVENT ERROR */}
            {error && preselectedEventId && (
              <div className="text-center py-12 space-y-6">
                <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto">
                  <AlertCircle size={32} />
                </div>
                <h2 className="text-2xl font-serif text-brand-primary">
                  Evento al Completo
                </h2>
                <p className="text-brand-contrast/70 max-w-md mx-auto">
                  {error} Puoi contattarci direttamente per essere inserito
                  nella lista d'attesa in caso di rinunce.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <button
                    onClick={() => (window.location.href = "/contatti")}
                    className="bg-brand-primary text-white px-8 py-3 rounded-full font-medium hover:bg-brand-primary/90 transition-all"
                  >
                    Contattaci
                  </button>
                  <button
                    onClick={() => window.history.back()}
                    className="text-brand-contrast/60 hover:text-brand-primary font-medium"
                  >
                    Torna Indietro
                  </button>
                </div>
              </div>
            )}

            {/* STEP 1: SERVICE SELECTION */}
            {!error && step === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setSelectedService(s);
                      setStep(2);
                    }}
                    className={`text-left p-6 rounded-2xl border-2 transition-all group ${
                      selectedService?.id === s.id
                        ? "border-brand-primary bg-brand-primary/5"
                        : "border-brand-primary/10 hover:border-brand-primary/30"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-serif text-xl text-brand-primary group-hover:translate-x-1 transition-transform">
                        {s.title}
                      </h3>
                      <ChevronRight
                        size={20}
                        className="text-brand-primary/40"
                      />
                    </div>
                    <div className="flex gap-4 text-sm text-brand-contrast/60">
                      <span className="flex items-center gap-1">
                        <Clock size={14} /> {s.duration} min
                      </span>
                      {s.price && <span>{s.price}€</span>}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* STEP 2: DATE & TIME */}
            {step === 2 && (
              <div className="space-y-10">
                {!isSettingsLoaded ? (
                  <div className="flex justify-center p-20">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-primary"></div>
                  </div>
                ) : (
                  <>
                    <div>
                      <h3 className="flex items-center gap-2 text-lg font-medium text-brand-primary mb-4">
                        <CalendarIcon size={20} /> Seleziona un giorno
                      </h3>
                      <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar -mx-2 px-2">
                        {futureDates.map((d) => (
                          <button
                            key={d.full}
                            onClick={() => {
                              setSelectedDate(d.full);
                              setSelectedSlot(null);
                            }}
                            className={`flex-shrink-0 w-20 py-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-1 ${
                              selectedDate === d.full
                                ? "border-brand-primary bg-brand-primary text-white shadow-lg"
                                : "border-brand-primary/10 hover:border-brand-primary/30 text-brand-contrast/70"
                            }`}
                          >
                            <span className="text-xs uppercase tracking-wider opacity-70">
                              {d.day}
                            </span>
                            <span className="text-2xl font-serif font-bold">
                              {d.num}
                            </span>
                            <span className="text-xs font-medium">
                              {d.month}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {selectedDate && (
                      <div>
                        <h3 className="flex items-center gap-2 text-lg font-medium text-brand-primary mb-4">
                          <Clock size={20} /> Orari disponibili
                        </h3>
                        {loading ? (
                          <div className="flex justify-center p-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
                          </div>
                        ) : error ? (
                          <div className="bg-amber-50 text-amber-700 p-4 rounded-xl flex items-center gap-3">
                            <AlertCircle size={20} /> {error}
                          </div>
                        ) : availableSlots.length > 0 ? (
                          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                            {availableSlots.map((slot) => (
                              <button
                                key={slot.start}
                                onClick={() => setSelectedSlot(slot)}
                                className={`py-3 rounded-xl border-2 transition-all font-medium ${
                                  selectedSlot?.start === slot.start
                                    ? "border-brand-secondary bg-brand-secondary text-white shadow-md"
                                    : "border-brand-primary/10 hover:border-brand-primary/40 text-brand-contrast"
                                }`}
                              >
                                {slot.start}
                              </button>
                            ))}
                          </div>
                        ) : (
                          <p className="text-brand-contrast/50 text-center py-8 bg-brand-primary/5 rounded-xl border border-dashed border-brand-primary/20">
                            Nessun orario disponibile per questo giorno.
                          </p>
                        )}
                      </div>
                    )}

                    <div className="flex justify-between pt-6 border-t border-brand-primary/10">
                      <button
                        onClick={() => setStep(1)}
                        className="flex items-center gap-2 text-brand-contrast/60 hover:text-brand-primary font-medium"
                      >
                        <ChevronLeft size={20} /> Cambia Servizio
                      </button>
                      <button
                        disabled={!selectedSlot}
                        onClick={() => setStep(3)}
                        className={`bg-brand-primary text-white px-10 py-3 rounded-full font-medium transition-all ${!selectedSlot ? "opacity-50 cursor-not-allowed" : "hover:bg-brand-primary/90"}`}
                      >
                        Prosegui
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* STEP 3: CONTACT FORM */}
            {step === 3 && (
              <form
                onSubmit={handleBooking}
                className="space-y-8 max-w-md mx-auto"
              >
                <div className="bg-brand-primary/5 p-6 rounded-2xl border border-brand-primary/10 space-y-2">
                  <p className="text-sm font-bold uppercase tracking-widest text-brand-primary">
                    Riepilogo
                  </p>
                  <p className="text-xl font-serif text-brand-contrast">
                    {selectedService?.title || selectedEvent?.title}
                  </p>
                  <p className="flex items-center gap-2 text-brand-contrast/70">
                    <CalendarIcon size={16} />
                    {new Date(selectedDate).toLocaleDateString("it-IT", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  <p className="flex items-center gap-2 text-brand-contrast/70">
                    <Clock size={16} /> {selectedSlot?.start} -{" "}
                    {selectedSlot?.end}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-brand-contrast/80">
                      <User size={16} /> Nome e Cognome
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="Mario Rossi"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      className="w-full p-4 rounded-xl border border-brand-primary/20 focus:ring-2 focus:ring-brand-primary/20 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-brand-contrast/80">
                      <Mail size={16} /> Email
                    </label>
                    <input
                      required
                      type="email"
                      placeholder="mario@esempio.com"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      className="w-full p-4 rounded-xl border border-brand-primary/20 focus:ring-2 focus:ring-brand-primary/20 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-brand-contrast/80">
                      <Phone size={16} /> Telefono (opzionale)
                    </label>
                    <input
                      type="tel"
                      placeholder="+39 000 0000000"
                      value={form.phone}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
                      }
                      className="w-full p-4 rounded-xl border border-brand-primary/20 focus:ring-2 focus:ring-brand-primary/20 outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-brand-primary text-white py-4 rounded-full font-medium hover:bg-brand-primary/90 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      "Conferma Prenotazione"
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="text-brand-contrast/50 hover:text-brand-primary text-sm font-medium transition-colors"
                  >
                    Indietro
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        <p className="text-center mt-8 text-sm text-brand-contrast/40 px-8">
          Prenotando dichiari di accettare la nostra{" "}
          <a
            href="/privacy-policy"
            className="underline hover:text-brand-primary"
          >
            Privacy Policy
          </a>
          . La cancellazione è gratuita fino a 48 ore prima.
        </p>
      </div>
    </div>
  );
}

function AlertCircle(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}
