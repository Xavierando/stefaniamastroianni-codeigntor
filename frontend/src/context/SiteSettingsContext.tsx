import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { apiFetch } from "@/lib/api";

export type SiteSettings = {
  whatsappEnabled: boolean;
  whatsappHandle: string;
  hasBlogPosts: boolean;
  maintenanceEnabled: boolean;
  /** true quando /settings ha risposto (o ha fallito): da qui i valori sono definitivi. */
  settingsLoaded: boolean;
};

/**
 * Default con WhatsApp spento. E cio che vedono il prerender, il primo render
 * client e il caso di API irraggiungibile: HTML statico e prima idratazione
 * coincidono, e in caso di guasto il sito degrada verso il modulo di contatto
 * invece che verso un link rotto. Allo stesso modo il blog resta nascosto
 * finche non risulta almeno un post.
 */
export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  whatsappEnabled: false,
  whatsappHandle: "",
  hasBlogPosts: false,
  maintenanceEnabled: false,
  settingsLoaded: false,
};

const SiteSettingsContext = createContext<SiteSettings>(DEFAULT_SITE_SETTINGS);

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);

  useEffect(() => {
    let cancelled = false;

    apiFetch("/settings")
      .then((data) => {
        if (cancelled || !data) return;
        setSettings((prev) => ({
          ...prev,
          whatsappEnabled: Boolean(data.whatsappEnabled),
          whatsappHandle:
            typeof data.whatsappHandle === "string" ? data.whatsappHandle : "",
          maintenanceEnabled: Boolean(data.maintenanceEnabled),
        }));
      })
      .catch(() => {
        // Silenzio voluto: restano i default, quindi il modulo di contatto.
        // Con l'API giu il sito resta visibile: meglio che chiuderlo per errore.
      })
      .finally(() => {
        if (!cancelled) setSettings((prev) => ({ ...prev, settingsLoaded: true }));
      });

    apiFetch("/posts?limit=1")
      .then((posts) => {
        if (cancelled) return;
        setSettings((prev) => ({
          ...prev,
          hasBlogPosts: Array.isArray(posts) && posts.length > 0,
        }));
      })
      .catch(() => {
        // Come sopra: senza risposta il blog resta nascosto.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <SiteSettingsContext.Provider value={settings}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings(): SiteSettings {
  return useContext(SiteSettingsContext);
}
