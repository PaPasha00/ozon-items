import { useLayoutEffect, useState, useMemo, lazy, Suspense } from 'react';
import { createPortal } from 'react-dom';
import { useLocation } from 'react-router-dom';
import { ProductExpandRow, CatalogEmptyState, type CatalogEmptyVariant } from '../../components';
import { useSearch } from '../../contexts/SearchContext';
import { useProducts } from '../../contexts/ProductsContext';
import { useFaq } from '../../contexts/FaqContext';
import { getSortedCategoryNames, filterProducts } from '../../config/products';
import styles from './Home.module.scss';

const PdfViewerModal = lazy(() =>
  import('../../components/PdfViewerModal').then((m) => ({ default: m.PdfViewerModal }))
);

export function Home() {
  const { pathname, hash } = useLocation();
  const [pdfView, setPdfView] = useState<{ url: string; title: string } | null>(null);
  const { items: faqItems, loading: faqLoading, error: faqError } = useFaq();
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

  useLayoutEffect(() => {
    if (pathname !== '/' || hash !== '#faq') return;
    const run = () => {
      document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    const id = requestAnimationFrame(() => {
      run();
    });
    return () => cancelAnimationFrame(id);
  }, [pathname, hash, loading, faqLoading]);

  return (
    <div className={styles.home}>
      <section className={styles.section}>
        {loading && (
          <div className={styles.loadingState} role="status" aria-label="Загрузка">
            <span className={styles.pdfLoader} />
          </div>
        )}
        {error && <p className={styles.emptyState}>{error}</p>}
        {!loading && !error && displayProducts.length > 0 ? (
          <>
            <header className={styles.pageHeader}>
              <h1 className={styles.pageTitle}>Инструкции</h1>
              <p className={styles.pageLead}>
                Найдите товар по названию или артикулу на упаковке – все в одном месте
              </p>
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
                  placeholder="Название или артикул"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Поиск по названию или артикулу"
                />
                {searchQuery.trim() ? (
                  <button
                    type="button"
                    className={styles.searchClear}
                    onClick={() => setSearchQuery('')}
                    aria-label="Очистить поиск"
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
                <div className={styles.categoryFilters} role="group" aria-label="Категории">
                  <button
                    type="button"
                    className={
                      !categoryFilter ? `${styles.filterChip} ${styles.filterChipActive}` : styles.filterChip
                    }
                    onClick={() => setCategoryFilter(null)}
                  >
                    Все
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
              <ul className={styles.catalogPanel} aria-label="Список товаров">
                {list.map((product) => (
                  <li key={product.id} className={styles.stripItem}>
                    <ProductExpandRow
                      product={product}
                      accordionName="catalog"
                      onOpenPdf={(url, title) => setPdfView({ url, title })}
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
            {searchQuery.trim() ? 'Ничего не найдено' : 'Нет товаров'}
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
            Вопросы и ответы
          </h2>
          {faqLoading && <p className={styles.faqStatus}>Загрузка…</p>}
          {faqError && <p className={styles.faqStatus}>{faqError}</p>}
          {!faqLoading && !faqError && faqItems.length > 0 ? (
            <div className={styles.faqPanel} role="region" aria-label="Список вопросов">
              {faqItems.map((item, index) => (
                <div key={`${item.question}-${index}`} className={styles.faqRow}>
                  <details className={styles.faqDetails} name="faq">
                    <summary className={styles.faqSummary}>
                      <span className={styles.faqSummaryText}>{item.question}</span>
                      <span className={styles.faqSummaryChevron} aria-hidden />
                    </summary>
                    <div className={styles.faqAnswer}>{item.answer}</div>
                  </details>
                </div>
              ))}
            </div>
          ) : !faqLoading && !faqError ? (
            <p className={styles.faqStatus}>Пока нет вопросов.</p>
          ) : null}
        </div>
      </section>

      {pdfView &&
        createPortal(
          <Suspense
            fallback={
              <div className={styles.pdfLoadingOverlay} role="status" aria-label="Загрузка просмотрщика">
                <span className={styles.pdfLoader} />
              </div>
            }
          >
            <PdfViewerModal
              fileUrl={pdfView.url}
              title={pdfView.title}
              onClose={() => setPdfView(null)}
            />
          </Suspense>,
          document.body
        )}
    </div>
  );
}
