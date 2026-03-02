import { useState } from 'react';
import { createPortal } from 'react-dom';
import { ProductCard, PdfViewerModal } from '../../components';
import { getProductPdfUrl, getProductsForDisplay } from '../../config/products';
import styles from './Home.module.scss';

export function Home() {
  const [pdfView, setPdfView] = useState<{ url: string; title: string } | null>(null);
  const products = getProductsForDisplay();

  const handleOpenPdf = (url: string, title: string) => {
    setPdfView({ url, title });
  };

  const handleClosePdf = () => setPdfView(null);

  return (
    <main className={styles.home}>
      <section className={styles.section}>
        <ul className={styles.grid}>
          {products.map((product) => (
            <li key={product.id}>
              <ProductCard
                id={product.id}
                name={product.name}
                imageUrl={product.imageUrl}
                pdfUrl={getProductPdfUrl(product)}
                onOpenPdf={handleOpenPdf}
              />
            </li>
          ))}
        </ul>
      </section>
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
