import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { apiFetch } from "@/lib/api";

export type SiteSettings = {
  whatsappEnabled: boolean;
  whatsappHandle: string;
  hasBlogPosts: boolean;
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
        }));
      })
      .catch(() => {
        // Silenzio voluto: restano i default, quindi il modulo di contatto.
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
