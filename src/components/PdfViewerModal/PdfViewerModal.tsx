import { useEffect, useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import styles from './PdfViewerModal.module.scss';

// Worker для pdf.js: Vite отдаёт URL через ?url
import workerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
pdfjs.GlobalWorkerOptions.workerSrc = workerSrc as string;

const MOBILE_BREAKPOINT = 768;

interface PdfViewerModalProps {
  fileUrl: string;
  title?: string;
  onClose: () => void;
}

export function PdfViewerModal({ fileUrl, title, onClose }: PdfViewerModalProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const contentRef = useRef<HTMLDivElement>(null);

  const isMobileWidth = containerWidth > 0 && containerWidth < MOBILE_BREAKPOINT;
  const baseWidth = containerWidth > 0 ? containerWidth : undefined;
  const zoomScale = isMobileWidth ? 1 : scale;
  // Итоговая ширина страницы в px — передаём в Page и в обёртку, чтобы канвас не сжимался
  const pageWidthPx =
    baseWidth != null ? Math.round(baseWidth * zoomScale) : undefined;

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setContainerWidth(el.clientWidth);
    });
    ro.observe(el);
    setContainerWidth(el.clientWidth);
    return () => ro.disconnect();
  }, [fileUrl]);

  useEffect(() => {
    setPageNumber(1);
    setNumPages(0);
    setError(null);
    setScale(1);
  }, [fileUrl]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  function onDocumentLoadError(err: Error) {
    setError(err.message || 'Не удалось загрузить PDF');
  }

  const prevPage = () => setPageNumber((p) => Math.max(1, p - 1));
  const nextPage = () => setPageNumber((p) => Math.min(numPages, p + 1));
  const zoomIn = () => setScale((s) => Math.min(3, s + 0.2));
  const zoomOut = () => setScale((s) => Math.max(0.5, s - 0.2));

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-label={title || 'Просмотр PDF'}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={styles.modal}>
        <header className={styles.header}>
          <h2 className={styles.title}>{title || 'Документ'}</h2>
          <div className={styles.toolbar}>
            <div className={styles.pagination}>
              <button
                type="button"
                className={styles.toolbarBtn}
                onClick={prevPage}
                disabled={pageNumber <= 1}
                aria-label="Предыдущая страница"
              >
                ‹
              </button>
              <span className={styles.pageInfo}>
                {pageNumber} / {numPages || '–'}
              </span>
              <button
                type="button"
                className={styles.toolbarBtn}
                onClick={nextPage}
                disabled={pageNumber >= numPages}
                aria-label="Следующая страница"
              >
                ›
              </button>
            </div>
            <div className={styles.zoom}>
              <button
                type="button"
                className={styles.toolbarBtn}
                onClick={zoomOut}
                disabled={scale <= 0.5 || isMobileWidth}
                aria-label="Уменьшить"
              >
                −
              </button>
              <span className={styles.scaleLabel}>
                {isMobileWidth ? 'По ширине' : `${Math.round(scale * 100)}%`}
              </span>
              <button
                type="button"
                className={styles.toolbarBtn}
                onClick={zoomIn}
                disabled={scale >= 3 || isMobileWidth}
                aria-label="Увеличить"
              >
                +
              </button>
            </div>
            <button
              type="button"
              className={styles.closeBtn}
              onClick={onClose}
              aria-label="Закрыть"
            >
              ✕
            </button>
          </div>
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
                <div className={styles.loading}>Загрузка PDF…</div>
              }
              error={
                <div className={styles.error}>Не удалось загрузить документ.</div>
              }
            >
              <div
                className={styles.pageWrap}
                style={
                  pageWidthPx != null
                    ? { width: pageWidthPx, minWidth: pageWidthPx }
                    : undefined
                }
              >
                <Page
                  key={`p-${pageNumber}-${zoomScale}`}
                  pageNumber={pageNumber}
                  width={pageWidthPx}
                  scale={pageWidthPx == null ? 1 : undefined}
                  renderTextLayer={true}
                  renderAnnotationLayer={true}
                  className={styles.page}
                />
              </div>
            </Document>
          )}
        </div>
      </div>
    </div>
  );
}
