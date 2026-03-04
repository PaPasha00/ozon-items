import { createContext, useContext, useState, type ReactNode } from 'react';

interface SearchContextValue {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  mobileSearchOpen: boolean;
  setMobileSearchOpen: (value: boolean) => void;
}

const SearchContext = createContext<SearchContextValue | null>(null);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  return (
    <SearchContext.Provider
      value={{ searchQuery, setSearchQuery, mobileSearchOpen, setMobileSearchOpen }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error('useSearch must be used within SearchProvider');
  return ctx;
}
