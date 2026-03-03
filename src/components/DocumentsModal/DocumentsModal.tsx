import styles from './DocumentsModal.module.scss';

export interface DocumentsModalCardData {
  name: string;
  imageUrl?: string;
  description?: string;
  pdfs: string[];
}

export interface DocumentsModalProps {
  card: DocumentsModalCardData;
  onSelect: (url: string, displayName: string) => void;
  onClose: () => void;
}

export function DocumentsModal({ card, onSelect, onClose }: DocumentsModalProps) {
  const { name, imageUrl, description, pdfs } = card;

  const handleSelect = (fileName: string) => {
    onSelect(`/${fileName}`, fileName);
  };

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-label={`Документы: ${name}`}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={styles.modal}>
        <header className={styles.header}>
          <h2 className={styles.title}>{name}</h2>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Закрыть"
          >
            ✕
          </button>
        </header>
        {(imageUrl || description) && (
          <div className={styles.topSection}>
            {imageUrl && (
              <div className={styles.thumbWrap}>
                <img src={imageUrl} alt="" className={styles.thumb} />
              </div>
            )}
            {description && (
              <div className={styles.topText}>
                <p className={styles.description}>{description}</p>
              </div>
            )}
          </div>
        )}
        <div className={styles.filesSection}>
          <h3 className={styles.filesTitle}>Файлы</h3>
          <ul className={styles.list}>
            {pdfs.map((fileName) => (
              <li key={fileName}>
                <button
                  type="button"
                  className={styles.item}
                  onClick={() => handleSelect(fileName)}
                >
                  {fileName}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
