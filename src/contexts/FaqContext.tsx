import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export interface FaqItem {
  question: string;
  answer: string;
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
        if (!res.ok) throw new Error('Не удалось загрузить частые вопросы');
        return res.json();
      })
      .then((data: FaqItem[]) => {
        setItems(Array.isArray(data) ? data : []);
        setError(null);
      })
      .catch((err) => {
        setError(err.message || 'Ошибка загрузки');
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
