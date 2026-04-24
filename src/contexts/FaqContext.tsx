import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { DEFAULT_UI_COPY } from '../config/uiCopy';

export interface FaqItem {
  question: string;
  answer: string;
  /** Подзаголовок группы (например «Оплата») */
  section?: string;
}

interface FaqContextValue {
  items: FaqItem[];
  loading: boolean;
  error: string | null;
}

const FaqContext = createContext<FaqContextValue | null>(null);

export function FaqProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/faq.json')
      .then((res) => {
        if (!res.ok) throw new Error(DEFAULT_UI_COPY.faq.loadError);
        return res.json();
      })
      .then((data: unknown) => {
        const list = Array.isArray(data)
          ? data
          : typeof data === 'object' &&
              data !== null &&
              Array.isArray((data as { items?: unknown }).items)
            ? (data as { items: FaqItem[] }).items
            : [];
        setItems(list);
        setError(null);
      })
      .catch(() => {
        setError(DEFAULT_UI_COPY.faq.loadError);
        setItems([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <FaqContext.Provider value={{ items, loading, error }}>
      {children}
    </FaqContext.Provider>
  );
}

export function useFaq() {
  const ctx = useContext(FaqContext);
  if (!ctx) throw new Error('useFaq must be used within FaqProvider');
  return ctx;
}
