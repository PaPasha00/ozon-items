import styles from './ProductCard.module.scss';

interface ProductCardProps {
  id: string;
  name: string;
  imageUrl?: string;
  /** При клике открывается просмотр PDF, если передан pdfUrl */
  pdfUrl?: string | null;
  onOpenPdf?: (url: string, name: string) => void;
}

export function ProductCard({ name, imageUrl, pdfUrl, onOpenPdf }: ProductCardProps) {
  const isClickable = Boolean(pdfUrl && onOpenPdf);

  const handleClick = () => {
    if (pdfUrl && onOpenPdf) onOpenPdf(pdfUrl, name);
  };

  return (
    <article
      className={styles.card}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onClick={isClickable ? handleClick : undefined}
      onKeyDown={
        isClickable
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
