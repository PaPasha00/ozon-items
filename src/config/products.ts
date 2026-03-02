/**
 * Единый конфиг отображения товаров.
 * Файлы PDF лежат в public/, в поле pdf указывается имя файла (например test.pdf).
 */

export interface ProductItem {
  id: string;
  name: string;
  imageUrl: string;
  /** Имя PDF в public/ — при клике на карточку откроется просмотр */
  pdf?: string;
}

/** Базовый список товаров (id, название, картинка, опционально PDF) */
export const PRODUCTS_BASE: ProductItem[] = [
  { id: '1', name: 'Путешествия', imageUrl: 'https://placehold.co/600x400/e2e8f0/64748b?text=1', pdf: 'test.pdf' },
  { id: '2', name: 'Фото советы', imageUrl: 'https://placehold.co/600x400/e2e8f0/64748b?text=2', pdf: 'test.pdf' },
  { id: '3', name: 'Canon', imageUrl: 'https://placehold.co/600x400/e2e8f0/64748b?text=3', pdf: 'test.pdf' },
  { id: '4', name: 'Объективы', imageUrl: 'https://placehold.co/600x400/e2e8f0/64748b?text=4', pdf: 'test.pdf' },
  { id: '5', name: 'Штативы', imageUrl: 'https://placehold.co/600x400/e2e8f0/64748b?text=5', pdf: 'test.pdf' },
  { id: '6', name: 'Сумки для фото', imageUrl: 'https://placehold.co/600x400/e2e8f0/64748b?text=6', pdf: 'test.pdf' },
  { id: '7', name: 'Освещение', imageUrl: 'https://placehold.co/600x400/e2e8f0/64748b?text=7', pdf: 'test.pdf' },
  { id: '8', name: 'Дроны', imageUrl: 'https://placehold.co/600x400/e2e8f0/64748b?text=8', pdf: 'test.pdf' },
  { id: '9', name: 'Аксессуары', imageUrl: 'https://placehold.co/600x400/e2e8f0/64748b?text=9', pdf: 'test.pdf' },
  { id: '10', name: 'Память', imageUrl: 'https://placehold.co/600x400/e2e8f0/64748b?text=10', pdf: 'test.pdf' },
  { id: '11', name: 'Батареи', imageUrl: 'https://placehold.co/600x400/e2e8f0/64748b?text=11', pdf: 'test.pdf' },
  { id: '12', name: 'Зум', imageUrl: 'https://placehold.co/600x400/e2e8f0/64748b?text=12', pdf: 'test.pdf' },
  { id: '13', name: 'Широкоугольник', imageUrl: 'https://placehold.co/600x400/e2e8f0/64748b?text=13', pdf: 'test.pdf' },
  { id: '14', name: 'Макро', imageUrl: 'https://placehold.co/600x400/e2e8f0/64748b?text=14', pdf: 'test.pdf' },
  { id: '15', name: 'Портрет', imageUrl: 'https://placehold.co/600x400/e2e8f0/64748b?text=15', pdf: 'test.pdf' },
  { id: '16', name: 'Пейзаж', imageUrl: 'https://placehold.co/600x400/e2e8f0/64748b?text=16', pdf: 'test.pdf' },
  { id: '17', name: 'Спорт', imageUrl: 'https://placehold.co/600x400/e2e8f0/64748b?text=17', pdf: 'test.pdf' },
  { id: '18', name: 'Видео', imageUrl: 'https://placehold.co/600x400/e2e8f0/64748b?text=18', pdf: 'test.pdf' },
  { id: '19', name: 'Микрофоны', imageUrl: 'https://placehold.co/600x400/e2e8f0/64748b?text=19', pdf: 'test.pdf' },
  { id: '20', name: 'Стабилизаторы', imageUrl: 'https://placehold.co/600x400/e2e8f0/64748b?text=20', pdf: 'test.pdf' },
];

/** URL PDF для товара: `/filename.pdf` или null, если pdf не задан */
export function getProductPdfUrl(product: ProductItem): string | null {
  return product.pdf ? `/${product.pdf}` : null;
}

/** Список для отображения на главной (дублируем для проверки скролла на всех устройствах) */
export function getProductsForDisplay(): ProductItem[] {
  return [
    ...PRODUCTS_BASE,
    ...PRODUCTS_BASE.map((p, i) => ({ ...p, id: `${p.id}-a${i}` })),
    ...PRODUCTS_BASE.map((p, i) => ({ ...p, id: `${p.id}-b${i}` })),
    ...PRODUCTS_BASE.map((p, i) => ({ ...p, id: `${p.id}-c${i}` })),
  ];
}
