import { type ProductItem, productPublicRelativeForFile } from '../config/products';

/** Query: `?open=pdf|video&p=<id товара>&f=<имя файла в public/>` */
export const CATALOG_MEDIA_QS = {
  open: 'open',
  product: 'p',
  file: 'f',
} as const;

export const CATALOG_MEDIA_OPEN = {
  pdf: 'pdf',
  video: 'video',
} as const;

export type CatalogMediaOpen = (typeof CATALOG_MEDIA_OPEN)[keyof typeof CATALOG_MEDIA_OPEN];

export function fileNameFromPublicUrl(url: string): string {
  const s = url.trim();
  if (!s) return s;
  if (s.startsWith('/')) {
    try {
      return decodeURIComponent(s.slice(1));
    } catch {
      return s.slice(1);
    }
  }
  try {
    const path = new URL(s, 'https://placeholder.local').pathname.replace(/^\//, '');
    return decodeURIComponent(path);
  } catch {
    return s;
  }
}

export function publicUrlForCatalogFile(fileName: string): string {
  const parts = fileName.split('/').filter(Boolean);
  if (parts.length === 0) return '/';
  return `/${parts.map((seg) => encodeURIComponent(seg)).join('/')}`;
}

export function productHasCatalogFile(
  product: ProductItem,
  fileName: string,
  kind: CatalogMediaOpen
): boolean {
  const entries = kind === CATALOG_MEDIA_OPEN.pdf ? product.pdfs : product.videos;
  if (!entries?.length) return false;
  return entries.some((e) => {
    const file = typeof e === 'string' ? e : e.file;
    return productPublicRelativeForFile(product, file) === fileName;
  });
}

export function stripCatalogMediaParams(searchParams: URLSearchParams): URLSearchParams {
  const n = new URLSearchParams(searchParams);
  n.delete(CATALOG_MEDIA_QS.open);
  n.delete(CATALOG_MEDIA_QS.product);
  n.delete(CATALOG_MEDIA_QS.file);
  return n;
}
