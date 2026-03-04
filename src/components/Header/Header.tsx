import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSearch } from '../../contexts/SearchContext';
import { useSiteConfig } from '../../contexts/SiteContext';
import { SlideMenu } from '../SlideMenu';
import styles from './Header.module.scss';

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const isHomePage = pathname === '/';
  const { searchQuery, setSearchQuery, mobileSearchOpen, setMobileSearchOpen } = useSearch();
  const { config } = useSiteConfig();

  return (
    <>
      <header className={styles.header}>
        <Link to="/" className={styles.logo} aria-label="На главную">
          <img
            src="/LogoKO.jpg"
            alt=""
            className={styles.logoImage}
            width={40}
            height={40}
          />
          <span className={styles.logoText}>{config.siteName}</span>
        </Link>
        <div className={styles.rightGroup}>
          {isHomePage && (
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
          )}
          {isHomePage && (
            <button
              type="button"
              className={styles.searchToggleButton}
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              aria-label={mobileSearchOpen ? 'Скрыть поиск' : 'Открыть поиск'}
              aria-expanded={mobileSearchOpen}
            >
              <span className={styles.searchToggleIcon} aria-hidden>
                {mobileSearchOpen ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>
                )}
              </span>
            </button>
          )}
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
