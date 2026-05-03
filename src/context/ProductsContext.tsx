import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
} from 'firebase/firestore';
import type { Product } from '../types/product';
import { db } from '../config/firebase';

type ProductsContextValue = {
  products: Product[];
  loading: boolean;
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  findById: (id: string) => Product | undefined;
};

const ProductsContext = createContext<ProductsContextValue | null>(null);
const productsCol = collection(db, 'products');

export const ProductsProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(productsCol, (snap) => {
      setProducts(snap.docs.map((d) => ({ ...(d.data() as Product), id: d.id })));
      setLoading(false);
    });
    return unsub;
  }, []);

  const addProduct = async (product: Product) => {
    await setDoc(doc(productsCol, product.id), product);
  };

  const updateProduct = async (product: Product) => {
    await setDoc(doc(productsCol, product.id), product);
  };

  const deleteProduct = async (id: string) => {
    await deleteDoc(doc(productsCol, id));
  };

  const findById = (id: string) => products.find((p) => p.id === id);

  return (
    <ProductsContext.Provider value={{ products, loading, addProduct, updateProduct, deleteProduct, findById }}>
      {children}
    </ProductsContext.Provider>
  );
};

export const useProductsContext = (): ProductsContextValue => {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error('useProductsContext must be used within ProductsProvider');
  return ctx;
};
