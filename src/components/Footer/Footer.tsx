import { Link, useLocation } from 'react-router-dom';
import styles from './Footer.module.scss';

export function Footer() {
  const { pathname } = useLocation();
  const isAboutPage = pathname === '/about';

  return (
    <footer className={styles.footer}>
      {!isAboutPage && (
        <Link to="/about" className={styles.aboutLink}>
          О нас
        </Link>
      )}
    </footer>
  );
}
