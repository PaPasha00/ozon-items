/**
 * Две ссылки в сегменте шапки (третьим элементом — кнопка темы).
 * FAQ: переход на главную + скролл к блоку без хеша в URL (`scrollToFaq` в state).
 */
export const mainNav = [
  { to: '/', label: 'Каталог' },
  { to: '/', label: 'FAQ', scrollToFaq: true },
] as const;
