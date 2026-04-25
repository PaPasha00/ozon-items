import { useCallback, useEffect, useState, useMemo, lazy, Suspense } from 'react';
import { createPortal } from 'react-dom';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import {
  ProductExpandRow,
  CatalogEmptyState,
  FaqHelpCta,
  type CatalogEmptyVariant,
} from '../../components';
import { useSearch } from '../../contexts/SearchContext';
import { useProducts } from '../../contexts/ProductsContext';
import { useFaq } from '../../contexts/FaqContext';
import { useUiCopy } from '../../contexts/UiContext';
import { getSortedCategoryNames, filterProducts } from '../../config/products';
import { scrollAppToFaq } from '../../utils/scrollApp';
import {
  CATALOG_MEDIA_QS,
  CATALOG_MEDIA_OPEN,
  fileNameFromPublicUrl,
  publicUrlForCatalogFile,
  productHasCatalogFile,
  stripCatalogMediaParams,
} from '../../utils/catalogDeepLink';
import styles from './Home.module.scss';

const PdfViewerModal = lazy(() =>
  import('../../components/PdfViewerModal').then((m) => ({ default: m.PdfViewerModal }))
);
const VideoViewerModal = lazy(() =>
  import('../../components/VideoViewerModal').then((m) => ({ default: m.VideoViewerModal }))
);

type HomeLocationState = { scrollToFaq?: boolean };

