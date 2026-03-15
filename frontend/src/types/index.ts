export enum Category {
  MATERNITA = "MATERNITA",
  TRATTAMENTI = "TRATTAMENTI",
  CONSULENZE = "CONSULENZE",
  YOGA = "YOGA",
  EVENTI = "EVENTI",
  ALTRI = "ALTRI",
}

export const CategoryLabels: Record<Category, string> = {
  [Category.MATERNITA]: "Maternità",
  [Category.TRATTAMENTI]: "Trattamenti Olistici",
  [Category.CONSULENZE]: "Consulenze",
  [Category.YOGA]: "Yoga e Meditazione",
  [Category.EVENTI]: "Laboratori / Eventi",
  [Category.ALTRI]: "Altri",
};
