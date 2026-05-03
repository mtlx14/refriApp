import { useProductsContext } from '../context/ProductsContext';
import type { Product } from '../types/product';
import { todayISO } from '../utils/date';
import { isIdTaken } from '../utils/validation';

export const useProducts = () => {
  const { products, addProduct, updateProduct, deleteProduct, findById } =
    useProductsContext();

  const add = (data: Omit<Product, 'createdAt'>): void => {
    addProduct({ ...data, createdAt: new Date().toISOString() });
  };

  const edit = (data: Product): void => {
    updateProduct(data);
  };

  const remove = (id: string): void => {
    deleteProduct(id);
  };

  const idExists = (id: string): boolean => isIdTaken(id, products);

  const defaultEntryDate = todayISO();

  return { products, add, edit, remove, findById, idExists, defaultEntryDate };
};
