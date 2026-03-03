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

export function getProductPdfUrl(product: ProductItem): string | null {
  const urls = getProductPdfUrls(product);
  return urls.length > 0 ? urls[0] : null;
}

export function getProductsForDisplay(products: ProductItem[]): ProductItem[] {
  return [
    ...products,
    ...products.map((p, i) => ({ ...p, id: `${p.id}-a${i}` })),
    ...products.map((p, i) => ({ ...p, id: `${p.id}-b${i}` })),
    ...products.map((p, i) => ({ ...p, id: `${p.id}-c${i}` })),
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
