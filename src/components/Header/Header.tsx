import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSearch } from '../../contexts/SearchContext';
import { SlideMenu } from '../SlideMenu';
import styles from './Header.module.scss';

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { searchQuery, setSearchQuery } = useSearch();

  return (
    <>
      <header className={styles.header}>
        <Link to="/" className={styles.logo} aria-label="На главную">
          <span className={styles.logoIcon}>O</span>
          <span className={styles.logoText}>ozon-items</span>
        </Link>
        <div className={styles.rightGroup}>
          <div className={styles.searchWrap}>
            <input
              type="search"
              className={styles.searchInput}
              placeholder="Поиск по названию, описанию, категории..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Поиск товаров"
            />
          </div>
          <button
            type="button"
            className={styles.menuButton}
            onClick={() => setMenuOpen(true)}
            aria-label="Открыть меню"
            aria-expanded={menuOpen}
          >
            <span className={styles.menuIcon} />
            <span className={styles.menuIcon} />
            <span className={styles.menuIcon} />
          </button>
        </div>
      </header>
      <SlideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
