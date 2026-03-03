import { useState, useEffect, lazy, Suspense } from 'react';
import { useSearchParams } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { ProductCard, DocumentsModal } from '../../components';
import { useSearch } from '../../contexts/SearchContext';
import { useProducts } from '../../contexts/ProductsContext';
import { getProductImageUrl, getProductsByCategory, filterProducts } from '../../config/products';
import styles from './Home.module.scss';

const PdfViewerModal = lazy(() =>
  import('../../components/PdfViewerModal').then((m) => ({ default: m.PdfViewerModal }))
);

export function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [documentsModal, setDocumentsModal] = useState<{
    productId: string;
    productName: string;
    pdfs: string[];
    imageUrl?: string;
    description?: string;
  } | null>(null);
  const [pdfView, setPdfView] = useState<{ url: string; title: string } | null>(null);
  const { searchQuery, setSearchQuery } = useSearch();
  const { displayProducts, loading, error } = useProducts();
  const filtered = filterProducts(displayProducts, searchQuery);
  const byCategory = getProductsByCategory(filtered);

  useEffect(() => {
    if (loading) return;
    const productId = searchParams.get('product');
    const file = searchParams.get('file');
    if (!productId) {
      setDocumentsModal(null);
      setPdfView(null);
      return;
    }
    const product = displayProducts.find((p) => p.id === productId);
    if (!product) {
      setDocumentsModal(null);
      setPdfView(null);
      return;
    }
    setDocumentsModal({
      productId: product.id,
      productName: product.name,
      pdfs: product.pdfs ?? [],
      imageUrl: getProductImageUrl(product),
      description: product.description,
    });
    if (file && product.pdfs?.includes(file)) {
      setPdfView({ url: `/${file}`, title: file });
    } else {
      setPdfView(null);
    }
  }, [searchParams, displayProducts, loading]);

  const handleOpenDocuments = (data: {
    id: string;
    name: string;
    imageUrl?: string;
    description?: string;
    pdfs: string[];
  }) => {
    setSearchParams((prev) => {
      const p = new URLSearchParams(prev);
      p.set('product', data.id);
      p.delete('file');
      return p;
    });
  };

  const handleCloseDocuments = () => {
    setSearchParams((prev) => {
      const p = new URLSearchParams(prev);
      p.delete('product');
      p.delete('file');
      return p;
    });
  };

  const handleSelectDocument = (_url: string, title: string) => {
    setSearchParams((prev) => {
      const p = new URLSearchParams(prev);
      p.set('file', title);
      return p;
    });
  };

  const handleClosePdf = () => {
    setSearchParams((prev) => {
      const p = new URLSearchParams(prev);
      p.delete('file');
      return p;
    });
  };

  return (
    <main className={styles.home}>
      <section className={styles.section}>
        <div className={styles.searchWrap}>
          <input
            type="search"
            className={styles.searchInput}
            placeholder="Поиск по названию, описанию, категории..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Поиск товаров"
          />
        </div>
        {loading && (
          <div className={styles.loadingState} role="status" aria-label="Загрузка">
            <span className={styles.pdfLoader} />
          </div>
        )}
        {error && <p className={styles.emptyState}>{error}</p>}
        {!loading && !error && byCategory.size > 0 ? (
          Array.from(byCategory.entries()).map(([category, items]) => (
            <div key={category} className={styles.categoryBlock}>
              <h2 className={styles.categoryTitle}>{category}</h2>
              <ul className={styles.grid}>
                {items.map((product) => (
                  <li key={product.id}>
                    <ProductCard
                      id={product.id}
                      name={product.name}
                      imageUrl={getProductImageUrl(product)}
                      description={product.description}
                      pdfs={product.pdfs}
                      onOpenDocuments={(_data) =>
                        handleOpenDocuments({
                          id: product.id,
                          name: product.name,
                          imageUrl: getProductImageUrl(product),
                          description: product.description,
                          pdfs: product.pdfs ?? [],
                        })
                      }
                    />
                  </li>
                ))}
              </ul>
            </div>
          ))
        ) : !loading && !error ? (
          <p className={styles.emptyState}>
            {searchQuery.trim() ? 'Ничего не найдено' : 'Нет товаров'}
          </p>
        ) : null}
      </section>
      {documentsModal &&
        createPortal(
          <DocumentsModal
            card={{
              name: documentsModal.productName,
              imageUrl: documentsModal.imageUrl,
              description: documentsModal.description,
              pdfs: documentsModal.pdfs,
            }}
            onSelect={handleSelectDocument}
            onClose={handleCloseDocuments}
          />,
          document.body
        )}
      {pdfView &&
        createPortal(
          <Suspense
            fallback={
              <div className={styles.pdfLoadingOverlay} role="status" aria-label="Загрузка документа">
                <span className={styles.pdfLoader} />
              </div>
            }
          >
            <PdfViewerModal
              fileUrl={pdfView.url}
              title={pdfView.title}
              onClose={handleClosePdf}
            />
          </Suspense>,
          document.body
        )}
    </main>
  );
}
