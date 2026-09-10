// Le pagine servizio alternano due sfondi lungo tutta la colonna di sezioni,
// partendo da bg-brand-base per la prima (indice 0).
const BACKGROUNDS = ["bg-brand-base", "bg-white"] as const;

/** Sfondo della sezione che occupa la posizione `index` nell'alternanza. */
export function sectionBackground(index: number) {
  return BACKGROUNDS[index % BACKGROUNDS.length];
}

/**
 * Sfondi delle due sezioni in fondo alla pagina (recensioni ed eventi).
 * Continuano la numerazione dei servizi: le recensioni prendono la posizione
 * subito dopo l'ultimo servizio, gli eventi quella dopo ancora solo se le
 * recensioni vengono effettivamente renderizzate. Cosi una sezione assente
 * non lascia un buco e non spezza l'alternanza.
 */
export function tailBackgrounds(servicesCount: number, hasReviews: boolean) {
  return {
    reviewsBgClass: sectionBackground(servicesCount),
    eventsBgClass: sectionBackground(servicesCount + (hasReviews ? 1 : 0)),
  };
}
