import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { apiFetch } from "@/lib/api";

export type SiteSettings = {
  whatsappEnabled: boolean;
  whatsappHandle: string;
};

/**
 * Default con WhatsApp spento. E cio che vedono il prerender, il primo render
 * client e il caso di API irraggiungibile: HTML statico e prima idratazione
 * coincidono, e in caso di guasto il sito degrada verso il modulo di contatto
 * invece che verso un link rotto.
 */
export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  whatsappEnabled: false,
  whatsappHandle: "",
};

const SiteSettingsContext = createContext<SiteSettings>(DEFAULT_SITE_SETTINGS);

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);

  useEffect(() => {
    let cancelled = false;

    apiFetch("/settings")
      .then((data) => {
        if (cancelled || !data) return;
        setSettings({
          whatsappEnabled: Boolean(data.whatsappEnabled),
          whatsappHandle:
            typeof data.whatsappHandle === "string" ? data.whatsappHandle : "",
        });
      })
      .catch(() => {
        // Silenzio voluto: restano i default, quindi il modulo di contatto.
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
