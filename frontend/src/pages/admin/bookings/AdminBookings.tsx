import { useEffect, useState } from "react";
import { Card } from "../../../components/admin/ui/Card";
import { apiFetch } from "../../../lib/api";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store";
import { Calendar, Settings, AlertCircle, CheckCircle2, XCircle } from "lucide-react";

interface Booking {
  id: number;
  name: string;
  email: string;
  phone: string;
  service_id: string;
  start_time: string;
  end_time: string;
  status: string;
}

interface Service {
  id: number;
  title: string;
  isEvent: boolean;
}

interface BookingSettings {
  booking_start_offset_days: string;
  daily_start_time: string;
  daily_end_time: string;
  buffer_time: string;
  cancellation_limit_days: string;
  google_calendar_id: string;
  google_is_connected: boolean;
  workday_mon: string | number;
  workday_tue: string | number;
  workday_wed: string | number;
  workday_thu: string | number;
  workday_fri: string | number;
  workday_sat: string | number;
  workday_sun: string | number;
}

export function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [settings, setSettings] = useState<BookingSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"list" | "settings">("list");
  const [filterRange, setFilterRange] = useState<"all" | "today" | "tomorrow" | "this_week" | "next_week">("all");
  const [selectedServiceId, setSelectedServiceId] = useState<string>("all");
  const token = useSelector((state: RootState) => state.auth.token);

  const loadData = async () => {
    try {
      setLoading(true);
      const [bookingsData, settingsData, servicesData] = await Promise.all([
        apiFetch("admin/bookings", { headers: { Authorization: `Bearer ${token}` } }),
        apiFetch("admin/bookings/settings", { headers: { Authorization: `Bearer ${token}` } }),
        apiFetch("services")
      ]);
      setBookings(Array.isArray(bookingsData) ? bookingsData : []);
      setSettings(settingsData);
      setServices(Array.isArray(servicesData) ? servicesData : []);
    } catch (error) {
      console.error("Failed to fetch booking data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateSettings = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!settings) return;
    try {
      await apiFetch("admin/bookings/settings", {
        method: "POST",
        body: JSON.stringify(settings),
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      alert("Impostazioni salvate con successo");
      loadData();
    } catch (error) {
      console.error("Failed to update settings", error);
      alert("Errore durante il salvataggio");
    }
  };

  const handleGoogleConnect = async () => {
    try {
      const { url } = await apiFetch("admin/bookings/google-auth", {
        headers: { Authorization: `Bearer ${token}` }
      });
      window.location.href = url;
    } catch (error) {
      console.error("Failed to get Google Auth URL", error);
    }
  };

  const getFilteredBookings = () => {
    let filtered = [...bookings];

    if (selectedServiceId !== "all") {
      if (selectedServiceId === "services_treatments") {
        const nonEventIds = services.filter(s => !s.isEvent).map(s => String(s.id));
        filtered = filtered.filter(b => nonEventIds.includes(String(b.service_id)));
      } else {
        filtered = filtered.filter(b => String(b.service_id) === String(selectedServiceId));
      }
    }

    if (filterRange !== "all") {
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      const today = now.getTime();
      const oneDay = 24 * 60 * 60 * 1000;

      filtered = filtered.filter(b => {
        const bDate = new Date(b.start_time);
        bDate.setHours(0, 0, 0, 0);
        const bTime = bDate.getTime();

        if (filterRange === "today") return bTime === today;
        if (filterRange === "tomorrow") return bTime === today + oneDay;
        
        if (filterRange === "this_week") {
          const day = now.getDay() || 7; // 1-7 where 7 is Sunday
          const start = today - (day - 1) * oneDay;
          const end = start + 6 * oneDay;
          return bTime >= start && bTime <= end;
        }

        if (filterRange === "next_week") {
          const day = now.getDay() || 7;
          const start = today + (8 - day) * oneDay;
          const end = start + 6 * oneDay;
          return bTime >= start && bTime <= end;
        }

        return true;
      });
    }

    return filtered.sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());
  };

  const filteredBookings = getFilteredBookings();
  
  const getServiceInfo = (id: string) => {
    const service = services.find(s => String(s.id) === String(id));
    if (!service) return "Prenotazione";
    if (service.isEvent) return `Evento: ${service.title}`;
    return service.title;
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif text-brand-primary mb-2">Prenotazioni</h1>
          <p className="text-brand-contrast/60">Gestisci i tuoi appuntamenti e le impostazioni del calendario.</p>
        </div>
      </div>

      <div className="flex gap-4 border-b border-brand-primary/10">
        <button
          onClick={() => setActiveTab("list")}
          className={`pb-4 px-4 font-medium transition-colors border-b-2 ${
            activeTab === "list" ? "border-brand-primary text-brand-primary" : "border-transparent text-brand-contrast/60 hover:text-brand-primary"
          }`}
        >
          <div className="flex items-center gap-2">
            <Calendar size={18} />
            Elenco Appuntamenti
          </div>
        </button>
        <button
          onClick={() => setActiveTab("settings")}
          className={`pb-4 px-4 font-medium transition-colors border-b-2 ${
            activeTab === "settings" ? "border-brand-primary text-brand-primary" : "border-transparent text-brand-contrast/60 hover:text-brand-primary"
          }`}
        >
          <div className="flex items-center gap-2">
            <Settings size={18} />
            Impostazioni
          </div>
        </button>
      </div>

      {activeTab === "list" ? (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-col gap-6 p-4 bg-white border border-brand-primary/10 rounded-xl font-sans">
            {/* Period Filter */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-brand-primary/40 uppercase tracking-[0.2em] ml-1">Periodo</span>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: "all", label: "Tutte" },
                  { id: "today", label: "Oggi" },
                  { id: "tomorrow", label: "Domani" },
                  { id: "this_week", label: "Questa Settimana" },
                  { id: "next_week", label: "Prossima Settimana" },
                ].map((range) => (
                  <button
                    key={range.id}
                    onClick={() => setFilterRange(range.id as any)}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all border ${
                      filterRange === range.id
                        ? "bg-brand-primary text-white border-brand-primary shadow-sm"
                        : "bg-white text-brand-contrast/60 border-brand-primary/10 hover:border-brand-primary/30"
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Event Filter */}
            <div className="space-y-2 pt-4 border-t border-brand-primary/5">
              <span className="text-[10px] font-bold text-brand-secondary/40 uppercase tracking-[0.2em] ml-1">Filtro Eventi / Servizi</span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedServiceId("all")}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all border ${
                    selectedServiceId === "all"
                      ? "bg-brand-secondary text-white border-brand-secondary shadow-sm"
                      : "bg-white text-brand-contrast/60 border-brand-primary/10 hover:border-brand-primary/30"
                  }`}
                >
                  Tutte le prenotazioni
                </button>

                {/* Consolidated Button for Services/Treatments */}
                {services.some(s => !s.isEvent) && (
                  <button
                    onClick={() => setSelectedServiceId("services_treatments")}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all border ${
                      selectedServiceId === "services_treatments"
                        ? "bg-brand-secondary text-white border-brand-secondary shadow-sm"
                        : "bg-white text-brand-contrast/60 border-brand-primary/10 hover:border-brand-primary/30"
                    }`}
                  >
                    Servizi / Trattamenti
                  </button>
                )}

                {/* Individual Buttons for Events */}
                {services.filter(s => s.isEvent).map(service => (
                  <button
                    key={service.id}
                    onClick={() => setSelectedServiceId(String(service.id))}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all border ${
                      String(selectedServiceId) === String(service.id)
                        ? "bg-brand-secondary text-white border-brand-secondary shadow-sm"
                        : "bg-white text-brand-contrast/60 border-brand-primary/10 hover:border-brand-primary/30"
                    }`}
                  >
                    {service.title}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* List Display */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {loading ? (
              <div className="p-8 text-center text-brand-contrast/50 bg-white rounded-xl border border-brand-primary/10">Caricamento...</div>
            ) : filteredBookings.length === 0 ? (
              <div className="p-8 text-center text-brand-contrast/50 bg-white rounded-xl border border-brand-primary/10">Nessuna prenotazione trovata.</div>
            ) : (
              filteredBookings.map((booking) => (
                <Card key={booking.id} className="p-4 space-y-4 bg-white border border-brand-primary/10">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-brand-primary uppercase tracking-wider">
                        {new Date(booking.start_time).toLocaleDateString('it-IT', { day: 'numeric', month: 'short' })}
                        <span className="mx-2 text-brand-primary/30">|</span>
                        {new Date(booking.start_time).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <h3 className="font-medium text-lg text-brand-contrast leading-tight">{booking.name}</h3>
                      <p className="text-sm text-brand-primary/80 font-medium">{getServiceInfo(booking.service_id)}</p>
                    </div>
                    <div className="shrink-0">
                      {booking.status === 'confirmed' ? (
                        <span className="p-1.5 rounded-full bg-green-50 text-green-600 border border-green-100 block">
                          <CheckCircle2 size={18} />
                        </span>
                      ) : (
                        <span className="p-1.5 rounded-full bg-red-50 text-red-600 border border-red-100 block">
                          <XCircle size={18} />
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-brand-primary/5 space-y-1">
                    <p className="text-sm text-brand-contrast/60 flex items-center gap-2">
                       <span className="opacity-50 text-xs">Email:</span> {booking.email}
                    </p>
                    <p className="text-sm text-brand-contrast/60 flex items-center gap-2">
                       <span className="opacity-50 text-xs">Tel:</span> {booking.phone}
                    </p>
                  </div>
                </Card>
              ))
            )}
          </div>

          <Card className="overflow-hidden bg-white border border-brand-primary/10 font-sans hidden md:block">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-brand-primary/5 border-b border-brand-primary/10">
                    <th className="p-4 font-semibold text-brand-primary">Data & Ora</th>
                    <th className="p-4 font-semibold text-brand-primary">Cliente</th>
                    <th className="p-4 font-semibold text-brand-primary">Contatti</th>
                    <th className="p-4 font-semibold text-brand-primary">Stato</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-brand-contrast/50">Caricamento...</td>
                    </tr>
                  ) : filteredBookings.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-brand-contrast/50">Nessuna prenotazione trovata.</td>
                    </tr>
                  ) : (
                    filteredBookings.map((booking) => (
                      <tr key={booking.id} className="border-b border-brand-primary/5 hover:bg-brand-primary/5 transition-colors">
                        <td className="p-4">
                          <div className="font-medium text-brand-contrast">
                            {new Date(booking.start_time).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </div>
                          <div className="text-sm text-brand-contrast/60">
                            {new Date(booking.start_time).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </td>
                        <td className="p-4">
                          <p className="font-medium text-brand-contrast">{booking.name}</p>
                          <p className="text-xs text-brand-primary/60 font-medium uppercase mt-1">{getServiceInfo(booking.service_id)}</p>
                        </td>
                        <td className="p-4">
                          <p className="text-sm text-brand-contrast/80">{booking.email}</p>
                          <p className="text-sm text-brand-contrast/60">{booking.phone}</p>
                        </td>
                        <td className="p-4">
                          {booking.status === 'confirmed' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                              <CheckCircle2 size={12} />
                              Confermato
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                              <XCircle size={12} />
                              Cancellato
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 font-sans">
          <div className="lg:col-span-2">
            <Card className="p-6 bg-white border border-brand-primary/10">
              <h2 className="text-xl font-serif text-brand-primary mb-6">Parametri di Prenotazione</h2>
              {settings && (
                <form onSubmit={handleUpdateSettings} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-brand-contrast/80">Anticipo minimo (giorni)</label>
                      <input
                        type="number"
                        value={settings.booking_start_offset_days}
                        onChange={(e) => setSettings({ ...settings, booking_start_offset_days: e.target.value })}
                        className="w-full p-3 rounded-lg border border-brand-primary/20 focus:ring-2 focus:ring-brand-primary/20 outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-brand-contrast/80">Limite cancellazione (giorni)</label>
                      <input
                        type="number"
                        value={settings.cancellation_limit_days}
                        onChange={(e) => setSettings({ ...settings, cancellation_limit_days: e.target.value })}
                        className="w-full p-3 rounded-lg border border-brand-primary/20 focus:ring-2 focus:ring-brand-primary/20 outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-brand-contrast/80">Ora inizio giornata</label>
                      <input
                        type="time"
                        value={settings.daily_start_time}
                        onChange={(e) => setSettings({ ...settings, daily_start_time: e.target.value })}
                        className="w-full p-3 rounded-lg border border-brand-primary/20 focus:ring-2 focus:ring-brand-primary/20 outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-brand-contrast/80">Ora fine giornata</label>
                      <input
                        type="time"
                        value={settings.daily_end_time}
                        onChange={(e) => setSettings({ ...settings, daily_end_time: e.target.value })}
                        className="w-full p-3 rounded-lg border border-brand-primary/20 focus:ring-2 focus:ring-brand-primary/20 outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-brand-contrast/80">Buffer tra appuntamenti (minuti)</label>
                      <input
                        type="number"
                        value={settings.buffer_time}
                        onChange={(e) => setSettings({ ...settings, buffer_time: e.target.value })}
                        className="w-full p-3 rounded-lg border border-brand-primary/20 focus:ring-2 focus:ring-brand-primary/20 outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-brand-contrast/80">Google Calendar ID</label>
                      <input
                        type="text"
                        value={settings.google_calendar_id}
                        onChange={(e) => setSettings({ ...settings, google_calendar_id: e.target.value })}
                        placeholder="primary"
                        className="w-full p-3 rounded-lg border border-brand-primary/20 focus:ring-2 focus:ring-brand-primary/20 outline-none"
                      />
                    </div>
                  </div>

                  <div className="pt-6 border-t border-brand-primary/10">
                    <h3 className="text-lg font-serif text-brand-primary mb-4">Giorni Lavorativi</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {[
                        { key: "workday_mon", label: "Lunedì" },
                        { key: "workday_tue", label: "Martedì" },
                        { key: "workday_wed", label: "Mercoledì" },
                        { key: "workday_thu", label: "Giovedì" },
                        { key: "workday_fri", label: "Venerdì" },
                        { key: "workday_sat", label: "Sabato" },
                        { key: "workday_sun", label: "Domenica" },
                      ].map((day) => (
                        <label key={day.key} className="flex items-center gap-3 p-3 rounded-xl border border-brand-primary/10 hover:bg-brand-primary/5 cursor-pointer transition-colors">
                          <input
                            type="checkbox"
                            checked={Number(settings[day.key as keyof BookingSettings]) === 1}
                            onChange={(e) => setSettings({ ...settings, [day.key]: e.target.checked ? 1 : 0 })}
                            className="w-5 h-5 rounded border-brand-primary/20 text-brand-primary focus:ring-brand-primary"
                          />
                          <span className="text-sm font-medium text-brand-contrast/80">{day.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      className="bg-brand-primary text-white px-8 py-3 rounded-full hover:bg-brand-primary/90 transition-all font-medium shadow-sm"
                    >
                      Salva Impostazioni
                    </button>
                  </div>
                </form>
              )}
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6 bg-white border border-brand-primary/10">
              <h3 className="text-lg font-serif text-brand-primary mb-4">Integrazione Google</h3>
              {settings?.google_is_connected ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-green-600 bg-green-50 p-4 rounded-lg">
                    <CheckCircle2 size={24} />
                    <div>
                      <p className="font-medium">Calendario Collegato</p>
                      <p className="text-xs opacity-80">L'app può leggere e scrivere eventi.</p>
                    </div>
                  </div>
                  <button
                    onClick={handleGoogleConnect}
                    className="w-full text-sm text-brand-primary hover:underline"
                  >
                    Riconnetti account
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-amber-600 bg-amber-50 p-4 rounded-lg">
                    <AlertCircle size={24} />
                    <div>
                      <p className="font-medium">Non Collegato</p>
                      <p className="text-xs opacity-80">Collega il tuo calendario per evitare sovrapposizioni.</p>
                    </div>
                  </div>
                  <button
                    onClick={handleGoogleConnect}
                    className="w-full bg-white border border-brand-primary text-brand-primary px-4 py-3 rounded-full hover:bg-brand-primary/5 transition-all font-medium"
                  >
                    Collega Google Calendar
                  </button>
                </div>
              )}
            </Card>

            <Card className="p-6 bg-brand-primary/5 border border-brand-primary/10">
              <h3 className="text-sm font-bold uppercase tracking-wider text-brand-primary mb-2">Informazioni</h3>
              <p className="text-sm text-brand-contrast/70 leading-relaxed">
                Il <strong>Buffer</strong> è il tempo extra che viene aggiunto in agenda dopo ogni appuntamento (surplus), per permetterti di prepararti al prossimo cliente.
              </p>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
