import styles from './DocumentsModal.module.scss';

export interface DocumentsModalProps {
  title: string;
  documentNames: string[];
  onSelect: (url: string, displayName: string) => void;
  onClose: () => void;
}

export function DocumentsModal({ title, documentNames, onSelect, onClose }: DocumentsModalProps) {
  const handleSelect = (fileName: string) => {
    onSelect(`/${fileName}`, fileName);
  };

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-label={`Документы: ${title}`}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={styles.modal}>
        <header className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Закрыть"
          >
            ✕
          </button>
        </header>
        <ul className={styles.list}>
          {documentNames.map((name) => (
            <li key={name}>
              <button
                type="button"
                className={styles.item}
                onClick={() => handleSelect(name)}
              >
                {name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
