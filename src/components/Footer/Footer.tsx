import { Link, useLocation } from 'react-router-dom';
import styles from './Footer.module.scss';

export function Footer() {
  const { pathname } = useLocation();
  const isAboutPage = pathname === '/about';
  const isFaqPage = pathname === '/faq';

  return (
    <footer className={styles.footer}>
      <div className={styles.links}>
        {!isAboutPage && (
          <Link to="/about" className={styles.aboutLink}>
            О магазине
          </Link>
        )}
        {!isFaqPage && (
          <Link to="/faq" className={styles.aboutLink}>
            Частые вопросы
          </Link>
        )}
      </div>
    </footer>
  );
}
