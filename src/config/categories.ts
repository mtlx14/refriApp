export type Category = {
  id: string;
  label: string;
  emoji: string;
};

export const CATEGORIES: Category[] = [
  { id: 'carnes',   label: 'Carnes',   emoji: '🍖' },
  { id: 'verduras', label: 'Verduras', emoji: '🥦' },
];

export const getCategoryEmoji = (id: string): string =>
  CATEGORIES.find((c) => c.id === id)?.emoji ?? '';
