import { buildWhatsappUrl } from "@/config/site";
import { useSiteSettings } from "@/context/SiteSettingsContext";

export type ContactTarget = { href: string; external: boolean };

/**
 * Unica sede della decisione "WhatsApp o modulo". Con WhatsApp attivo apre la
 * chat con il messaggio precompilato; altrimenti porta al modulo di /contatti
 * trasportando lo stesso messaggio, cosi il contesto non si perde.
 *
 * Il controllo sull'handle vuoto e difensivo: anche se il backend lo impedisce,
 * il frontend non deve poter generare "wa.me/".
 */
export function useContactCta() {
  const { whatsappEnabled, whatsappHandle } = useSiteSettings();
  const active = whatsappEnabled && whatsappHandle !== "";

  function contactTarget(message: string): ContactTarget {
    if (active) {
      return { href: buildWhatsappUrl(whatsappHandle, message), external: true };
    }
    return {
      href: `/contatti?messaggio=${encodeURIComponent(message)}#modulo`,
      external: false,
    };
  }

  return { whatsappEnabled: active, contactTarget };
}
