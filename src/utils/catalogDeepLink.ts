import type { ProductItem } from '../config/products';

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

function pdfOrVideoFileNames(
  entries: Array<string | { file: string; meta?: string }> | undefined
): string[] {
  if (!entries?.length) return [];
  return entries.map((e) => (typeof e === 'string' ? e : e.file));
}

export function productHasCatalogFile(
  product: ProductItem,
  fileName: string,
  kind: CatalogMediaOpen
): boolean {
  const names =
    kind === CATALOG_MEDIA_OPEN.pdf ? pdfOrVideoFileNames(product.pdfs) : pdfOrVideoFileNames(product.videos);
  return names.includes(fileName);
}

export function stripCatalogMediaParams(searchParams: URLSearchParams): URLSearchParams {
  const n = new URLSearchParams(searchParams);
  n.delete(CATALOG_MEDIA_QS.open);
  n.delete(CATALOG_MEDIA_QS.product);
  n.delete(CATALOG_MEDIA_QS.file);
  return n;
}
