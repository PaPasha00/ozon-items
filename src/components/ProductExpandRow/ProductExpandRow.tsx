import { useMemo } from 'react';
import type { ProductItem } from '../../config/products';
import { getProductImageUrl, type ProductPdfEntry, type ProductVideoEntry } from '../../config/products';
import { productLinkHrefForOpen } from '../../utils/productLinks';
import { useUiCopy } from '../../contexts/UiContext';
import styles from './ProductExpandRow.module.scss';

function Chevron() {
  return <span className={styles.chevron} aria-hidden />;
}

function RowChevron() {
  return <span className={styles.rowChevron} aria-hidden />;
}

function IconVideo() {
  return (
    <svg className={styles.actionGlyph} width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <rect
        x="3.5"
        y="5"
        width="13"
        height="10"
        rx="1.8"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path d="M8.2 8.8v2.4l2.1-1.2-2.1-1.2Z" fill="currentColor" />
    </svg>
  );
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

function IconTelegram() {
  return (
    <svg className={styles.actionGlyph} width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M16.5 4.5L3.5 10.2l4.2 1.2 1.8 4.8 2.2-3.4 3.3 2.4 4.5-9.7Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path d="M7.7 11.4l7.8-4.9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

interface ProductExpandRowProps {
  product: ProductItem;
  accordionName: string;
  onOpenPdf: (productId: string, fileUrl: string, title: string) => void;
  onOpenVideo: (productId: string, fileUrl: string, title: string) => void;
}

export function ProductExpandRow({ product, accordionName, onOpenPdf, onOpenVideo }: ProductExpandRowProps) {
  const { productCard: pc } = useUiCopy();
  const { id: productId, name, description, category: categoryName, article, pdfs = [], videos = [], links = [] } =
    product;
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

  const videoList = useMemo(() => {
    const seen = new Set<string>();
    const out: { name: string; url: string; meta?: string }[] = [];
    for (const entry of videos) {
      const e: ProductVideoEntry = entry;
      const file = typeof e === 'string' ? e : e?.file;
      if (!file || seen.has(file)) continue;
      seen.add(file);
      const meta = typeof e === 'string' ? undefined : e?.meta?.trim();
      out.push({ name: file, url: `/${file}`, meta: meta || undefined });
    }
    return out;
  }, [videos]);

  const linkList = useMemo(() => {
    const seen = new Set<string>();
    return links.filter((l) => {
      if (!l?.href?.trim() || !l?.label?.trim()) return false;
      const key = `${l.openIn ?? 'browser'}\t${l.href}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [links]);

  const hasMaterials = fileList.length > 0 || videoList.length > 0 || linkList.length > 0;

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
                {article ? (
                  <span>
                    {pc.articlePrefix} {article}
                  </span>
                ) : null}
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
              <ul className={styles.actionStack} aria-label={pc.materialsAriaLabel}>
                {fileList.map((f) => (
                  <li key={`pdf-${f.name}`} className={styles.actionItem}>
                    <button
                      type="button"
                      className={styles.actionRow}
                      onClick={() => onOpenPdf(productId, f.url, f.name)}
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
                {videoList.map((v) => (
                  <li key={`video-${v.name}`} className={styles.actionItem}>
                    <button
                      type="button"
                      className={styles.actionRow}
                      onClick={() => onOpenVideo(productId, v.url, v.name)}
                    >
                      <span className={styles.actionIcon} aria-hidden>
                        <IconVideo />
                      </span>
                      <span className={styles.actionTextBlock}>
                        <span className={styles.actionLabel}>{v.name}</span>
                        {v.meta ? <span className={styles.actionMeta}>{v.meta}</span> : null}
                      </span>
                      <RowChevron />
                    </button>
                  </li>
                ))}
                {linkList.map((l) => {
                  const openIn = l.openIn === 'telegram' ? 'telegram' : 'browser';
                  const href = productLinkHrefForOpen(l.href, l.openIn);
                  return (
                    <li key={`link-${openIn}-${l.href}`} className={styles.actionItem}>
                      <a
                        className={styles.actionRow}
                        href={href}
                        target={openIn === 'telegram' ? '_self' : '_blank'}
                        rel="noopener noreferrer"
                      >
                        <span className={styles.actionIcon} aria-hidden>
                          {openIn === 'telegram' ? <IconTelegram /> : <IconLinkOut />}
                        </span>
                        <span className={styles.actionTextBlock}>
                          <span className={styles.actionLabel}>{l.label}</span>
                          {l.meta ? <span className={styles.actionMeta}>{l.meta}</span> : null}
                        </span>
                        <RowChevron />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : (
            <p className={styles.noFiles}>{pc.noMaterials}</p>
          )}
        </div>
      </details>
    </div>
  );
}
