export interface ProductItem {
  id: string;
  name: string;
  imageUrl: string;
  category: string;
  description?: string;
  pdfs?: string[];
}

export function getProductImageUrl(product: ProductItem): string {
  const url = product.imageUrl.trim();
  return url.startsWith('http://') || url.startsWith('https://') ? url : `/${url}`;
}

export function getProductPdfUrls(product: ProductItem): string[] {
  if (!product.pdfs?.length) return [];
  return product.pdfs.map((name) => `/${name}`);
}

export const PRODUCTS_BASE: ProductItem[] = [
  { id: '1', name: 'Путешествия', imageUrl: 'testPhoto.webp', category: 'Путеводители', description: 'Гайды и маршруты для съёмки в поездках', pdfs: ['test.pdf'] },
  { id: '2', name: 'Фото советы', imageUrl: 'testPhoto.webp', category: 'Путеводители', description: 'Советы по композиции и настройкам камеры', pdfs: ['test.pdf'] },
  { id: '3', name: 'Canon', imageUrl: 'testPhoto.webp', category: 'Камеры и объективы', description: 'Зеркальные и беззеркальные камеры Canon', pdfs: ['test.pdf'] },
  { id: '4', name: 'Объективы', imageUrl: 'testPhoto.webp', category: 'Камеры и объективы', description: 'Сменные объективы для камер', pdfs: ['test.pdf'] },
  { id: '5', name: 'Штативы', imageUrl: 'testPhoto.webp', category: 'Аксессуары', description: 'Штативы и моноподы для стабильной съёмки', pdfs: ['test.pdf'] },
  { id: '6', name: 'Сумки для фото', imageUrl: 'testPhoto.webp', category: 'Аксессуары', description: 'Рюкзаки и сумки для переноски техники', pdfs: ['test.pdf'] },
  { id: '7', name: 'Освещение', imageUrl: 'testPhoto.webp', category: 'Аксессуары', description: 'Вспышки, софтбоксы и постоянный свет', pdfs: ['test.pdf'] },
  { id: '8', name: 'Дроны', imageUrl: 'testPhoto.webp', category: 'Техника', description: 'Квадрокоптеры для аэросъёмки', pdfs: ['test.pdf'] },
  { id: '9', name: 'Аксессуары', imageUrl: 'testPhoto.webp', category: 'Аксессуары', description: 'Чехлы, фильтры, пульты и прочее', pdfs: ['test.pdf'] },
  { id: '10', name: 'Память', imageUrl: 'testPhoto.webp', category: 'Комплектующие', description: 'Карты памяти SD и CF для камер', pdfs: ['test.pdf'] },
  { id: '11', name: 'Батареи', imageUrl: 'testPhoto.webp', category: 'Комплектующие', description: 'Аккумуляторы и зарядные устройства', pdfs: ['test.pdf'] },
  { id: '12', name: 'Зум', imageUrl: 'testPhoto.webp', category: 'Камеры и объективы', description: 'Зум-объективы с переменным фокусным расстоянием', pdfs: ['test.pdf'] },
  { id: '13', name: 'Широкоугольник', imageUrl: 'testPhoto.webp', category: 'Камеры и объективы', description: 'Широкоугольные объективы для пейзажа и интерьеров', pdfs: ['test.pdf'] },
  { id: '14', name: 'Макро', imageUrl: 'testPhoto.webp', category: 'Камеры и объективы', description: 'Макрообъективы для съёмки крупным планом', pdfs: ['test.pdf'] },
  { id: '15', name: 'Портрет', imageUrl: 'testPhoto.webp', category: 'Жанры съёмки', description: 'Портретная съёмка людей', pdfs: ['test.pdf'] },
  { id: '16', name: 'Пейзаж', imageUrl: 'testPhoto.webp', category: 'Жанры съёмки', description: 'Съёмка природы и городских видов', pdfs: ['test.pdf'] },
  { id: '17', name: 'Спорт', imageUrl: 'testPhoto.webp', category: 'Жанры съёмки', description: 'Динамичная съёмка спортивных событий', pdfs: ['test.pdf'] },
  { id: '18', name: 'Видео', imageUrl: 'testPhoto.webp', category: 'Видео и звук', description: 'Видеокамеры и советы по видеосъёмке', pdfs: ['test.pdf'] },
  { id: '19', name: 'Микрофоны', imageUrl: 'testPhoto.webp', category: 'Видео и звук', description: 'Микрофоны для записи звука к видео', pdfs: ['test.pdf'] },
  { id: '20', name: 'Стабилизаторы', imageUrl: 'testPhoto.webp', category: 'Видео и звук', description: 'Гимбалы и стабилизаторы для камеры', pdfs: ['test.pdf'] },
];

export function getProductPdfUrl(product: ProductItem): string | null {
  const urls = getProductPdfUrls(product);
  return urls.length > 0 ? urls[0] : null;
}

export function getProductsForDisplay(): ProductItem[] {
  return [
    ...PRODUCTS_BASE,
    ...PRODUCTS_BASE.map((p, i) => ({ ...p, id: `${p.id}-a${i}` })),
    ...PRODUCTS_BASE.map((p, i) => ({ ...p, id: `${p.id}-b${i}` })),
    ...PRODUCTS_BASE.map((p, i) => ({ ...p, id: `${p.id}-c${i}` })),
  ];
}

export function getProductsByCategory(products: ProductItem[]): Map<string, ProductItem[]> {
  const map = new Map<string, ProductItem[]>();
  for (const p of products) {
    const list = map.get(p.category) ?? [];
    list.push(p);
    map.set(p.category, list);
  }
  return map;
}

export function filterProducts(products: ProductItem[], query: string): ProductItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return products;
  return products.filter((p) => {
    const name = p.name.toLowerCase();
    const desc = (p.description ?? '').toLowerCase();
    const cat = p.category.toLowerCase();
    return name.includes(q) || desc.includes(q) || cat.includes(q);
  });
}
