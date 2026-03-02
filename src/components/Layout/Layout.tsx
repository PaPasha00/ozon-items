import { Outlet } from 'react-router-dom';
import { SearchProvider } from '../../contexts/SearchContext';
import { Header } from '../Header';
import styles from './Layout.module.scss';

export function Layout() {
  return (
    <SearchProvider>
      <div className={styles.layout}>
        <Header />
        <div className={styles.scrollContainer}>
          <Outlet />
        </div>
      </div>
    </SearchProvider>
  );
}
