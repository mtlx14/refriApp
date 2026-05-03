export type Section = {
  id: string;
  label: string;
  emoji: string;
};

export const SECTIONS: Section[] = [
  { id: 'refrigerator', label: 'Refrigerador', emoji: '❄️' },
  { id: 'freezer', label: 'Congelador', emoji: '☃️' },
];

export const getSectionEmoji = (id: string): string =>
  SECTIONS.find((s) => s.id === id)?.emoji ?? '';
