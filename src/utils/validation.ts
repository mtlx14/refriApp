import type { Product } from '../types/product';

export const isIdTaken = (id: string, products: Product[]): boolean =>
  products.some((p) => p.id === id);

export const isValidProduct = (p: Partial<Product>): boolean =>
  Boolean(p.id?.trim() && p.name?.trim() && p.entryDate?.trim());
