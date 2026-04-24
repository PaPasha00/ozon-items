import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export interface AboutContact {
  label: string;
  value: string;
  href: string | null;
}

export interface AboutAdvantage {
  title: string;
  slogan: string;
}

export interface AboutSocialLink {
  name: string;
  href: string;
  icon: string;
}

export interface AboutConfig {
  description: string;
  advantagesHeading: string;
  advantages: AboutAdvantage[];
  contactsHeading: string;
  contacts: AboutContact[];
  socialHeading: string;
  socialLinks: AboutSocialLink[];
}

export interface SiteConfig {
  siteName: string;
  about: AboutConfig;
}

const defaultSite: SiteConfig = {
  siteName: 'Deltima',
  about: {
    description: '',
    advantagesHeading: 'Наши преимущества',
    advantages: [],
    contactsHeading: 'Контакты',
    contacts: [],
    socialHeading: 'Мы в соцсетях',
    socialLinks: [],
  },
};

interface SiteContextValue {
  config: SiteConfig;
  loading: boolean;
  error: string | null;
}

const SiteContext = createContext<SiteContextValue | null>(null);

export function SiteProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<SiteConfig>(defaultSite);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/site.json')
      .then((res) => {
        if (!res.ok) throw new Error('Не удалось загрузить настройки');
        return res.json();
      })
      .then((data: SiteConfig) => {
        const next = {
          siteName: data.siteName ?? defaultSite.siteName,
          about: {
            ...defaultSite.about,
            ...data.about,
            advantages: Array.isArray(data.about?.advantages) ? data.about.advantages : defaultSite.about.advantages,
            contacts: Array.isArray(data.about?.contacts) ? data.about.contacts : defaultSite.about.contacts,
            socialLinks: Array.isArray(data.about?.socialLinks) ? data.about.socialLinks : defaultSite.about.socialLinks,
          },
        };
        setConfig(next);
        document.title = next.siteName;
        setError(null);
      })
      .catch((err) => {
        setError(err.message || 'Ошибка загрузки');
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <SiteContext.Provider value={{ config, loading, error }}>
      {children}
    </SiteContext.Provider>
  );
}

export function useSiteConfig() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error('useSiteConfig must be used within SiteProvider');
  return ctx;
}
