import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { DEFAULT_UI_COPY, mergeUiCopy, type UiCopy } from '../config/uiCopy';

interface UiContextValue {
  ui: UiCopy;
  loading: boolean;
  error: string | null;
}

const UiContext = createContext<UiContextValue | null>(null);

export function UiProvider({ children }: { children: ReactNode }) {
  const [ui, setUi] = useState<UiCopy>(() => structuredClone(DEFAULT_UI_COPY));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/ui.json')
      .then((res) => {
        if (!res.ok) throw new Error('ui');
        return res.json();
      })
      .then((data: unknown) => {
        setUi(mergeUiCopy(data));
        setError(null);
      })
      .catch(() => {
        setUi(structuredClone(DEFAULT_UI_COPY));
        setError(null);
      })
      .finally(() => setLoading(false));
  }, []);

  return <UiContext.Provider value={{ ui, loading, error }}>{children}</UiContext.Provider>;
}

export function useUiCopy() {
  const ctx = useContext(UiContext);
  if (!ctx) throw new Error('useUiCopy must be used within UiProvider');
  return ctx.ui;
}
