/** Скролл основного контента (в Layout — #app-scroll-root, не window) */
export function scrollAppToTop() {
  const el = document.getElementById('app-scroll-root');
  if (el) {
    el.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

export function scrollAppToFaq() {
  document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
