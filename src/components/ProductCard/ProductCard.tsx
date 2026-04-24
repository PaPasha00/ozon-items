import styles from './ProductCard.module.scss';

export interface ProductCardDocumentsData {
  id: string;
  name: string;
  imageUrl?: string;
  description?: string;
  pdfs: string[];
}

interface ProductCardProps {
  id: string;
  name: string;
  imageUrl?: string;
  description?: string;
  pdfs?: string[];
  /** «Полка» — плотная карточка для горизонтального ряда (как в витринных макетах) */
  variant?: 'default' | 'shelf';
  onOpenDocuments?: (data: ProductCardDocumentsData) => void;
}

export function ProductCard({
  id,
  name,
  imageUrl,
  description,
  pdfs,
  variant = 'default',
  onOpenDocuments,
}: ProductCardProps) {
  const hasDocuments = Boolean(pdfs?.length && onOpenDocuments);
  const handleClick = () => {
    if (hasDocuments) onOpenDocuments!({ id, name, imageUrl, description, pdfs: pdfs! });
  };

  const cardClass = variant === 'shelf' ? `${styles.card} ${styles.cardShelf}` : styles.card;

  return (
    <article
      className={cardClass}
      role={hasDocuments ? 'button' : undefined}
      tabIndex={hasDocuments ? 0 : undefined}
      onClick={hasDocuments ? handleClick : undefined}
      onKeyDown={
        hasDocuments
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleClick();
              }
            }
          : undefined
      }
    >
      <div className={styles.imageWrap}>
        {imageUrl ? (
          <img src={imageUrl} alt={name} className={styles.image} loading="lazy" />
        ) : (
          <div className={styles.imagePlaceholder} aria-hidden />
        )}
      </div>
      <h3 className={styles.name}>{name}</h3>
    </article>
  );
}
