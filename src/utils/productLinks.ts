/**
 * Для `openIn: "telegram"`: подмена https-ссылок t.me на `tg://`, чтобы ОС чаще открывали приложение Telegram.
 * Нестандартные пути возвращаются без изменений.
 */
export function toTelegramAppHref(href: string): string {
  const raw = href.trim();
  if (!raw) return raw;
  if (raw.toLowerCase().startsWith('tg:')) return raw;

  try {
    const u = new URL(raw);
    const host = u.hostname.toLowerCase();
    if (host !== 't.me' && host !== 'telegram.me') return raw;

    const path = u.pathname.replace(/^\//, '');
    if (!path) return raw;

    const segments = path.split('/').filter(Boolean);
    if (segments.length === 1) {
      const seg = segments[0];
      if (seg.startsWith('+')) {
        return `tg://join?invite=${encodeURIComponent(seg.slice(1))}`;
      }
      const domain = seg.split('?')[0];
      if (domain) return `tg://resolve?domain=${encodeURIComponent(domain)}`;
    }
    if (segments[0] === 'joinchat' && segments[1]) {
      return `tg://join?invite=${encodeURIComponent(segments[1])}`;
    }
  } catch {
    return raw;
  }
  return raw;
}

export function productLinkHrefForOpen(
  href: string,
  openIn: 'browser' | 'telegram' | undefined
): string {
  if (openIn === 'telegram') return toTelegramAppHref(href);
  return href.trim();
}
