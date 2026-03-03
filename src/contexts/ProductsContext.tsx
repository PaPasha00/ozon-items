import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { ProductItem } from '../config/products';
import { getProductsForDisplay as buildDisplayList } from '../config/products';

interface ProductsContextValue {
  products: ProductItem[];
  displayProducts: ProductItem[];
  loading: boolean;
  error: string | null;
}

const ProductsContext = createContext<ProductsContextValue | null>(null);

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/products.json')
      .then((res) => {
        if (!res.ok) throw new Error('Не удалось загрузить товары');
        return res.json();
      })
      .then((data: ProductItem[]) => {
        setProducts(Array.isArray(data) ? data : []);
        setError(null);
      })
      .catch((err) => setError(err.message || 'Ошибка загрузки'))
      .finally(() => setLoading(false));
  }, []);

  const displayProducts = buildDisplayList(products);

  return (
    <ProductsContext.Provider value={{ products, displayProducts, loading, error }}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error('useProducts must be used within ProductsProvider');
  return ctx;
}
