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
 * Costruisce un link WhatsApp per un handle, con messaggio precompilato
 * opzionale. L'handle non e piu una costante compilata: arriva dalle
 * impostazioni del sito, lette a runtime.
 */
export function buildWhatsappUrl(handle: string, message?: string): string {
  const base = `https://wa.me/${handle}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/**
 * Ponte temporaneo verso la vecchia firma, con l'handle ancora compilato.
 * Serve solo a tenere il sito in piedi mentre i punti di chiamata migrano a
 * useContactCta: va rimosso, insieme a questa costante, quando l'ultimo
 * chiamante e stato convertito.
 */
const LEGACY_WHATSAPP_HANDLE = "xprot";

/** @deprecated Usa useContactCta(): l'handle arriva dalle impostazioni. */
export function whatsappUrl(message?: string): string {
  return buildWhatsappUrl(LEGACY_WHATSAPP_HANDLE, message);
}