export function Home() {
  const { pathname, state: locationState } = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [pdfView, setPdfView] = useState<{ url: string; title: string } | null>(null);
  const [videoView, setVideoView] = useState<{ url: string; title: string } | null>(null);
  const { items: faqItems, loading: faqLoading, error: faqError } = useFaq();
  const { catalog: catalogUi, faq: faqUi } = useUiCopy();
  const { searchQuery, setSearchQuery } = useSearch();
  const { displayProducts, loading, error } = useProducts();
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const searched = useMemo(
    () => filterProducts(displayProducts, searchQuery),
    [displayProducts, searchQuery]
  );
  const list = useMemo(() => {
    if (!categoryFilter) return searched;
    return searched.filter((p) => p.category === categoryFilter);
  }, [searched, categoryFilter]);
  const categories = useMemo(() => getSortedCategoryNames(displayProducts), [displayProducts]);

  const catalogEmptyVariant = useMemo((): CatalogEmptyVariant => {
    const q = searchQuery.trim();
    if (q && searched.length === 0) return 'search';
    if (q && categoryFilter && list.length === 0) return 'searchInCategory';
    if (categoryFilter && list.length === 0) return 'category';
    return 'search';
  }, [searchQuery, searched.length, categoryFilter, list.length]);

  useEffect(() => {
    if (pathname !== '/') return;
    const st = locationState as HomeLocationState | null;
    if (!st?.scrollToFaq) return;
    const id = window.setTimeout(() => {
      scrollAppToFaq();
      navigate('.', { replace: true, state: {} });
    }, 0);
    return () => clearTimeout(id);
  }, [pathname, locationState, navigate, loading, faqLoading]);

  const clearMediaFromUrl = useCallback(() => {
    setSearchParams((prev) => stripCatalogMediaParams(prev), { replace: true });
  }, [setSearchParams]);

  const closePdf = useCallback(() => {
    setPdfView(null);
    clearMediaFromUrl();
  }, [clearMediaFromUrl]);

  const closeVideo = useCallback(() => {
    setVideoView(null);
    clearMediaFromUrl();
  }, [clearMediaFromUrl]);

  const openPdfForProduct = useCallback(
    (productId: string, url: string, title: string) => {
      setVideoView(null);
      setPdfView({ url, title });
      setSearchParams((prev) => {
        const n = new URLSearchParams(prev);
        n.set(CATALOG_MEDIA_QS.open, CATALOG_MEDIA_OPEN.pdf);
        n.set(CATALOG_MEDIA_QS.product, productId);
        n.set(CATALOG_MEDIA_QS.file, fileNameFromPublicUrl(url));
        return n;
      }, { replace: false });
    },
    [setSearchParams]
  );

  const openVideoForProduct = useCallback(
    (productId: string, url: string, title: string) => {
      setPdfView(null);
      setVideoView({ url, title });
      setSearchParams((prev) => {
        const n = new URLSearchParams(prev);
        n.set(CATALOG_MEDIA_QS.open, CATALOG_MEDIA_OPEN.video);
        n.set(CATALOG_MEDIA_QS.product, productId);
        n.set(CATALOG_MEDIA_QS.file, fileNameFromPublicUrl(url));
        return n;
      }, { replace: false });
    },
    [setSearchParams]
  );

  useEffect(() => {
    const o = searchParams.get(CATALOG_MEDIA_QS.open);
    const p = searchParams.get(CATALOG_MEDIA_QS.product);
    const fRaw = searchParams.get(CATALOG_MEDIA_QS.file);
    if (!o || !p || !fRaw) {
      setPdfView(null);
      setVideoView(null);
      return;
    }
    if (loading) return;

    let fileName: string;
    try {
      fileName = decodeURIComponent(fRaw);
    } catch {
      fileName = fRaw;
    }

    if (o !== CATALOG_MEDIA_OPEN.pdf && o !== CATALOG_MEDIA_OPEN.video) {
      setSearchParams((prev) => stripCatalogMediaParams(prev), { replace: true });
      setPdfView(null);
      setVideoView(null);
      return;
    }

    const product = displayProducts.find((x) => x.id === p);
    if (!product) {
      setSearchParams((prev) => stripCatalogMediaParams(prev), { replace: true });
      setPdfView(null);
      setVideoView(null);
      return;
    }

    if (!productHasCatalogFile(product, fileName, o)) {
      setSearchParams((prev) => stripCatalogMediaParams(prev), { replace: true });
      setPdfView(null);
      setVideoView(null);
      return;
    }

    const url = publicUrlForCatalogFile(fileName);
    const title = fileName;

    if (o === CATALOG_MEDIA_OPEN.pdf) {
      setVideoView(null);
      setPdfView((prev) => (prev?.url === url && prev.title === title ? prev : { url, title }));
    } else {
      setPdfView(null);
      setVideoView((prev) => (prev?.url === url && prev.title === title ? prev : { url, title }));
    }
  }, [searchParams, loading, displayProducts, setSearchParams]);

  return (
    <div className={styles.home}>
      <section className={styles.section}>
        {loading && (
          <div className={styles.loadingState} role="status" aria-label={catalogUi.loadingAria}>
            <span className={styles.pdfLoader} />
          </div>
        )}
        {error && <p className={styles.emptyState}>{error}</p>}
        {!loading && !error && displayProducts.length > 0 ? (
          <>
            <header className={styles.pageHeader}>
              <h1 className={styles.pageTitle}>{catalogUi.pageTitle}</h1>
              <p className={styles.pageLead}>{catalogUi.pageLead}</p>
              <div className={styles.catalogSearch}>
                <span className={styles.searchIcon} aria-hidden>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M14.1419 15L9.02729 9.88544C8.62013 10.2216 8.1519 10.4847 7.62259 10.6747C7.09328 10.8647 6.54571 10.9597 5.97986 10.9597C4.58926 10.9597 3.41163 10.4774 2.44698 9.51274C1.48233 8.54809 1 7.37046 1 5.97986C1 4.58926 1.48233 3.41163 2.44698 2.44698C3.41163 1.48233 4.58926 1 5.97986 1C7.37046 1 8.54809 1.48233 9.51274 2.44698C10.4774 3.41163 10.9597 4.58926 10.9597 5.97986C10.9597 6.56137 10.8621 7.11678 10.6669 7.64608C10.4716 8.17539 10.2112 8.6358 9.88544 9.02729L15 14.1419L14.1419 15ZM5.97986 9.73827C7.02908 9.73827 7.91779 9.37417 8.64598 8.64598C9.37417 7.91779 9.73827 7.02908 9.73827 5.97986C9.73827 4.93064 9.37417 4.04193 8.64598 3.31374C7.91779 2.58555 7.02908 2.22145 5.97986 2.22145C4.93064 2.22145 4.04193 2.58555 3.31374 3.31374C2.58555 4.04193 2.22145 4.93064 2.22145 5.97986C2.22145 7.02908 2.58555 7.91779 3.31374 8.64598C4.04193 9.37417 4.93064 9.73827 5.97986 9.73827Z"
                      fill="currentColor"
                    />
                  </svg>
                </span>
                <input
                  type="search"
                  className={styles.searchInput}
                  placeholder={catalogUi.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label={catalogUi.searchAriaLabel}
                />
                {searchQuery.trim() ? (
                  <button
                    type="button"
                    className={styles.searchClear}
                    onClick={() => setSearchQuery('')}
                    aria-label={catalogUi.searchClearAria}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden
                    >
                      <path
                        d="M4.5 11.5L11.5 4.5M11.5 11.5L4.5 4.5"
                        stroke="currentColor"
                        strokeMiterlimit={10}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                ) : null}
              </div>
              {categories.length > 0 && (
                <div className={styles.categoryFilters} role="group" aria-label={catalogUi.categoriesAriaLabel}>
                  <button
                    type="button"
                    className={
                      !categoryFilter ? `${styles.filterChip} ${styles.filterChipActive}` : styles.filterChip
                    }
                    onClick={() => setCategoryFilter(null)}
                  >
                    {catalogUi.filterAll}
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c}
                      type="button"
                      className={
                        categoryFilter === c
                          ? `${styles.filterChip} ${styles.filterChipActive}`
                          : styles.filterChip
                      }
                      onClick={() => setCategoryFilter((prev) => (prev === c ? null : c))}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </header>
            {list.length > 0 ? (
              <ul className={styles.catalogPanel} aria-label={catalogUi.catalogListAria}>
                {list.map((product) => (
                  <li key={product.id} className={styles.stripItem}>
                    <ProductExpandRow
                      product={product}
                      accordionName="catalog"
                      onOpenPdf={openPdfForProduct}
                      onOpenVideo={openVideoForProduct}
                    />
                  </li>
                ))}
              </ul>
            ) : (
              <CatalogEmptyState
                variant={catalogEmptyVariant}
                searchQuery={searchQuery}
                onClearSearch={() => setSearchQuery('')}
                onResetCategory={() => setCategoryFilter(null)}
              />
            )}
          </>
        ) : !loading && !error ? (
          <p className={styles.emptyState}>
            {searchQuery.trim() ? catalogUi.emptySearchNoResults : catalogUi.emptyNoProducts}
          </p>
        ) : null}
      </section>

      <section
        id="faq"
        className={styles.faqSection}
        aria-labelledby="home-faq-title"
      >
        <div className={styles.faqInner}>
          <h2 className={styles.faqTitle} id="home-faq-title">
            {faqUi.sectionTitle}
          </h2>
          {faqLoading && <p className={styles.faqStatus}>{faqUi.loading}</p>}
          {faqError && <p className={styles.faqStatus}>{faqError}</p>}
          {!faqLoading && !faqError && faqItems.length > 0 ? (
            <div className={styles.faqPanel} role="region" aria-label={faqUi.listAriaLabel}>
              {faqItems.map((item, index) => (
                <div key={`${item.question}-${index}`} className={styles.faqRow}>
                  <details className={styles.faqDetails} name="faq">
                    <summary className={styles.faqSummary}>
                      <span className={styles.faqSummaryText}>{item.question}</span>
                      <span className={styles.faqSummaryChevron} aria-hidden />
                    </summary>
                    <div className={styles.faqAnswerWrap}>
                      <div className={styles.faqAnswer}>{item.answer}</div>
                    </div>
                  </details>
                </div>
              ))}
            </div>
          ) : !faqLoading && !faqError ? (
            <p className={styles.faqStatus}>{faqUi.empty}</p>
          ) : null}
          {!faqLoading ? <FaqHelpCta /> : null}
        </div>
      </section>

      {pdfView &&
        createPortal(
          <Suspense
            fallback={
              <div className={styles.pdfLoadingOverlay} role="status" aria-label={catalogUi.pdfModalLoadingAria}>
                <span className={styles.pdfLoader} />
              </div>
            }
          >
            <PdfViewerModal fileUrl={pdfView.url} title={pdfView.title} onClose={closePdf} />
          </Suspense>,
          document.body
        )}
      {videoView &&
        createPortal(
          <Suspense
            fallback={
              <div className={styles.pdfLoadingOverlay} role="status" aria-label={catalogUi.videoModalLoadingAria}>
                <span className={styles.pdfLoader} />
              </div>
            }
          >
            <VideoViewerModal videoUrl={videoView.url} title={videoView.title} onClose={closeVideo} />
          </Suspense>,
          document.body
        )}
    </div>
  );
}
