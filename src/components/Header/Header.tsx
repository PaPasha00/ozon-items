import { Link } from 'react-router-dom';
import { useSiteConfig } from '../../contexts/SiteContext';
import { useTheme } from '../../contexts/ThemeContext';
import { mainNav } from '../../config/navigation';
import { LogoDeltima } from './LogoDeltima';
import styles from './Header.module.scss';

function IconMoon() {
  return (
    <svg
      className={styles.themeIcon}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      width="20"
      height="20"
      aria-hidden
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function IconSun() {
  return (
    <svg
      className={styles.themeIcon}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      width="20"
      height="20"
      aria-hidden
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

/** Скролл основного контента (в Layout — #app-scroll-root, не window) */
function scrollAppToTop() {
  const el = document.getElementById('app-scroll-root');
  if (el) {
    el.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

export function Header() {
  const { config } = useSiteConfig();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link
          to="/"
          className={styles.logo}
          aria-label={config.siteName ? `${config.siteName} — на главную` : 'На главную'}
          onClick={() => requestAnimationFrame(() => scrollAppToTop())}
        >
          <LogoDeltima />
        </Link>
        <div className={styles.navScroll}>
          <div className={styles.navActions}>
            <nav className={styles.navGroup} aria-label="Основная навигация">
              {mainNav.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className={styles.navBtn}
                  onClick={() => {
                    if (to === '/') {
                      requestAnimationFrame(() => scrollAppToTop());
                    }
                  }}
                >
                  {label}
                </Link>
              ))}
            </nav>
            <button
              type="button"
              className={styles.themeBtn}
              onClick={toggleTheme}
              aria-label={
                theme === 'dark' ? 'Переключить на светлую тему' : 'Переключить на тёмную тему'
              }
            >
              {theme === 'dark' ? <IconSun /> : <IconMoon />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
