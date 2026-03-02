import { useState } from 'react';
import { Link } from 'react-router-dom';
import { SlideMenu } from '../SlideMenu';
import styles from './Header.module.scss';

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className={styles.header}>
        <Link to="/" className={styles.logo} aria-label="На главную">
          <span className={styles.logoIcon}>O</span>
          <span className={styles.logoText}>ozon-items</span>
        </Link>
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
      </header>
      <SlideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
