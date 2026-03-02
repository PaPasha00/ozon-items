import { useState } from 'react';
import { createPortal } from 'react-dom';
import { ProductCard, PdfViewerModal, DocumentsModal } from '../../components';
import { useSearch } from '../../contexts/SearchContext';
import { getProductImageUrl, getProductsForDisplay, getProductsByCategory, filterProducts } from '../../config/products';
import styles from './Home.module.scss';

export function Home() {
  const [documentsModal, setDocumentsModal] = useState<{ productName: string; pdfs: string[] } | null>(null);
  const [pdfView, setPdfView] = useState<{ url: string; title: string } | null>(null);
  const { searchQuery, setSearchQuery } = useSearch();
  const products = getProductsForDisplay();
  const filtered = filterProducts(products, searchQuery);
  const byCategory = getProductsByCategory(filtered);

  const handleOpenDocuments = (productName: string, pdfs: string[]) => {
    setDocumentsModal({ productName, pdfs });
  };

  const handleCloseDocuments = () => setDocumentsModal(null);

  const handleSelectDocument = (url: string, title: string) => {
    setDocumentsModal(null);
    setPdfView({ url, title });
  };

  const handleClosePdf = () => setPdfView(null);

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
        {byCategory.size > 0 ? (
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
                      pdfs={product.pdfs}
                      onOpenDocuments={handleOpenDocuments}
                    />
                  </li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          <p className={styles.emptyState}>
            {searchQuery.trim() ? 'Ничего не найдено' : 'Нет товаров'}
          </p>
        )}
      </section>
      {documentsModal &&
        createPortal(
          <DocumentsModal
            title={documentsModal.productName}
            documentNames={documentsModal.pdfs}
            onSelect={handleSelectDocument}
            onClose={handleCloseDocuments}
          />,
          document.body
        )}
      {pdfView &&
        createPortal(
          <PdfViewerModal
            fileUrl={pdfView.url}
            title={pdfView.title}
            onClose={handleClosePdf}
          />,
          document.body
        )}
    </main>
  );
}
