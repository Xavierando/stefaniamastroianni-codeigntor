/**
 * Site configuration and constants.
 * This is the single source of truth for the site's base URL and other global metadata.
 */

export const SITE_URL = import.meta.env.VITE_SITE_URL || "https://www.arpelux.it";

export const SITE_CONFIG = {
  name: "Stefania Mastroianni",
  title: "Stefania Mastroianni | Operatrice per la Salute e il Benessere",
  description: "Percorsi olistici di benessere, yoga, trattamenti e accompagnamento alla nascita.",
  url: SITE_URL,
  ogImage: "/images/og-image-default.webp",
};

/**
 * WhatsApp contact. The online booking flow has been disabled: all "Prenota"
 * CTAs now point here instead. `xprot` is a WhatsApp username (not a phone
 * number) — update WHATSAPP_HANDLE if it changes. wa.me resolves both.
 */
export const WHATSAPP_HANDLE = "xprot";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_HANDLE}`;

/** Build a WhatsApp deep link, optionally with a pre-filled message. */
export function whatsappUrl(message?: string): string {
  return message
    ? `${WHATSAPP_URL}?text=${encodeURIComponent(message)}`
    : WHATSAPP_URL;
}
