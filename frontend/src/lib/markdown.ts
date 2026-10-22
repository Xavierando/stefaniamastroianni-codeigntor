/**
 * Testo semplice da una stringa markdown, per le anteprime troncate (dove la
 * formattazione non serve e i simboli resterebbero visibili).
 */
export function stripMarkdown(text: string): string {
  return (text || "")
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1") // immagini
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // link
    .replace(/^\s{0,3}(#{1,6}|>|[-*+]|\d+\.)\s+/gm, "") // titoli, citazioni, elenchi
    .replace(/(\*\*|__|\*|_|~~|`)(.+?)\1/g, "$2") // enfasi e codice
    .replace(/\s*\n\s*/g, " ")
    .trim();
}
