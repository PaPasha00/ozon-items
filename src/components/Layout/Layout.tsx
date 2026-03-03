import { Outlet } from 'react-router-dom';
import { SearchProvider } from '../../contexts/SearchContext';
import { ProductsProvider } from '../../contexts/ProductsContext';
import { SiteProvider } from '../../contexts/SiteContext';
import { Header } from '../Header';
import { Footer } from '../Footer';
import styles from './Layout.module.scss';

export function Layout() {
  return (
    <SearchProvider>
      <SiteProvider>
        <ProductsProvider>
          <div className={styles.layout}>
            <Header />
            <div className={styles.scrollContainer}>
              <main className={styles.main}>
                <Outlet />
              </main>
              <Footer />
            </div>
          </div>
        </ProductsProvider>
      </SiteProvider>
    </SearchProvider>
  );
}
