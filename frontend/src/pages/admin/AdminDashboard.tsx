import { Card } from "../../components/admin/ui/Card";
import { Users, CalendarDays, ImageIcon, Mail, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { apiFetch } from "../../lib/api";

export function AdminDashboardPage() {
  const [stats, setStats] = useState({
    services: 0,
    gallery: 0,
    reviews: 0,
    messages: 0,
    newsletter: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [services, gallery, reviews, contacts, newsletter] = await Promise.all([
          apiFetch("services"),
          apiFetch("gallery"),
          apiFetch("reviews"),
          apiFetch("contacts"),
          apiFetch("newsletter"),
        ]);

        setStats({
          services: Array.isArray(services) ? services.length : 0,
          gallery: Array.isArray(gallery) ? gallery.length : 0,
          reviews: Array.isArray(reviews) ? reviews.length : 0,
          messages: Array.isArray(contacts) ? contacts.length : 0,
          newsletter: Array.isArray(newsletter) ? newsletter.length : 0,
        });
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif text-brand-primary mb-2">Benvenuta, Stefania</h1>
        <p className="text-brand-contrast/60">Questo è il tuo pannello di controllo per gestire i contenuti del sito.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 flex flex-col gap-4 bg-white border border-brand-primary/10">
          <div className="flex items-center gap-3 text-brand-primary">
            <div className="p-3 bg-brand-primary/10 rounded-full">
              <CalendarDays size={24} />
            </div>
            <h3 className="font-bold text-lg">Eventi/Servizi</h3>
          </div>
          <p className="text-3xl font-bold">{loading ? "..." : stats.services}</p>
          <p className="text-sm text-brand-contrast/50">Attivi sul sito</p>
        </Card>

        <Card className="p-6 flex flex-col gap-4 bg-white border border-brand-primary/10">
          <div className="flex items-center gap-3 text-brand-primary">
            <div className="p-3 bg-brand-primary/10 rounded-full">
              <ImageIcon size={24} />
            </div>
            <h3 className="font-bold text-lg">Galleria</h3>
          </div>
          <p className="text-3xl font-bold">{loading ? "..." : stats.gallery}</p>
          <p className="text-sm text-brand-contrast/50">Immagini caricate</p>
        </Card>

        <Card className="p-6 flex flex-col gap-4 bg-white border border-brand-primary/10">
          <div className="flex items-center gap-3 text-brand-primary">
            <div className="p-3 bg-brand-primary/10 rounded-full">
              <Star size={24} />
            </div>
            <h3 className="font-bold text-lg">Recensioni</h3>
          </div>
          <p className="text-3xl font-bold">{loading ? "..." : stats.reviews}</p>
          <p className="text-sm text-brand-contrast/50">Testimonianze ricevute</p>
        </Card>

        <Card className="p-6 flex flex-col gap-4 bg-white border border-brand-primary/10">
          <div className="flex items-center gap-3 text-brand-primary">
            <div className="p-3 bg-brand-primary/10 rounded-full">
              <Mail size={24} />
            </div>
            <h3 className="font-bold text-lg">Messaggi</h3>
          </div>
          <p className="text-3xl font-bold">{loading ? "..." : stats.messages}</p>
          <p className="text-sm text-brand-contrast/50">Contatti ricevuti</p>
        </Card>

        <Card className="p-6 flex flex-col gap-4 bg-white border border-brand-primary/10">
          <div className="flex items-center gap-3 text-brand-primary">
            <div className="p-3 bg-brand-primary/10 rounded-full">
              <Users size={24} />
            </div>
            <h3 className="font-bold text-lg">Newsletter</h3>
          </div>
          <p className="text-3xl font-bold">{loading ? "..." : stats.newsletter}</p>
          <p className="text-sm text-brand-contrast/50">Iscritti totali</p>
        </Card>
      </div>
    </div>
  );
}
