import styles from './ProductCard.module.scss';

interface ProductCardProps {
  id: string;
  name: string;
  imageUrl?: string;
  pdfs?: string[];
  onOpenDocuments?: (productName: string, pdfNames: string[]) => void;
}

export function ProductCard({ name, imageUrl, pdfs, onOpenDocuments }: ProductCardProps) {
  const hasDocuments = Boolean(pdfs?.length && onOpenDocuments);
  const handleClick = () => {
    if (hasDocuments) onOpenDocuments!(name, pdfs!);
  };

  return (
    <article
      className={styles.card}
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
