import { useMemo } from 'react';
import type { ProductItem } from '../../config/products';
import { getProductImageUrl, type ProductPdfEntry } from '../../config/products';
import styles from './ProductExpandRow.module.scss';

function Chevron() {
  return <span className={styles.chevron} aria-hidden />;
}

function RowChevron() {
  return <span className={styles.rowChevron} aria-hidden />;
}

function IconPdf() {
  return (
    <svg className={styles.actionGlyph} width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M4.5 3.5h6.2l3.3 3.2v8.3a1.5 1.5 0 0 1-1.5 1.5H4.5a1.5 1.5 0 0 1-1.5-1.5V5a1.5 1.5 0 0 1 1.5-1.5Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M10.5 3.5V7h2.7l.6-.1"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path d="M6.5 10.2h4M6.5 12.4h4" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  );
}

function IconLinkOut() {
  return (
    <svg className={styles.actionGlyph} width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M11.5 4.5H6a1.5 1.5 0 0 0-1.5 1.5V14A1.5 1.5 0 0 0 6 15.5h8A1.5 1.5 0 0 0 15.5 14V8.1M8.5 11.5l6-6m0 0h-3.2M14.5 5.5v3.1"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface ProductExpandRowProps {
  product: ProductItem;
  accordionName: string;
  onOpenPdf: (fileUrl: string, title: string) => void;
}

export function ProductExpandRow({ product, accordionName, onOpenPdf }: ProductExpandRowProps) {
  const { name, description, category: categoryName, article, pdfs = [], links = [] } = product;
  const category = categoryName ?? '';
  const imageUrl = getProductImageUrl(product);

  const fileList = useMemo(() => {
    const seen = new Set<string>();
    const out: { name: string; url: string; meta?: string }[] = [];
    for (const entry of pdfs) {
      const e: ProductPdfEntry = entry;
      const file = typeof e === 'string' ? e : e?.file;
      if (!file || seen.has(file)) continue;
      seen.add(file);
      const meta = typeof e === 'string' ? undefined : e?.meta?.trim();
      out.push({ name: file, url: `/${file}`, meta: meta || undefined });
    }
    return out;
  }, [pdfs]);

  const linkList = useMemo(() => {
    const seen = new Set<string>();
    return links.filter((l) => {
      if (!l?.href?.trim() || !l?.label?.trim()) return false;
      if (seen.has(l.href)) return false;
      seen.add(l.href);
      return true;
    });
  }, [links]);

  const hasMaterials = fileList.length > 0 || linkList.length > 0;

  return (
    <div className={styles.root}>
      <details className={styles.details} name={accordionName}>
        <summary className={styles.summary}>
          <span className={styles.thumbWrap} aria-hidden>
            {imageUrl ? (
              <img src={imageUrl} alt="" className={styles.thumb} loading="lazy" width={48} height={48} />
            ) : (
              <span className={styles.thumbPlaceholder} />
            )}
          </span>
          <div className={styles.titleColumn}>
            {category || article ? (
              <p className={styles.productMeta}>
                {category ? <span className={styles.productMetaText}>{category}</span> : null}
                {category && article ? (
                  <span className={styles.productMetaDot} aria-hidden>
                    {' '}
                    ·{' '}
                  </span>
                ) : null}
                {article ? <span>Арт. {article}</span> : null}
              </p>
            ) : null}
            <span className={styles.title}>{name}</span>
          </div>
          <Chevron />
        </summary>
        <div className={styles.body}>
          {description ? <p className={styles.description}>{description}</p> : null}
          {hasMaterials ? (
            <div className={styles.actionsBlock}>
              <ul className={styles.actionStack} aria-label="Файлы и ссылки">
                {fileList.map((f) => (
                  <li key={`pdf-${f.name}`} className={styles.actionItem}>
                    <button
                      type="button"
                      className={styles.actionRow}
                      onClick={() => onOpenPdf(f.url, f.name)}
                    >
                      <span className={styles.actionIcon} aria-hidden>
                        <IconPdf />
                      </span>
                      <span className={styles.actionTextBlock}>
                        <span className={styles.actionLabel}>{f.name}</span>
                        {f.meta ? <span className={styles.actionMeta}>{f.meta}</span> : null}
                      </span>
                      <RowChevron />
                    </button>
                  </li>
                ))}
                {linkList.map((l) => (
                  <li key={`link-${l.href}`} className={styles.actionItem}>
                    <a
                      className={styles.actionRow}
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className={styles.actionIcon} aria-hidden>
                        <IconLinkOut />
                      </span>
                      <span className={styles.actionTextBlock}>
                        <span className={styles.actionLabel}>{l.label}</span>
                        {l.meta ? <span className={styles.actionMeta}>{l.meta}</span> : null}
                      </span>
                      <RowChevron />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className={styles.noFiles}>Нет прикреплённых материалов.</p>
          )}
        </div>
      </details>
    </div>
  );
}
