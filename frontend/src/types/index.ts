export const Category = {
  MATERNITA: "MATERNITA",
  TRATTAMENTI: "TRATTAMENTI",
  CONSULENZE: "CONSULENZE",
  YOGA: "YOGA",
  EVENTI: "EVENTI",
  ALTRI: "ALTRI",
} as const;

export type Category = (typeof Category)[keyof typeof Category];

export const CategoryLabels: Record<Category, string> = {
  [Category.MATERNITA]: "Maternità",
  [Category.TRATTAMENTI]: "Trattamenti Olistici",
  [Category.CONSULENZE]: "Consulenze",
  [Category.YOGA]: "Yoga e Meditazione",
  [Category.EVENTI]: "Laboratori / Eventi",
  [Category.ALTRI]: "Altri",
};
