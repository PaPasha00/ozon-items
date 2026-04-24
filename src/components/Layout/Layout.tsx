import { Outlet, useLocation } from 'react-router-dom';
import { useRef, useEffect } from 'react';
import { SearchProvider } from '../../contexts/SearchContext';
import { ProductsProvider } from '../../contexts/ProductsContext';
import { SiteProvider } from '../../contexts/SiteContext';
import { UiProvider } from '../../contexts/UiContext';
import { FaqProvider } from '../../contexts/FaqContext';
import { Header } from '../Header';
import { Footer } from '../Footer';
import styles from './Layout.module.scss';

export function Layout() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();

  useEffect(() => {
    scrollContainerRef.current?.scrollTo(0, 0);
  }, [pathname]);

  return (
    <SearchProvider>
      <SiteProvider>
        <UiProvider>
        <ProductsProvider>
          <FaqProvider>
            <div className={styles.layout}>
            <Header />
            <div
              id="app-scroll-root"
              ref={scrollContainerRef}
              className={styles.scrollContainer}
            >
              <main className={styles.main}>
                <Outlet />
              </main>
              <Footer />
            </div>
            </div>
          </FaqProvider>
        </ProductsProvider>
        </UiProvider>
      </SiteProvider>
    </SearchProvider>
  );
}
