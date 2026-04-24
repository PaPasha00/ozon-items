/** Как открывать внешнюю ссылку в карточке товара */
export type ProductLinkOpenIn = 'browser' | 'telegram';

export interface ProductLinkItem {
  label: string;
  href: string;
  /** Вторая строка: «12 стр.», «3:24» и т.п. */
  meta?: string;
  /**
   * `browser` (по умолчанию) — обычная вкладка.
   * `telegram` — по возможности открыть в приложении Telegram (`tg://` для t.me).
   */
  openIn?: ProductLinkOpenIn;
}

/** Строка `file.pdf` или объект с подписью под названием */
export type ProductPdfEntry = string | { file: string; meta?: string };

/** Файл из `public/` (например `clip.mp4`) — тот же формат, что у PDF */
export type ProductVideoEntry = ProductPdfEntry;

export interface ProductItem {
  id: string;
  name: string;
  imageUrl: string;
  category: string;
  /** Артикул (SKU) для отображения в каталоге */
  article?: string;
  description?: string;
  pdfs?: ProductPdfEntry[];
  /** Видео из `public/`; сеть к файлу только при открытии модалки */
  videos?: ProductVideoEntry[];
  /** Внешние ссылки (сайт, мануал online и т.д.) */
  links?: ProductLinkItem[];
}

export function getProductImageUrl(product: ProductItem): string {
  const url = product.imageUrl.trim();
  return url.startsWith('http://') || url.startsWith('https://') ? url : `/${url}`;
}

function pdfEntryFile(entry: ProductPdfEntry): string {
  return typeof entry === 'string' ? entry : entry.file;
}

export function getPdfFileNames(pdfs?: ProductPdfEntry[] | null): string[] {
  if (!pdfs?.length) return [];
  return pdfs.map(pdfEntryFile);
}

export function getProductPdfUrls(product: ProductItem): string[] {
  if (!product.pdfs?.length) return [];
  return product.pdfs.map((e) => `/${pdfEntryFile(e)}`);
}

export function getProductPdfUrl(product: ProductItem): string | null {
  const urls = getProductPdfUrls(product);
  return urls.length > 0 ? urls[0] : null;
}

export function getProductsForDisplay(products: ProductItem[]): ProductItem[] {
  return products;
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
    const pdfMatch =
      p.pdfs?.some((e) => {
        if (typeof e === 'string') {
          return e.toLowerCase().includes(q);
        }
        return (
          e.file.toLowerCase().includes(q) ||
          (e.meta?.toLowerCase().includes(q) ?? false)
        );
      }) ?? false;
    const videoMatch =
      p.videos?.some((e) => {
        if (typeof e === 'string') {
          return e.toLowerCase().includes(q);
        }
        return (
          e.file.toLowerCase().includes(q) ||
          (e.meta?.toLowerCase().includes(q) ?? false)
        );
      }) ?? false;
    const linkMatch =
      p.links?.some(
        (l) =>
          l.label.toLowerCase().includes(q) ||
          l.href.toLowerCase().includes(q) ||
          (l.meta?.toLowerCase().includes(q) ?? false) ||
          (l.openIn?.toLowerCase().includes(q) ?? false)
      ) ?? false;
    const article = (p.article ?? '').toLowerCase();
    return (
      name.includes(q) ||
      desc.includes(q) ||
      cat.includes(q) ||
      article.includes(q) ||
      pdfMatch ||
      videoMatch ||
      linkMatch
    );
  });
}

export function getSortedCategoryNames(products: ProductItem[]): string[] {
  const set = new Set<string>();
  for (const p of products) {
    if (p.category?.trim()) set.add(p.category.trim());
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b, 'ru'));
}
