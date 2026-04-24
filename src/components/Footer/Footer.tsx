import { Link } from 'react-router-dom';
import { useSiteConfig } from '../../contexts/SiteContext';
import { LogoDeltima } from '../Header/LogoDeltima';
import styles from './Footer.module.scss';

export function Footer() {
  const { config } = useSiteConfig();
  const year = new Date().getFullYear();
  const name = config.siteName || 'Deltima';

  return (
    <footer className={styles.footer}>
      <div className={styles.mainRow}>
        <Link to="/" className={styles.brand} aria-label={`${name} — на главную`}>
          <LogoDeltima className={styles.footerLogo} />
        </Link>
        <p className={styles.copyright}>
          © {year} {name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
