import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { useTheme } from '../../contexts/ThemeContext';
import styles from './PdfViewerModal.module.scss';

import workerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
pdfjs.GlobalWorkerOptions.workerSrc = workerSrc as string;

/** Минимальный тип страницы pdf.js для getViewport (без тяжёлых peer-импортов) */
type PdfjsPage = {
  getViewport: (opts: { scale: number; rotation?: number }) => { width: number; height: number };
  rotate: number;
};

const FIT_SHRINK = 0.99; /* тонкое поле, без обрезки и без скролла */

interface PdfViewerModalProps {
  fileUrl: string;
  title?: string;
  onClose: () => void;
}

function downloadFileName(title?: string) {
  const base = (title || 'document').replace(/[<>:"/\\|?*]+/g, ' ').trim() || 'document';
  return base.toLowerCase().endsWith('.pdf') ? base : `${base}.pdf`;
}

/** iOS-стиль: круг 31×31 и шеврон; «назад» — отражение по X */
function IosPdfPageNavIcon({ direction }: { direction: 'prev' | 'next' }) {
  const uid = useId().replace(/:/g, '');
  const clipId = `pdf-nav-clip-${uid}`;

  return (
    <svg
      className={direction === 'prev' ? styles.iosPageNavIconFlip : undefined}
      width="31"
      height="31"
      viewBox="0 0 31 31"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <clipPath id={clipId}>
          <rect width="8.90919" height="8.48533" fill="white" transform="translate(11.0454 11.2573)" />
        </clipPath>
      </defs>
      <rect className={styles.iosPageNavIconBg} width="31" height="31" rx="15.5" />
      <g clipPath={`url(#${clipId})`}>
        <path
          className={styles.iosPageNavIconChevron}
          fillRule="evenodd"
          clipRule="evenodd"
          d="M17.7594 15.9713L13.9881 19.7427L13.0454 18.8L16.3454 15.5L13.0454 12.2L13.9881 11.2573L17.7594 15.0287C17.8844 15.1537 17.9546 15.3232 17.9546 15.5C17.9546 15.6768 17.8844 15.8463 17.7594 15.9713Z"
        />
      </g>
    </svg>
  );
}

export function PdfViewerModal({ fileUrl, title, onClose }: PdfViewerModalProps) {
  const { theme } = useTheme();
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [contentSize, setContentSize] = useState({ w: 0, h: 0 });
  const [pageNatural, setPageNatural] = useState<{ w: number; h: number } | null>(null);
  const [downloadPending, setDownloadPending] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const onPdfPageLoad = useCallback((page: PdfjsPage) => {
    const v = page.getViewport({ scale: 1, rotation: page.rotate });
    setPageNatural({ w: v.width, h: v.height });
  }, []);

  const pageRenderWidth = useMemo(() => {
    const { w: cw, h: ch } = contentSize;
    if (cw < 1 || ch < 1) return undefined;
    if (pageNatural && pageNatural.w > 0 && pageNatural.h > 0) {
      const s = Math.min(cw / pageNatural.w, ch / pageNatural.h) * FIT_SHRINK;
      return Math.max(1, pageNatural.w * s);
    }
    return Math.max(1, cw * FIT_SHRINK);
  }, [contentSize, pageNatural]);

  const handleDownload = useCallback(async () => {
    const name = downloadFileName(title);
    setDownloadPending(true);
    try {
      const res = await fetch(fileUrl);
      if (!res.ok) throw new Error('fetch failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = name;
      a.rel = 'noopener';
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      const a = document.createElement('a');
      a.href = fileUrl;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.download = name;
      a.click();
    } finally {
      setDownloadPending(false);
    }
  }, [fileUrl, title]);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const measure = () => {
      const s = getComputedStyle(el);
      const px = parseFloat(s.paddingLeft) + parseFloat(s.paddingRight);
      const py = parseFloat(s.paddingTop) + parseFloat(s.paddingBottom);
      setContentSize({
        w: Math.max(0, el.clientWidth - px),
        h: Math.max(0, el.clientHeight - py),
      });
    };

    const ro = new ResizeObserver(() => {
      measure();
    });
    ro.observe(el);
    measure();
    return () => ro.disconnect();
  }, [fileUrl]);

  useEffect(() => {
    setPageNumber(1);
    setNumPages(0);
    setError(null);
    setPageNatural(null);
  }, [fileUrl]);

  useEffect(() => {
    setPageNatural(null);
  }, [pageNumber]);

  function onDocumentLoadSuccess({ numPages: n }: { numPages: number }) {
    setNumPages(n);
    setPageNumber(1);
  }

  function onDocumentLoadError(err: Error) {
    setError(err.message || 'Не удалось загрузить PDF');
  }

  const prevPage = () => setPageNumber((p) => Math.max(1, p - 1));
  const nextPage = () => setPageNumber((p) => Math.min(numPages, p + 1));

  const onSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPageNumber(Number(e.target.value));
  };

  const showPageFooter = !error;

  return (
    <div
      className={styles.overlay}
      data-theme={theme}
      role="dialog"
      aria-modal="true"
      aria-label={title || 'Просмотр PDF'}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <header className={styles.topBar} aria-label="Панель просмотра">
          <button
            type="button"
            className={styles.topBarIconBtn}
            onClick={onClose}
            aria-label="Закрыть"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
              <path
                d="M5 5l10 10M15 5L5 15"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <h2 className={styles.topBarTitle}>{title || 'Документ'}</h2>
          <button
            type="button"
            className={styles.topBarIconBtn}
            onClick={handleDownload}
            disabled={downloadPending}
            aria-label="Скачать файл"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
              <path
                d="M10 2.5v9m0 0l3-3.2M10 11.5L7 8.3M3.5 14.5V16a1.5 1.5 0 001.5 1.5h10A1.5 1.5 0 0016.5 16v-1.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </header>

        <div ref={contentRef} className={styles.content}>
          {error ? (
            <div className={styles.error}>{error}</div>
          ) : (
            <Document
              file={fileUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading={
                <div className={styles.loading} role="status" aria-label="Загрузка PDF">
                  <span className={styles.loadingSpinner} />
                </div>
              }
              error={
                <div className={styles.error}>Не удалось загрузить документ.</div>
              }
            >
              <div className={styles.pageWrap}>
                <Page
                  key={`${fileUrl}-${pageNumber}`}
                  pageNumber={pageNumber}
                  width={pageRenderWidth}
                  scale={pageRenderWidth == null ? 1 : undefined}
                  onLoadSuccess={onPdfPageLoad}
                  renderTextLayer={true}
                  renderAnnotationLayer={true}
                  className={styles.page}
                />
              </div>
            </Document>
          )}
        </div>

        {showPageFooter ? (
          <footer className={styles.pageControls} aria-label="Переход по страницам">
            <button
              type="button"
              className={styles.pageNavBtn}
              onClick={prevPage}
              disabled={pageNumber <= 1 || numPages <= 0}
              aria-label="Предыдущая страница"
            >
              <IosPdfPageNavIcon direction="prev" />
            </button>
            <div className={styles.sliderBlock}>
              <input
                type="range"
                className={styles.pageSlider}
                min={1}
                max={Math.max(1, numPages || 1)}
                value={Math.min(pageNumber, Math.max(1, numPages))}
                onChange={onSliderChange}
                disabled={numPages <= 1}
                aria-label="Номер страницы"
                aria-valuemin={1}
                aria-valuemax={numPages || 1}
                aria-valuenow={pageNumber}
              />
              <div className={styles.sliderLabel}>
                {numPages > 0 ? `${pageNumber}/${numPages}` : '–/–'}
              </div>
            </div>
            <button
              type="button"
              className={styles.pageNavBtn}
              onClick={nextPage}
              disabled={pageNumber >= numPages || numPages <= 0}
              aria-label="Следующая страница"
            >
              <IosPdfPageNavIcon direction="next" />
            </button>
          </footer>
        ) : null}
      </div>
    </div>
  );
}
