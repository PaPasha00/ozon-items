import { useEffect, useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import styles from './VideoViewerModal.module.scss';

interface VideoViewerModalProps {
  videoUrl: string;
  title?: string;
  onClose: () => void;
}

export function VideoViewerModal({ videoUrl, title, onClose }: VideoViewerModalProps) {
  const { theme } = useTheme();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  useEffect(() => {
    setError(null);
  }, [videoUrl]);

  return (
    <div
      className={styles.overlay}
      data-theme={theme}
      role="dialog"
      aria-modal="true"
      aria-label={title || 'Просмотр видео'}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <header className={styles.topBar} aria-label="Панель просмотра">
          <button type="button" className={styles.topBarIconBtn} onClick={onClose} aria-label="Закрыть">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
              <path
                d="M5 5l10 10M15 5L5 15"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <h2 className={styles.topBarTitle}>{title || 'Видео'}</h2>
          <span className={styles.topBarSpacer} aria-hidden />
        </header>

        <div className={styles.content}>
          {error ? (
            <div className={styles.error}>{error}</div>
          ) : (
            <div className={styles.videoWrap}>
              <video
                key={videoUrl}
                className={styles.video}
                controls
                playsInline
                preload="none"
                aria-label={title || 'Видео'}
                src={videoUrl}
                onError={() => setError('Не удалось загрузить видео')}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
