import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './SlideMenu.module.scss';

interface SlideMenuProps {
  open: boolean;
  onClose: () => void;
}

const navItems = [
  { to: '/', label: 'Главная' },
  // { to: '/catalog', label: 'Каталог' },
  { to: '/about', label: 'О нас' },
];

export function SlideMenu({ open, onClose }: SlideMenuProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  return (
    <div
      className={`${styles.overlay} ${open ? styles.overlayOpen : ''}`}
      onClick={onClose}
      role="presentation"
    >
      <aside
        className={`${styles.panel} ${open ? styles.panelOpen : ''}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Меню"
      >
        <div className={styles.panelInner}>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Закрыть меню"
          >
            ×
          </button>
          <nav className={styles.nav}>
            {navItems.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={styles.navLink}
                onClick={onClose}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </aside>
    </div>
  );
}
